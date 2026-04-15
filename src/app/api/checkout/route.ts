import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16', // or latest
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, customer } = body;

    // Convert items to Stripe format
    const line_items = items.map((item: any) => {
      // In a real production app, prices should be validated against a database
      // Here we trust the client for simplicity of the custom implementation
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: Object.values(item.selectedOptions || {}).join(' / '),
          },
          unit_amount: Math.round(item.price * 100), // Stripe expects cents
        },
        quantity: item.quantity,
      };
    });

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 600, // $6.00 in cents
              currency: 'usd',
            },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 7 },
            },
          },
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout`,
      metadata: {
        customerInfo: JSON.stringify(customer),
      },
      // Optionally pre-fill the customer's email from the shipping form
      customer_email: customer?.email,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe Custom Checkout Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
