import jwt from 'jsonwebtoken'

const adminAuth = async (req, res, next) => {
    try {
        // Read token from 'authorization' header (Bearer token) or legacy 'token' header
        let token = req.headers.authorization?.replace('Bearer ', '')
        if (!token) token = req.headers.token

        if (!token) {
            return res.status(401).json({ success: false, message: 'Not Authorize' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Check if the token has admin role
        if (decoded.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not Authorize' })
        }

        next()
    } catch (error) {
        console.error(error)
        return res.status(401).json({ success: false, message: 'Invalid or expired token' })
    }
}

export default adminAuth