import { Router } from 'express';
import {generateToken, verifyToken} from 'authenticator';
import { client } from '@repo/db/client';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '../../config';

const router:Router = Router();

router.post('/signup',async (req, res) => {
  const number = req.body.phoneNumber;
  const totp = generateToken(number + 'signup');

  const user =await client.user.upsert({
    where: {
      number
    },
    create: {
      number,
      name:""
    },
    update: {}
  });

  if(process.env.NODE_ENV === 'production'){
    //send otp to user
  }
  res.json({
    data:totp,
  });
});

router.post('/signup/verify', async (req, res) => {
  const number = req.body.phoneNumber;      
  const name = req.body.name;      
  const otp = req.body.otp;   

  if(!verifyToken(number + 'signup', otp)){
    res.json({
      message: 'Invalid OTP'
    });
    return
  }

  const userId = await client.user.update({
    where: {
      number
    },
      data: {
        name,
        verified: true
      }
  })

   const token = sign({
    userId
  }, JWT_SECRET);


  res.json({
    token
  });  
});

export default router;