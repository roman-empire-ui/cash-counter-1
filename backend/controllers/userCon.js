import bcrypt from 'bcrypt'
import Admin from '../models/userModel.js'
import genToken from '../utils/genToken.js'




export const signin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please fill in all fields" });
    }

    // Check if user already exists
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Save new user
    const admin = new Admin({
      name,
      email,
      password: hashPassword,
    });

    await admin.save();

    // Generate JWT
    const token = genToken(admin._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
      },
      message: "User registered successfully",
    });
  } catch (e) {
    console.error("Error occurred:", e);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};




export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please fill in all fields" });
    }

    // Find user
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ success: false, message: "Email not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    // Generate JWT
    const token = genToken(admin._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
      },
      message: "Logged in successfully",
    });
  } catch (e) {
    console.error("Login error:", e);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};






