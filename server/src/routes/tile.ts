import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Fetch complete list of tiles
router.get('/', async (req: Request, res: Response) => {
    try {
        const tiles = await prisma.tile.findMany();
        res.json(tiles);
    } catch (error) {
        console.error('Error fetching tiles:', error);
        res.status(500).json({ error: 'Failed to fetch tiles' });
    }
});

export default router;
