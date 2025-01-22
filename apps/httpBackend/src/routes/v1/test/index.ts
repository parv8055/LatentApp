import { client } from "@repo/db/client";
import { Router } from "express";
import { sign } from "jsonwebtoken";
import { ADMIN_JWT_PASSWORD, JWT_PASSWORD, SUPERADMIN_JWT_PASSWORD } from "../../../config";

type AdminType = "Creator" | "SuperAdmin";
const router: Router = Router();

router.post('/create-admin', async (req, res) => {
    const number = req.body.number;
    const name = req.body.name;

    const admin = await client.admin.create({
        data: {
            number,
            name,
            verified: true,
            type: "Creator"
        }
    })
    const token = sign({
        userId: admin.id
    }, ADMIN_JWT_PASSWORD);

    res.json({
        token
    })
})
router.post('/create-super-admin', async (req, res) => {
    const number = req.body.number;
    const name = req.body.name;

    const admin = await client.admin.create({
        data: {
            number,
            name,
            verified: true,
            type: "SuperAdmin"
        }
    })

    const token = sign({
        userId: admin.id
    }, SUPERADMIN_JWT_PASSWORD);

    res.json({
        token
    })
})
router.post('/create-user', async (req, res) => {
    const number = req.body.number;
    const name = req.body.name;
    const user = await client.user.create({
        data: {
            number,
            name
        }
    })

    const token = sign({
        userId: user.id
    }, JWT_PASSWORD);

    res.json({
        token
    })
})




export default router;