import {describe, expect, it} from 'vitest';
import axios from 'axios';

const BACKEND_URL = "http://localhost:8080"

const PHONE_NUMBER_1 = "7060334001";
const NAME_1 = "harkirat";

describe("User Signup endpoints", () => {

    it('Should check Double signup doesnt work', async () => {
      const response1 = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
        number: PHONE_NUMBER_1,
      });
  
      const response2 = await axios.post(`${BACKEND_URL}/api/v1/user/signup/verify`, {
        number: PHONE_NUMBER_1,
        otp: "443707"
      });
  
      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
      expect(response1.data.id).not.toBeNull();
    })
  
  })