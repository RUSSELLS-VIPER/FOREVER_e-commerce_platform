import jwt from 'jsonwebtoken'

const authUser = (req, res, next) => {
    const token = req.headers.token || (req.headers.authorization && req.headers.authorization.split(' ')[1])

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorised. Token missing' })
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.body.userId = token_decode.id
        next()
    } catch (error) {
        console.log('auth error:', error);
        return res.status(401).json({ success: false, message: 'Not authorised. Invalid token' })
    }
}

export default authUser