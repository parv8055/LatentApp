import { Router } from 'express';
import { client } from '@repo/db/client';
import { sign } from 'jsonwebtoken';
import { CreateEventSchema } from "@repo/common/types";
import { adminMiddleware } from '../../../middleware/admin';


const router: Router = Router();

router.post('/', adminMiddleware, async (req, res) => {
    const { data, success } = CreateEventSchema.safeParse(req.body)
        // @ts-ignore
        const adminId = req.userId
    if (!success) {
        res.status(400).json({ error: 'Invalid data' })
        return
    }
    try {
        const event = await client.event.create({
            data: {
                name: data.name,
                description: data.description,
                startTime: data.startTime,
                locationId: data.locationId,
                banner: data.banner,
                adminId: adminId,
            }
        })
        res.json({
            id: event.id
        })
    } catch (err) {
        res.status(500).json({
           message : "could not create event",
        })
    }

})

export default router;