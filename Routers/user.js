import express from 'express';
import bcrypt from 'bcrypt';
import { getUser, newUser } from '../controller/user.js';

const router = express.Router();

// login
router.post('/user', async (req, res) => {
    try{
        // user exist
        const user = await getUser(req);
        if(!user) return res.status(404).json({error: 'user not found'});

        //validating password
        const validPassword = await bcrypt.compare( req.body.password, user.password );

        if(!validPassword) return res.status(404).json({error: 'Incorrect password'});

        res.status(200).json({data: 'logged in successfully'})

    }catch(err){
        res.status(500).json({error: 'Internal Server Error', message:err});
    }
})

// singup
router.post('/newuser', async (req, res) => {
    try{
        // check user
        const checkUser = await getUser(req);
        if(checkUser) return res.status(400).json({error: 'user already exist'});

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // saving new user
        const user = {
            email: req.body.email,
            password: hashedPassword
        }

        const savedUser = await newUser(user);

        res.status(201).json({message: 'Successfully Registered', data: savedUser});

    }catch(err){
        res.status(500).json({error: 'Internal Server Error', message:err});
    }
})


export const userRouter = router;