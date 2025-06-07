import Stripe from 'stripe'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

async function createMonthlyPrice() {
  try {
    console.log('Creating monthly recurring price...')
    
    const price = await stripe.prices.create({
      product: 'prod_SSF7FF3EiRdDFO', // Monthly Unlimited Plan product ID
      unit_amount: 2700, // $27.00
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
    })
    
    console.log('Monthly price created successfully!')
    console.log('Price ID:', price.id)
    console.log('\nAdd this to your .env.local file:')
    console.log(`STRIPE_MONTHLY_PRICE_ID=${price.id}`)
    
  } catch (error) {
    console.error('Error creating price:', error)
  }
}

createMonthlyPrice()