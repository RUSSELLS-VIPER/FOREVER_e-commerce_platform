const swaggerSpec = {
    openapi: '3.0.0',
    info: {
        title: 'E-Commerce Backend API',
        version: '1.0.0',
        description: 'API documentation for the e-commerce backend (users, products, cart, orders, payments)'
    },
    servers: [
        { url: 'http://localhost:4000', description: 'Local server' }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        },
        schemas: {
            UserRegister: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 8 }
                },
                required: ['name', 'email', 'password']
            },
            UserLogin: {
                type: 'object',
                properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' }
                },
                required: ['email', 'password']
            },
            AdminLogin: {
                type: 'object',
                properties: { email: { type: 'string' }, password: { type: 'string' } },
                required: ['email', 'password']
            },
            ProductAdd: {
                type: 'object',
                description: 'Form fields (multipart/form-data). Images should be uploaded in fields image1..image4',
                properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    price: { type: 'number' },
                    category: { type: 'string' },
                    subCategory: { type: 'string' },
                    sizes: { type: 'array', items: { type: 'string' } },
                    bestseller: { type: 'boolean' }
                },
                required: ['name', 'description', 'price', 'category', 'subCategory', 'sizes']
            },
            ProductRemove: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] },
            SingleProductRequest: { type: 'object', properties: { productId: { type: 'string' } }, required: ['productId'] },
            CartAdd: { type: 'object', properties: { userId: { type: 'string' }, itemId: { type: 'string' }, size: { type: 'string' } }, required: ['userId', 'itemId', 'size'] },
            CartUpdate: { type: 'object', properties: { userId: { type: 'string' }, itemId: { type: 'string' }, size: { type: 'string' }, quantity: { type: 'number' } }, required: ['userId', 'itemId', 'size', 'quantity'] },
            GetUserCart: { type: 'object', properties: { userId: { type: 'string' } }, required: ['userId'] },
            OrderPlace: { type: 'object', properties: { userId: { type: 'string' }, items: { type: 'array', items: { type: 'object' } }, amount: { type: 'number' }, address: { type: 'object' } }, required: ['userId', 'items', 'amount', 'address'] },
            StripePaymentRequest: { type: 'object', properties: { amount: { type: 'number' }, currency: { type: 'string' }, order: { type: 'object' } }, required: ['amount'] },
            StripeCheckoutRequest: { type: 'object', properties: { amount: { type: 'number' }, currency: { type: 'string' }, success_url: { type: 'string' }, cancel_url: { type: 'string' }, order: { type: 'object' } }, required: ['amount'] },
            RazorpayOrderRequest: { type: 'object', properties: { amount: { type: 'number' }, currency: { type: 'string' }, receipt: { type: 'string' } }, required: ['amount'] },
            RazorpayVerifyRequest: { type: 'object', properties: { razorpay_order_id: { type: 'string' }, razorpay_payment_id: { type: 'string' }, razorpay_signature: { type: 'string' }, order: { type: 'object' } }, required: ['razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature'] },
            UpdateStatusRequest: { type: 'object', properties: { orderId: { type: 'string' }, status: { type: 'string' } }, required: ['orderId', 'status'] }
        }
    },
    paths: {
        '/api/user/register': {
            post: {
                tags: ['User'],
                summary: 'Register new user',
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UserRegister' } } } },
                responses: { '201': { description: 'Created - returns token' }, '400': { description: 'Bad request' }, '409': { description: 'User exists' } }
            }
        },
        '/api/user/login': {
            post: {
                tags: ['User'],
                summary: 'Login user',
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UserLogin' } } } },
                responses: { '200': { description: 'OK - returns token' }, '404': { description: 'User not found' }, '401': { description: 'Invalid credentials' } }
            }
        },
        '/api/user/admin': {
            post: {
                tags: ['User', 'Admin'],
                summary: 'Admin login (returns admin token)',
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/AdminLogin' } } } },
                responses: { '200': { description: 'OK - returns token' }, '401': { description: 'Invalid credentials' } }
            }
        },
        '/api/product/add': {
            post: {
                tags: ['Product', 'Admin'],
                summary: 'Add new product (admin only)',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'multipart/form-data': {
                            schema: { type: 'object', properties: { name: { type: 'string' }, description: { type: 'string' }, price: { type: 'number' }, category: { type: 'string' }, subCategory: { type: 'string' }, sizes: { type: 'string', description: 'JSON array string or repeated fields' }, bestseller: { type: 'boolean' }, image1: { type: 'string', format: 'binary' }, image2: { type: 'string', format: 'binary' }, image3: { type: 'string', format: 'binary' }, image4: { type: 'string', format: 'binary' } } }
                        }
                    }
                },
                responses: { '201': { description: 'Product added' }, '400': { description: 'Validation error' } }
            }
        },
        '/api/product/remove': {
            post: {
                tags: ['Product', 'Admin'],
                summary: 'Remove a product by id (admin only)',
                security: [{ bearerAuth: [] }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductRemove' } } } },
                responses: { '200': { description: 'Product removed' }, '404': { description: 'Not found' } }
            }
        },
        '/api/product/single': {
            post: {
                tags: ['Product'],
                summary: 'Get single product details by id',
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/SingleProductRequest' } } } },
                responses: { '200': { description: 'Product object' }, '400': { description: 'Bad request' }, '404': { description: 'Not found' } }
            }
        },
        '/api/product/list': {
            get: {
                tags: ['Product'],
                summary: 'List all products',
                responses: { '200': { description: 'Array of products' } }
            }
        },
        '/api/cart/get': {
            post: {
                tags: ['Cart'],
                summary: 'Get user cart (auth required)',
                security: [{ bearerAuth: [] }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/GetUserCart' } } } },
                responses: { '200': { description: 'Returns cartData' } }
            }
        },
        '/api/cart/add': {
            post: {
                tags: ['Cart'],
                summary: 'Add item to cart (auth required)',
                security: [{ bearerAuth: [] }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CartAdd' } } } },
                responses: { '200': { description: 'Added to cart' }, '400': { description: 'Bad request' } }
            }
        },
        '/api/cart/update': {
            post: {
                tags: ['Cart'],
                summary: 'Update cart quantity (auth required)',
                security: [{ bearerAuth: [] }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CartUpdate' } } } },
                responses: { '200': { description: 'Cart updated' } }
            }
        },
        '/api/order/list': {
            post: {
                tags: ['Order', 'Admin'],
                summary: 'List all orders (admin)',
                security: [{ bearerAuth: [] }],
                responses: { '200': { description: 'Array of orders' } }
            }
        },
        '/api/order/status': {
            post: {
                tags: ['Order', 'Admin'],
                summary: 'Update order status (admin)',
                security: [{ bearerAuth: [] }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateStatusRequest' } } } },
                responses: { '200': { description: 'Order updated' }, '400': { description: 'Bad request' } }
            }
        },
        '/api/order/place': {
            post: {
                tags: ['Order'],
                summary: 'Place COD order (auth required)',
                security: [{ bearerAuth: [] }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/OrderPlace' } } } },
                responses: { '200': { description: 'Order placed' } }
            }
        },
        '/api/order/stripe': {
            post: {
                tags: ['Order', 'Payment'],
                summary: 'Create Stripe PaymentIntent (auth required)',
                security: [{ bearerAuth: [] }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/StripePaymentRequest' } } } },
                responses: { '200': { description: 'clientSecret and id' }, '400': { description: 'Bad request' } }
            }
        },
        '/api/order/stripe/checkout': {
            post: {
                tags: ['Order', 'Payment'],
                summary: 'Create Stripe Checkout session (auth required)',
                security: [{ bearerAuth: [] }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/StripeCheckoutRequest' } } } },
                responses: { '200': { description: 'Checkout session URL' } }
            }
        },
        '/api/order/stripe/webhook': {
            post: {
                tags: ['Order', 'Payment', 'Webhook'],
                summary: 'Stripe webhook (raw body) - configure Stripe webhook secret',
                description: 'Stripe sends raw JSON and sets `stripe-signature` header for verification. Do not use express.json() for this endpoint.',
                requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
                responses: { '200': { description: 'Received' }, '400': { description: 'Invalid signature / not configured' } }
            }
        },
        '/api/order/razorpay': {
            post: {
                tags: ['Order', 'Payment'],
                summary: 'Create Razorpay order (auth required)',
                security: [{ bearerAuth: [] }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RazorpayOrderRequest' } } } },
                responses: { '200': { description: 'Razorpay order object' } }
            }
        },
        '/api/order/razorpay/verify': {
            post: {
                tags: ['Order', 'Payment'],
                summary: 'Verify Razorpay payment signature and optionally create order (auth required)',
                security: [{ bearerAuth: [] }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RazorpayVerifyRequest' } } } },
                responses: { '200': { description: 'Payment verified or order created' }, '400': { description: 'Invalid signature' } }
            }
        },
        '/api/order/userorders': {
            post: {
                tags: ['Order'],
                summary: 'Get orders for a user (auth required)',
                security: [{ bearerAuth: [] }],
                requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { userId: { type: 'string' } }, required: ['userId'] } } } },
                responses: { '200': { description: 'Array of orders for user' } }
            }
        }
    }
}

export default swaggerSpec
