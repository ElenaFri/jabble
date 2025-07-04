import { Router, Request, Response } from 'express';
import { prisma } from '../db';

const router = Router();

// Fetch complete list of words played
router.get('/', async (req: Request, res: Response) => {
    try {
        const words = await prisma.word.findMany();
        res.json(words);
    } catch (error) {
        console.error('Error fetching words:', error);
        res.status(500).json({ error: 'Failed to fetch words' });
    }
});

export default router;