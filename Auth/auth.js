import jwt from 'jsonwebtoken';

// reset token
export function genearateToken(id){
    return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '15m' })
}