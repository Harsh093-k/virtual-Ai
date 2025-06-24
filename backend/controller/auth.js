import User from "../model/user.js"; // make sure the file exists and has `User` exported
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const Signup = async (req, res) => {
    const { name, email, password } = req.body;
    console.log("Received signup data:", { name, email, password });

    if (!name || !email || !password) {
        return res.status(400).send("All fields are required");
    }

    if (password.length < 6) {
        return res.status(400).send("Password must be at least 6 characters long");
    }

    try {
        const existingUser = await User.findOne({ email });
          console.log(existingUser);
        if (existingUser) {
            return res.status(400).send("User already exists with this email");
        }
      
        const hashedPassword = bcrypt.hashSync(password, 10);
        console.log("Hashed password:", hashedPassword);

        const newUser = await User.create({ name, email, password: hashedPassword });
        const token = await jwt.sign({ userId: newUser._id }, "jhbhjghjvgfjcbhg", { expiresIn: '1d' });
        console.log("New user created:", newUser);
       
        return res.cookie('token', token, {
  httpOnly: true,
  secure: true,                
  sameSite: 'None',
  path: '/',
  maxAge: 3600 * 1000,        
})
.json({
            message: "User created successfully",
            success: true,
            newUser,
            token
        });

    } catch (err) {
        console.error("Error during signup:", err);
        return res.status(500).send("Internal server error");
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log("Login attempt:", email);

    if (!email || !password) {
        return res.status(400).send("Email and password are required");
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send("User not found");
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        const token = await jwt.sign({ userId: user._id }, "jhbhjghjvgfjcbhg", { expiresIn: '1d' });
        if (!isPasswordValid) {
            return res.status(401).send("Invalid email or password");
        }

        console.log("User logged in:", user.email);
        return res.cookie('token', token, {
  httpOnly: true,
  secure: true,                
  sameSite: 'None',
  path: '/',
  maxAge: 3600 * 1000,        
})
.json({
            message: `Welcome back ${user.name}`,
            success: true,
            user,
            token
        });

    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).send("Internal server error");
    }
};

export const logout = async(req,res) => {
    console.log("User logged out Successfully !");
    return res.clearCookie('token', {
        httpOnly: true, secure: true,
        sameSite: 'none'
    }).json({
        message: "Logged out successfully",
        success: true
    });
}
