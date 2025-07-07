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
                tilesOnWord: {
                    include: { tile: true },
                    orderBy: { position: 'asc' }
                },
            },
        });
        res.json(words);
    } catch (error) {
        console.error('Error fetching words:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function add_one(req: Request, res: Response): Promise<void> {
    try {
        assert(req.body, WordCreateData);
        const { isValid, tileIds } = req.body;
        const ids = tileIds.map(id => Number(id));

        const foundCount = await prisma.tile.count({
            where: { id: { in: ids } },
        });
        if (foundCount !== ids.length) {
            res.status(404).json({ message: 'One or more tile IDs not found' });
            return;
        }

        const createdWord = await prisma.word.create({
            data: {
                isValid,
                tilesOnWord: {
                    create: ids.map((tileId, index) => ({
                        tile: { connect: { id: tileId } },
                        position: index,
                    })),
                },
            },
            include: {
                tilesOnWord: {
                    include: { tile: true },
                    orderBy: { position: 'asc' },
                },
            },
        });

        await prisma.tile.updateMany({
            where: { id: { in: ids } },
            data: { wordId: createdWord.id },
        });

        const assembled = createdWord.tilesOnWord
            .map(tow => tow.tile.letter)
            .join('')
            .toUpperCase();

        res.status(201).json({ id: createdWord.id, word: assembled, isValid: createdWord.isValid });
    } catch (err) {
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
                tilesOnWord: {
                    include: { tile: true },
                    orderBy: { position: 'asc' },
                },
            },
        });

        if (!word) {
            res.status(404).json({ message: 'Word not found.' });
            return;
        }

        const assembled = word.tilesOnWord.map(tow => tow.tile.letter).join('').toUpperCase();
        const valid = DICTIONARY.has(assembled);

        res.json({ wordId: word.id, word: assembled, valid });
    } catch (error) {
        console.error('Error checking word:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
