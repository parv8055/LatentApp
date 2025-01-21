import twilio from "twilio";
import { accountSid, authToken } from "../config";


const client = twilio(accountSid, authToken);

export async function sendMessage(body: string, to: string) {
    try {
        const message = await client.messages.create({
            from: "+15677496523",
            body,
            to
          });
          console.log(message.body);
    } catch(e) {
        console.log(e);
        throw new Error("error whlie sending otp")
    }
  }
  