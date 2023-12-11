import express from 'express';
import bcrypt from 'bcrypt';
import { getUser, getUserById, newUser } from '../controller/user.js';
import { genearateActiveToken } from '../Auth/auth.js';
import { sendActivationMail } from '../helpers/activationMail.js';

const router = express.Router();

// to send activation email
async function activationMail(email, id){
    const actToken = genearateActiveToken(id);

    const activeMail = await sendActivationMail(email, actToken);
    // console.log(sentedMail);
    if(!activeMail)  return false;

    return true;
}

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
            ...req.body,
            password: hashedPassword
        }

        const savedUser = await newUser(user);

        // Send activation mail
        const actMailSent = await activationMail(savedUser.email, savedUser._id);
        if(!actMailSent) return res.status(400).json({error: 'error sending confirmation mail', acknowledged: false});

        res.status(201).json({message: 'Successfully Registered', data: savedUser, email: 'Confirmation email is send to your email Address'});

    }catch(err){
        res.status(500).json({error: 'Internal Server Error', message:err});
    }
})

// Resend Activation email
router.get('/resend', async (req, res) => {
    try{
        // check user
        const checkUser = await getUserById(req);
        if(!checkUser) return res.status(400).json({error: 'user not found'});

        // Send activation mail
        const actMailSent = await activationMail(checkUser.email, checkUser._id);
        if(!actMailSent) return res.status(400).json({error: 'error sending confirmation mail', acknowledged: false});

        res.status(201).json({message: 'Confirmation email is send to your email Address' , acknowledged: true});

    }catch(err){
        res.status(500).json({error: 'Internal Server Error', message:err});
    }
})

// activate account
router.get('/activate/:token', async (req, res) => {
    try{
        // user exist
        const user = await getUserById(req);
        if(!user) return res.status(404).json({error: 'user not found'});
        if(user.account === 'active') return res.status(400).send('Your account is activated already');

        // change account status to active
        user.account = 'active'
        await user.save();

        res.status(201).send('Your account has been activated');

    }catch(err){
        res.status(500).json({error: 'Internal Server Error', message:err});
    }
})

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

export const userRouter = router;