import bcrypt from 'bycrptjs';
import jwt from 'jsonwebtoken';

import UserModel from '../models/user.js';


const secret = 'test';

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const oldUser = await UserModel.findOne({ email });
        if (!oldUser) return res.status(404).json({ message: "User doesnot exist" });
        const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
        if (!isPasswordCorrect) return res.status(404).json({ message: "Invalid credentials" });
        const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });
        res.status(200).json({ result: oldUser, token });

    }
    catch (error) {
        res.status(500).json({ message: 'Something went wrong' });

    }
}
export const signup = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    try {
        const oldUser = await UserModel.findOne({ email });
        if (oldUser) return res.status(400).json({ message: "user already exists" });
        const hashedPassword = await UserModel.bcrypt.hash(password, 12);

        const result = await UserModel.create({ email, password: hashedPassword });
        const token = jwt.sign({ email: result.email, id: result._id }, secret, { expiresIn: "1hr" });
        res.status(201).json({ result, token });
    }
    catch (error) {

        res.status(500).json({ message: "something went wrong" });
    }
}
