import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// congif dotenv
dotenv.config();

// reset token
export function genearateToken(id){
    return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '15m' })
}