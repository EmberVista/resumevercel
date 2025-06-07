import { Redis } from '@upstash/redis'

// Initialize Upstash Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Queue names
export const QUEUES = {
  RESUME_GENERATION: 'resume:generation',
  FILE_DELETION: 'file:deletion',
  EMAIL_NOTIFICATION: 'email:notification',
} as const

// Job statuses
export const JOB_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const

export type QueueName = typeof QUEUES[keyof typeof QUEUES]
export type JobStatus = typeof JOB_STATUS[keyof typeof JOB_STATUS]

export interface Job<T = any> {
  id: string
  queue: QueueName
  data: T
  status: JobStatus
  attempts: number
  maxAttempts: number
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
  error?: string
}

// Queue manager class
export class QueueManager {
  private redis: Redis
  
  constructor(redis: Redis) {
    this.redis = redis
  }
  
  // Add a job to the queue
  async addJob<T>(queue: QueueName, data: T, options?: {
    maxAttempts?: number
    delay?: number
  }): Promise<Job<T>> {
    const job: Job<T> = {
      id: `${queue}:${Date.now()}:${Math.random().toString(36).substring(7)}`,
      queue,
      data,
      status: JOB_STATUS.PENDING,
      attempts: 0,
      maxAttempts: options?.maxAttempts || 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    // Store job data
    await this.redis.hset(`job:${job.id}`, job as any)
    
    // Add to queue
    if (options?.delay) {
      // Add to delayed queue with score as timestamp
      await this.redis.zadd(`queue:${queue}:delayed`, {
        score: Date.now() + options.delay,
        member: job.id,
      })
    } else {
      // Add to ready queue
      await this.redis.lpush(`queue:${queue}:ready`, job.id)
    }
    
    return job
  }
  
  // Get the next job from the queue
  async getNextJob(queue: QueueName): Promise<Job | null> {
    // First check delayed jobs
    const delayedJobs = await this.redis.zrangebyscore(
      `queue:${queue}:delayed`,
      0,
      Date.now(),
      { limit: { offset: 0, count: 1 } }
    )
    
    if (delayedJobs.length > 0) {
      const jobId = delayedJobs[0]
      await this.redis.zrem(`queue:${queue}:delayed`, jobId)
      await this.redis.lpush(`queue:${queue}:ready`, jobId)
    }
    
    // Get job from ready queue
    const jobId = await this.redis.rpoplpush(
      `queue:${queue}:ready`,
      `queue:${queue}:processing`
    )
    
    if (!jobId) return null
    
    // Get job data
    const jobData = await this.redis.hgetall(`job:${jobId}`)
    if (!jobData) return null
    
    return {
      ...jobData,
      createdAt: new Date(jobData.createdAt),
      updatedAt: new Date(jobData.updatedAt),
      completedAt: jobData.completedAt ? new Date(jobData.completedAt) : undefined,
    } as Job
  }
  
  // Update job status
  async updateJob(jobId: string, updates: Partial<Job>): Promise<void> {
    await this.redis.hset(`job:${jobId}`, {
      ...updates,
      updatedAt: new Date(),
    } as any)
  }
  
  // Complete a job
  async completeJob(jobId: string, queue: QueueName): Promise<void> {
    await this.updateJob(jobId, {
      status: JOB_STATUS.COMPLETED,
      completedAt: new Date(),
    })
    
    // Remove from processing queue
    await this.redis.lrem(`queue:${queue}:processing`, 1, jobId)
  }
  
  // Fail a job
  async failJob(jobId: string, queue: QueueName, error: string): Promise<void> {
    const job = await this.redis.hgetall(`job:${jobId}`) as any
    
    if (job.attempts >= job.maxAttempts) {
      // Max attempts reached, mark as failed
      await this.updateJob(jobId, {
        status: JOB_STATUS.FAILED,
        error,
      })
      
      // Remove from processing queue
      await this.redis.lrem(`queue:${queue}:processing`, 1, jobId)
      
      // Add to failed queue for manual inspection
      await this.redis.lpush(`queue:${queue}:failed`, jobId)
    } else {
      // Retry with exponential backoff
      await this.updateJob(jobId, {
        attempts: job.attempts + 1,
        error,
      })
      
      // Remove from processing queue
      await this.redis.lrem(`queue:${queue}:processing`, 1, jobId)
      
      // Add back to delayed queue with backoff
      const delay = Math.pow(2, job.attempts) * 1000 // Exponential backoff
      await this.redis.zadd(`queue:${queue}:delayed`, {
        score: Date.now() + delay,
        member: jobId,
      })
    }
  }
  
  // Get queue stats
  async getQueueStats(queue: QueueName) {
    const [ready, processing, delayed, failed] = await Promise.all([
      this.redis.llen(`queue:${queue}:ready`),
      this.redis.llen(`queue:${queue}:processing`),
      this.redis.zcard(`queue:${queue}:delayed`),
      this.redis.llen(`queue:${queue}:failed`),
    ])
    
    return {
      ready,
      processing,
      delayed,
      failed,
      total: ready + processing + delayed + failed,
    }
  }
}

// Export singleton instance
export const queueManager = new QueueManager(redis)