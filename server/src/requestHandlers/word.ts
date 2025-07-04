import { prisma } from '../db';
import type { Request, Response } from 'express';
import { assert } from 'superstruct';

import { WordCreateData, WordGetAllQuery } from '../validation/word';

export async function get_all(req: Request, res: Response) {
    assert(req.query, WordGetAllQuery);

    try {
        const words = await prisma.word.findMany({
            include: {
                word: true, // inclure les tiles associés à chaque word
            },
        });
        res.json(words);
    } catch (error) {
        console.error('Error fetching words:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
