import bcrypt from 'bcrypt'
import { genSalt } from "bcrypt"
import Admin from '../models/userModel.js'
import genToken from '../utils/genToken.js'


export const signin = async (req, res) => {

    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please fill in all fields" })
        }

        const existingUser = await Admin.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' })
        }

        const salt = await genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const admin = new Admin({
            name,
            email,
            password: hashPassword
        })

        await admin.save()

        genToken(admin._id, res)
        res.status(201).json({
            success: true,
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            message: 'Sign in successful'
        })

    } catch (e) {
        console.log('Error occured', e)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

export const login = async (req, res) => {

    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please fill in all fields" })
        }

        const admin = await Admin.findOne({ email })
        if (!admin) {
            return res.status(400).json({ success: false, message: "Email not found" })
        }

        const isMatch = await bcrypt.compare(password, admin.password)
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid password" })
        }

        const token = genToken(admin._id)

        res.status(201).json({
            success: true,
            token,

            user: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
            },
            message: 'Logged in'
        })

    } catch (e) {
        console.log(e)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}





