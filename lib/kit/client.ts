import axios from 'axios'

const KIT_API_BASE_URL = 'https://api.kit.com/v4'

export class KitClient {
  private apiKey: string
  private client: any

  constructor(apiKey: string) {
    this.apiKey = apiKey
    this.client = axios.create({
      baseURL: KIT_API_BASE_URL,
      headers: {
        'X-Kit-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
    })
  }

  // Subscriber Management
  async createSubscriber(data: {
    email_address: string
    first_name?: string
    fields?: Record<string, any>
    subscriber_state?: 'active' | 'bounced' | 'cancelled' | 'complained' | 'inactive'
  }) {
    try {
      const response = await this.client.post('/subscribers', data)
      return { success: true, data: response.data }
    } catch (error: any) {
      console.error('Kit API Error:', error.response?.data || error.message)
      return { success: false, error: error.response?.data || error.message }
    }
  }

  async getSubscriberByEmail(email: string) {
    try {
      const response = await this.client.get('/subscribers', {
        params: { email_address: email }
      })
      return { success: true, data: response.data }
    } catch (error: any) {
      console.error('Kit API Error:', error.response?.data || error.message)
      return { success: false, error: error.response?.data || error.message }
    }
  }

  // Form Management
  async getForms() {
    try {
      const response = await this.client.get('/forms')
      return { success: true, data: response.data }
    } catch (error: any) {
      console.error('Kit API Error:', error.response?.data || error.message)
      return { success: false, error: error.response?.data || error.message }
    }
  }

  async addSubscriberToForm(formId: string, email: string) {
    try {
      const response = await this.client.post(`/forms/${formId}/subscribers`, {
        email_address: email,
      })
      return { success: true, data: response.data }
    } catch (error: any) {
      console.error('Kit API Error:', error.response?.data || error.message)
      return { success: false, error: error.response?.data || error.message }
    }
  }

  // Tag Management
  async getTags() {
    try {
      const response = await this.client.get('/tags')
      return { success: true, data: response.data }
    } catch (error: any) {
      console.error('Kit API Error:', error.response?.data || error.message)
      return { success: false, error: error.response?.data || error.message }
    }
  }

  async tagSubscriber(tagId: string, email: string) {
    try {
      const response = await this.client.post(`/tags/${tagId}/subscribers`, {
        email_address: email,
      })
      return { success: true, data: response.data }
    } catch (error: any) {
      console.error('Kit API Error:', error.response?.data || error.message)
      return { success: false, error: error.response?.data || error.message }
    }
  }

  // Sequence Management
  async getSequences() {
    try {
      const response = await this.client.get('/sequences')
      return { success: true, data: response.data }
    } catch (error: any) {
      console.error('Kit API Error:', error.response?.data || error.message)
      return { success: false, error: error.response?.data || error.message }
    }
  }

  async addSubscriberToSequence(sequenceId: string, email: string) {
    try {
      const response = await this.client.post(`/sequences/${sequenceId}/subscribers`, {
        email_address: email,
      })
      return { success: true, data: response.data }
    } catch (error: any) {
      console.error('Kit API Error:', error.response?.data || error.message)
      return { success: false, error: error.response?.data || error.message }
    }
  }

  // Custom Fields
  async updateSubscriberFields(subscriberId: string, fields: Record<string, any>) {
    try {
      const response = await this.client.put(`/subscribers/${subscriberId}`, {
        fields,
      })
      return { success: true, data: response.data }
    } catch (error: any) {
      console.error('Kit API Error:', error.response?.data || error.message)
      return { success: false, error: error.response?.data || error.message }
    }
  }
}

// Export a singleton instance
export const kitClient = process.env.KIT_API_KEY 
  ? new KitClient(process.env.KIT_API_KEY)
  : null