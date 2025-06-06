import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount / 100)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_FILE_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
export const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.docx', '.txt']

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size must be less than 10MB' }
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    const extension = file.name.toLowerCase().split('.').pop()
    if (!extension || !ALLOWED_FILE_EXTENSIONS.includes(`.${extension}`)) {
      return { valid: false, error: 'File must be PDF, DOCX, or TXT format' }
    }
  }

  return { valid: true }
}