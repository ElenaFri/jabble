import { prisma } from '../db';
import type { Request, Response } from 'express';
import { assert } from 'superstruct';

import { TileUpdateData, TileGetAllQuery } from '../validation/tile';

export async function get_all(req: Request, res: Response) {
    assert(req.query, TileGetAllQuery); // valide éventuellement les filtres

    try {
        const tiles = await prisma.tile.findMany();
        res.json(tiles);
    } catch (error) {
        console.error('Error fetching tiles:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
