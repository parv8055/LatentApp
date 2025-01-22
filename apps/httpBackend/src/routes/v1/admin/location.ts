import { Router } from 'express';
import { client } from '@repo/db/client';
import { CreateLocationSchema } from "@repo/common/types";
import { adminMiddleware } from '../../../middleware/admin';


const router: Router = Router();

router.post('/', adminMiddleware, async (req, res) => {
    const { data, success } = CreateLocationSchema.safeParse(req.body)
            // @ts-ignore
    const adminId = req.userId
    if (!success) {
        res.status(400).json({ error: 'Invalid data' })
        return
    }
    try {
        const location = await client.location.create({
            data: {
                name: data.name,
                description: data.description,
                imageUrl: data.banner,
            }
        })
        res.json({
            id: location.id
        })
    } catch (err) {
        res.status(500).json({
            message: "could not create location",
        })
    }

})
router.post('/locations', adminMiddleware, async (req, res) => {
    const locations = await client.location.findMany({
        include: {
            event: true
        }
    })

    res.json({
        locations
    })
})

export default router;