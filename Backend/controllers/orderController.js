import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"

import Stripe from 'stripe'
import Razorpay from 'razorpay'

const stripeClient = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null
const razorpayClient = (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_SECRET) ? new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_SECRET }) : null


const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body
        const orderData = {
            userId, items, address, amount, paymentMethod: 'COD', payment: false, date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, { cartData: {} })

        res.json({ success: true, message: 'order placed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const placeOrderStripe = async (req, res) => {
    try {
        const { amount, currency = 'inr', order } = req.body
        if (!stripeClient) return res.status(500).json({ success: false, message: 'Stripe not configured on server' })
        if (!amount) return res.status(400).json({ success: false, message: 'amount is required' })

        // Stripe expects amount in smallest currency unit (e.g., paise for INR)
        const value = Math.round(Number(amount) * 100)

        const createParams = {
            amount: value,
            currency,
            automatic_payment_methods: { enabled: true }
        }
        // Allow passing an order object which will be stored in payment metadata for webhook processing
        if (order) {
            try {
                // ensure server-injected userId (from auth middleware) is included
                const orderCopy = { ...order }
                if (!orderCopy.userId && req.body.userId) orderCopy.userId = req.body.userId
                createParams.metadata = { order: JSON.stringify(orderCopy) }
            } catch (err) {
                // ignore metadata serialization errors
            }
        } else if (req.body.userId) {
            // if no order provided, at least include userId so webhook can link
            createParams.metadata = { order: JSON.stringify({ userId: req.body.userId }) }
        }

        const paymentIntent = await stripeClient.paymentIntents.create(createParams)

        res.json({ success: true, clientSecret: paymentIntent.client_secret, id: paymentIntent.id })
    } catch (error) {
        console.log('stripe error', error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// Create a Stripe Checkout Session and return the session URL
const createStripeCheckoutSession = async (req, res) => {
    try {
        const { amount, currency = 'inr', order } = req.body
        if (!stripeClient) return res.status(500).json({ success: false, message: 'Stripe not configured on server' })
        if (!amount) return res.status(400).json({ success: false, message: 'amount is required' })

        const value = Math.round(Number(amount) * 100)

        const session = await stripeClient.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency,
                    product_data: { name: 'Order Payment' },
                    unit_amount: value
                },
                quantity: 1
            }],
            mode: 'payment',
            success_url: req.body.success_url || `${process.env.FRONTEND_URL || 'http://localhost:5176'}/orders`,
            cancel_url: req.body.cancel_url || `${process.env.FRONTEND_URL || 'http://localhost:5176'}/placeorder`,
            metadata: { order: order ? JSON.stringify({ ...order, userId: order.userId || req.body.userId }) : JSON.stringify({ userId: req.body.userId || '' }) }
        })

        res.json({ success: true, url: session.url })
    } catch (error) {
        console.log('stripe checkout error', error)
        res.status(500).json({ success: false, message: error.message })
    }
}

const stripeWebhook = async (req, res) => {
    try {
        const sig = req.headers['stripe-signature']
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
        if (!stripeClient || !webhookSecret) return res.status(400).send('Webhook not configured')

        let event
        try {
            event = stripeClient.webhooks.constructEvent(req.body, sig, webhookSecret)
        } catch (err) {
            console.log('Webhook signature verification failed.', err.message)
            return res.status(400).send(`Webhook Error: ${err.message}`)
        }

        if (event.type === 'payment_intent.succeeded') {
            const pi = event.data.object
            // attempt to parse order metadata
            let orderMeta = null
            try {
                if (pi.metadata && pi.metadata.order) orderMeta = JSON.parse(pi.metadata.order)
            } catch (err) {
                orderMeta = null
            }

            if (orderMeta) {
                const { userId, items, amount, address } = orderMeta
                const orderData = { userId, items, amount, address, paymentMethod: 'Stripe', payment: true, date: Date.now() }
                const newOrder = new orderModel(orderData)
                await newOrder.save()
            }
        }

        res.json({ received: true })
    } catch (error) {
        console.log('stripe webhook handler error', error)
        res.status(500).json({ success: false, message: error.message })
    }
}

const placeOrderRaziorpay = async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt } = req.body
        if (!razorpayClient) return res.status(500).json({ success: false, message: 'Razorpay not configured on server' })
        if (!amount) return res.status(400).json({ success: false, message: 'amount is required' })

        // Razorpay expects amount in the smallest currency unit (paise)
        const value = Math.round(Number(amount) * 100)

        const options = {
            amount: value,
            currency,
            receipt: receipt || `rcpt_${Date.now()}`
        }

        const order = await razorpayClient.orders.create(options)
        res.json({ success: true, order })
    } catch (error) {
        console.log('razorpay error', error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// Verify Razorpay payment signature and create order in DB
const verifyRazorpayPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order } = req.body
        if (!razorpayClient) return res.status(500).json({ success: false, message: 'Razorpay not configured on server' })
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) return res.status(400).json({ success: false, message: 'Missing payment verification fields' })

        const crypto = await import('crypto')
        const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex')

        if (generated_signature !== razorpay_signature) return res.status(400).json({ success: false, message: 'Invalid signature' })

        // signature valid, persist the order if order details provided
        if (order) {
            const { userId: providedUserId, items, amount, address } = order
            const userId = providedUserId || req.body.userId
            const orderData = { userId, items, amount, address, paymentMethod: 'Razorpay', payment: true, date: Date.now() }
            const newOrder = new orderModel(orderData)
            await newOrder.save()
            return res.json({ success: true, order: newOrder })
        }

        res.json({ success: true, message: 'Payment verified' })
    } catch (error) {
        console.log('razorpay verify error', error)
        res.status(500).json({ success: false, message: error.message })
    }
}

const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const userOrder = async (req, res) => {
    try {
        const { userId } = req.body
        const orders = await orderModel.find({ userId })
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body
        if (!orderId || !status) return res.status(400).json({ success: false, message: 'orderId and status are required' })

        const updated = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true })
        if (!updated) return res.status(404).json({ success: false, message: 'Order not found' })

        res.json({ success: true, order: updated })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export { placeOrder, placeOrderStripe, createStripeCheckoutSession, placeOrderRaziorpay, verifyRazorpayPayment, stripeWebhook, allOrders, userOrder, updateStatus }