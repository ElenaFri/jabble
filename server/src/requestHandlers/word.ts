import { prisma } from '../db';
import type { Request, Response } from 'express';
import { assert } from 'superstruct';

import { WordCreateData, WordIdParams, WordGetAllQuery } from '../validation/word';
import { DICTIONARY } from '../../prisma/data/dictionary';

export async function get_all(req: Request, res: Response) {
    assert(req.query, WordGetAllQuery);

    try {
        const words = await prisma.word.findMany({
            include: {
                word: true,
            },
        });
        res.json(words);
    } catch (error) {
        console.error('Error fetching words:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function add_one(req: Request, res: Response) {
    try {
        assert(req.body, WordCreateData);

        const id = Number(req.params.wordId);
        const { isValid, tileIds } = req.body;

        const updated = await prisma.word.update({
            where: { id },
            data: {
                isValid,
                word: {
                    connect: tileIds.map((tileId) => ({ id: Number(tileId) })),
                },
            },
            include: {
                word: true,
            },
        });

        res.json(updated);
    } catch (error) {
        console.error('Error updating word:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function check(req: Request, res: Response) {
    try {
        assert(req.params, WordIdParams);

        const id = Number(req.params.wordId);

        const word = await prisma.word.findUnique({
            where: { id },
            include: {
                word: true,
            },
        });

        if (!word) {
            res.status(404).json({ message: 'Word not found.' });
            return;
        }

        const assembled = word.word.map(tile => tile.letter).join('').toUpperCase();
        const valid = DICTIONARY.has(assembled);

        res.json({ wordId: word.id, word: assembled, valid });
    } catch (error) {
        console.error('Error checking word:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}