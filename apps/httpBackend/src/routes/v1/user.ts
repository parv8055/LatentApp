import { Router } from 'express';
import { generateToken, verifyToken } from 'authenticator';
import { client } from '@repo/db/client';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '../../config';
import { sendMessage } from '../../utils/twilio';

const router: Router = Router();

router.get('/', function (req, res):any {
  // Cookies that have not been signed
  console.log('Cookies: ', req.cookies)

  // Cookies that have been signed
  console.log('Signed Cookies: ', req.signedCookies)
  return res.json({
    message: 'Welcome to the latent API'
  })
})


router.post('/signup', async (req, res) => {
  const number = req.body.phoneNumber;
  const totp = generateToken(number + 'signup');

  const user = await client.user.upsert({
    where: {
      number
    },
    create: {
      number,
      name: ""
    },
    update: {}
  });

  if (process.env.NODE_ENV === 'production') {
    //send otp to user
    // try {
    //   await sendMessage(`Your OTP for latent App is ${totp}`,number);

    // } catch (error) {
    //   res.status(500).json({
    //     message: 'Error while sending OTP'
    //   });
    //   return
    // }
  }
  res.json({
    data: totp,
  });
});

router.post('/signup/verify', async (req, res) => {
  const number = req.body.phoneNumber;
  const name = req.body.name;
  const otp = req.body.otp;

  if (!verifyToken(number + 'signup', otp)) {
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


  res.cookie('token', token, {
    httpOnly: true
  }).json({
    verified: true
  })
});

export default router;