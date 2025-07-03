import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Fetch Badger's info
router.get('/', async (req: Request, res: Response) => {
    try {
        const player = await prisma.player.findUnique({
            where: { name: 'Badger' },
            include: { hand: true, animals: true },
        });
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        res.json(player);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update Badger's score
router.patch('/', async (req: Request, res: Response) => {
    const { score, animalsMet } = req.body;

    try {
        const updatedPlayer = await prisma.player.update({
            where: { name: 'Badger' },
            data: {
                ...(score !== undefined && { score }),
                ...(animalsMet !== undefined && { animalsMet }),
            },
        });
        res.json(updatedPlayer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;