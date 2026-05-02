import express from 'express'
import { placeOrder, placeOrderStripe, placeOrderRaziorpay, allOrders, userOrder, updateStatus, verifyRazorpayPayment, createStripeCheckoutSession } from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

orderRouter.post('/place', authUser, placeOrder)
orderRouter.post('/stripe', authUser, placeOrderStripe)
orderRouter.post('/stripe/checkout', authUser, createStripeCheckoutSession)
orderRouter.post('/razorpay', authUser, placeOrderRaziorpay)
orderRouter.post('/razorpay/verify', authUser, verifyRazorpayPayment)

orderRouter.post('/userorders', authUser, userOrder)

export default orderRouter