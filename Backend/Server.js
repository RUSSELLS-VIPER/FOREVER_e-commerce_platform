import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import { stripeWebhook } from './controllers/orderController.js'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './docs/swagger.js'

const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// Stripe webhook endpoint requires raw body for signature verification
app.post('/api/order/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook)

app.use(express.json())
app.use(cors())

app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('api/cart', cartRouter)
app.use('/api/order', orderRouter)

// Swagger UI - detailed API documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get('/', (req, res) => {
    res.send('API WORKING')
})

app.listen(port, () => console.log(`http://localhost:${port}`))