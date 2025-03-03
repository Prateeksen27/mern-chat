import UserModel from '../Models/userModel.js'; // ✅ Corrected path
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';

const createToken = (_id) => {
    const jwtkey = process.env.JWT_SECRET_KEY;
    return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await UserModel.findOne({ email });
        if (user) return res.status(400).json("User already exists");
        if (!name || !email || !password) return res.status(400).json("All fields are required");
        if (!validator.isEmail(email)) return res.status(400).json("Email must be valid");
        if (!validator.isStrongPassword(password)) return res.status(400).json("Password must be strong");

        user = new UserModel({ name, email, password });
        
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const token = createToken(user._id);
        res.status(200).json({ _id: user._id, name, email, token });

    } catch (err) {
        console.log(err);
        res.status(500).json('Error');
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await UserModel.findOne({ email });
        if (!user) return res.status(400).json("User does not exist");
        
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(400).json("Incorrect Password");
        
        const token = createToken(user._id);
        res.status(200).json({ _id: user._id, name: user.name, email, token });
    } catch (err) {
        console.log(err);
        res.status(500).json('Error');
    }
};

const findUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await UserModel.findById(userId);
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json('Error');
    }
};

const users = async (req, res) => {
    try {
        const user = await UserModel.find();
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json('Error');
    }
};

export { registerUser, loginUser, findUser, users };
