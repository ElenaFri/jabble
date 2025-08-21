import { prisma } from '../db';
import type { Request, Response } from 'express';
import { assert } from 'superstruct';

import { AnimalUpdateData, AnimalGetAllQuery } from '../validation/animal';

export async function get_all(req: Request, res: Response) {
    assert(req.query, AnimalGetAllQuery);
    try {
        const animals = await prisma.animal.findMany({
            include: {
                species: true,
            },
        });
        res.json(animals);
    } catch (error) {
        console.error('Error fetching animals:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
