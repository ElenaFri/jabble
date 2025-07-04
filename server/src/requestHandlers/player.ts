import { prisma } from '../db';
import type { Request, Response } from 'express';
import { assert } from 'superstruct';

import { PlayerUpdateData, PlayerGetAllQuery } from '../validation/player';

export async function get(req: Request, res: Response) {
    assert(req.query, PlayerGetAllQuery);

    try {
        const player = await prisma.player.findUnique({
            where: { name: 'Badger' },
            include: { hand: true, animals: true },
        });

        if (!player) {
            res.status(404).json({ message: 'Player not found' });
            return;
        }

        res.json(player);
    } catch (error) {
        console.error('Error fetching player:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function update(req: Request, res: Response) {
    try {
        assert(req.body, PlayerUpdateData);

        const score = req.body.score !== undefined ? Number(req.body.score) : undefined;
        const animalsMet = req.body.animalsMet !== undefined ? Number(req.body.animalsMet) : undefined;

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
}
