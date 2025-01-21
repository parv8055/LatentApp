import { Router } from 'express';
import { client } from '@repo/db/client';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '../../config';
import { sendMessage } from '../../utils/twilio';
import { getToken, verifyToken } from '../../utils/totp';

const router: Router = Router();

router.get('/', function (req, res): any {
  // Cookies that have not been signed
  console.log('Cookies: ', req.cookies)

  // Cookies that have been signed
  console.log('Signed Cookies: ', req.signedCookies)
  return res.json({
    message: 'Welcome to the latent API'
  })
})

router.post('/signup', async (req, res) => {
  const number = req.body.number;
  const totp = getToken(number, "AUTH");

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
    try {
      await sendMessage(`Your OTP for latent App is ${totp}`, number);

    } catch (error) {
      res.status(500).json({
        message: 'Error while sending OTP'
      });
      return
    }
  }
  res.json({
    data: totp,
  });
});

router.post('/signup/verify', async (req, res) => {
  const number = req.body.number;
  const name = req.body.name;
  const otp = req.body.otp;

  if (process.env.NODE_ENV === "production" && !verifyToken(number, "AUTH", otp)) {
    res.json({
        message: "Invalid token"
    })
    return
}

  const user = await client.user.update({
    where: {
      number
    },
    data: {
      name,
      verified: true
    }
  })

  const token = sign({
    userId: user.id
  }, JWT_SECRET);


  res.cookie('token', token, {
    httpOnly: true
  }).json({
    verified: true
  })
});

router.post("/signin", async (req, res) => {
  const number = req.body.number;
  const totp = getToken(number, "AUTH");
  try {

      const user = await client.user.findFirstOrThrow({
          where: {
              number
          }
      });

      if (process.env.NODE_ENV === "production") {
          try {
              await sendMessage(`Your otp for logging into latent is ${totp}`, number)
          } catch(e) {
              res.status(500).json({
                  message: "Could not send otp"
              })
              return   
          }
      }

      res.json({
          message: "Otp sent"
      })
  } catch(e) {
      res.status(411).json({
          message: "User invalid"
      })
  }
});

router.post('/signin/verify', async (req, res) => {
  const number = req.body.number;
  const otp = req.body.otp;
  
  if (process.env.NODE_ENV === "production" && !verifyToken(number, "AUTH", otp)) {
    res.json({
        message: "Invalid token"
    })
    return
}

  const user = await client.user.findFirstOrThrow({
    where: {
      number
    }
  })

  const token = sign({
    userId: user.id
  }, JWT_SECRET);


  res.cookie('token', token, {
    httpOnly: true
  }).json({
    verified: true
  })
});

export default router;