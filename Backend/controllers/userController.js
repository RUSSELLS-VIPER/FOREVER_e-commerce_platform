import userModel from "../models/userModel.js"
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = createToken(user._id)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: 'Invalid credentials' })
        }

    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body || {}

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Name, email and password are required' })
        }

        if (typeof email !== 'string' || !validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: 'Please enter a valid email' })
        }

        if (typeof password !== 'string' || password.length < 8) {
            return res.status(400).json({ success: false, message: 'Please enter a password with at least 8 characters' })
        }

        const exists = await userModel.findOne({ email })
        if (exists) {
            return res.status(409).json({ success: false, message: 'User already exists' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({ name, email, password: hashedPassword })

        const user = await newUser.save()
        const token = createToken(user._id)
        res.status(201).json({ success: true, token })

    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: error.message })
    }

}

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body || {}

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' })
        }

        const adminEmail = (process.env.ADMIN_EMAIL || process.env.ADMIN || process.env['ADMIN-EMAIL'] || '').toString().trim()
        const adminPassword = (process.env.ADMIN_PASSWORD || process.env.ADMIM_PASSWORD || process.env['ADMIN-PASSWORD'] || '').toString().trim()

        if (!adminEmail || !adminPassword) {
            console.error('Admin credentials are not set in environment variables. Expected ADMIN_EMAIL and ADMIN_PASSWORD (or ADMIM_PASSWORD / ADMIN-PASSWORD)')
            return res.status(500).json({ success: false, message: 'Server misconfiguration' })
        }

        const isAdmin = email === adminEmail && password === adminPassword
        if (!isAdmin) return res.status(401).json({ success: false, message: 'Invalid credentials' })

        const token = jwt.sign({ role: 'admin', email }, process.env.JWT_SECRET, { expiresIn: '1d' })
        return res.json({ success: true, token })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}

export { loginUser, registerUser, adminLogin }