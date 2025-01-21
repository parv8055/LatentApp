import { Router } from 'express';
import { client } from '@repo/db/client';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '../../config';
import { sendMessage } from '../../utils/twilio';
import { getToken, verifyToken } from '../../utils/totp';

const router: Router = Router();

router.post("/signin", async (req, res) => {
  const number = req.body.number;
  const totp = getToken(number, "ADMIN_AUTH");
  try {

      const user = await client.admin.findFirstOrThrow({
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
  
  if (process.env.NODE_ENV === "production" && !verifyToken(number, "ADMIN_AUTH", otp)) {
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