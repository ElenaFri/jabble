import { prisma } from '../db';
import type { Request, Response } from 'express';
import {assert, StructError} from 'superstruct';

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
        const { isValid, tileIds } = req.body;

        const count = await prisma.tile.count({
            where: { id: { in: tileIds.map(id => Number(id)) } }
        });
        if (count !== tileIds.length) {
            res.status(404).json({ message: 'One or more tile IDs not found' });
            return;
        }

        const word = await prisma.word.create({
            data: {
                isValid,
                word: {
                    connect: tileIds.map(id => ({ id: Number(id) }))
                }
            },
            include: { word: true }
        });

        res.status(201).json(word);
    } catch (err: any) {
        if (err instanceof StructError) {
            res.status(400).json({ message: 'Invalid payload' });
            return;
        }
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