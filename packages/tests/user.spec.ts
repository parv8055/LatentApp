import {describe, expect, it} from 'vitest';
import axios from 'axios';

const BACKEND_URL = "http://localhost:8080"

const PHONE_NUMBER_1 = "7060334001";
const NAME_1 = "harkirat";

describe("User Signup endpoints", () => {

    it('Should check Signup work', async () => {
      const response1 = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
        number: PHONE_NUMBER_1,
      });
  
      const response2 = await axios.post(`${BACKEND_URL}/api/v1/user/signup/verify`, {
        name: NAME_1,
        number: PHONE_NUMBER_1,
        otp: "000000"
      });
  
      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
      expect(response1.data.id).not.toBeNull();
    })
  
  })

  describe("User Signin endpoints", () => {

    it('Should check Signin work', async () => {
      const response1 = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, {
        number: PHONE_NUMBER_1,
      });
  
      const response2 = await axios.post(`${BACKEND_URL}/api/v1/user/signin/verify`, {
        number: PHONE_NUMBER_1,
        otp: "000000"
      });
  
      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
      expect(response1.data.id).not.toBeNull();
      expect(response2.data.token).not.toBeNull();
    })

    // it('should check Signin doesnt work for user who doesnt exist in db', async () => {
    //   const response = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, {
    //     number: PHONE_NUMBER_1+"123" ,
    //   });
    //   expect(response.status).toBe(411);
    // })
  
  })