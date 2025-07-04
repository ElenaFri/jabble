import { Router, Request, Response } from 'express';
import { prisma } from '../db';

const router = Router();

// Fetch complete animal list
router.get('/', async (req: Request, res: Response) => {
    try {
        const animals = await prisma.animal.findMany({
            include: {
                species: true,  // include species info
            },
        });
        res.json(animals);
    } catch (error) {
        console.error('Error fetching animals:', error);
        res.status(500).json({ error: 'Failed to fetch animals' });
    }
});

export default router;
