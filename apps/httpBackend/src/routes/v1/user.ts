import { Router } from 'express';
import {generateToken, verifyToken} from 'authenticator';
const router:Router = Router();


router.post('/signup', (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const totp = generateToken(phoneNumber + 'signup');
  res.json({
    totp
  });
});

router.post('/signup/verify', (req, res) => {
  const phoneNumber = req.body.phoneNumber;      
  const otp = req.body.otp;      
  if(!verifyToken(phoneNumber + 'signup', otp)){
    res.json({
      message: 'Invalid OTP'
    });
    return;
  }
  res.json({
    verified: true
  });  
});

export default router;