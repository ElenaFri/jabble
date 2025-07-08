import { prisma } from '../db';
import type { Request, Response } from 'express';
import { assert } from 'superstruct';

import { BoardGetAllQuery } from '../validation/board';

export const get = async (req: Request, res: Response) => {
    assert(req.query, BoardGetAllQuery);
    try {
        const words = await prisma.word.findMany({
            include: {
                tilesOnWord: {
                    include: {
                        tile: true,
                    },
                    orderBy: {
                        position: 'asc',
                    },
                },
                board: true,
            },
        });

        const formattedWords = words.map(word => {
            const letters = word.tilesOnWord.map(t => t.tile.letter).join('');
            return {
                id: word.id,
                startX: word.startX,
                startY: word.startY,
                orientation: word.orientation,
                letters,
            };
        });

        res.status(200).json({ words: formattedWords });
    } catch (error) {
        console.error('Error retrieving board:', error);
        res.status(500).json({ error: 'Failed to retrieve board state' });
    }
};

