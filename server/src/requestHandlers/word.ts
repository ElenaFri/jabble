import { prisma } from '../db';
import type { Request, Response } from 'express';
import { assert, StructError } from 'superstruct';

import { WordAddData, WordIdParams, WordPlaceData, WordGetAllQuery } from '../validation/word';
import { DICTIONARY } from '../../prisma/data/dictionary';

export async function get_all(req: Request, res: Response) {
    assert(req.query, WordGetAllQuery);

    try {
        const words = await prisma.word.findMany({
            include: {
                tilesOnWord: {
                    include: { tile: true },
                },
                player: true,
                animal: true,
            },
        });

        const sortedWords = words.map((word) => ({
            ...word,
            tilesOnWord: [...word.tilesOnWord].sort((a, b) => a.position - b.position),
        }));

        res.json(sortedWords);
    } catch (error) {
        console.error('Error fetching words:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function add_one(req: Request, res: Response): Promise<void> {
    try {
        assert(req.body, WordAddData);
        const { tileIds, playerId, animalId } = req.body;
        const ids = tileIds.map((id) => Number(id));

        const foundCount = await prisma.tile.count({
            where: { id: { in: ids } },
        });
        if (foundCount !== ids.length) {
            res.status(404).json({ message: 'One or more tile IDs not found' });
            return;
        }

        const createdWord = await prisma.word.create({
            data: {
                tilesOnWord: {
                    create: ids.map((tileId, index) => ({
                        tileId,
                        position: index,
                    })),
                },
                player: playerId ? { connect: { id: playerId } } : undefined,
                animal: animalId ? { connect: { id: animalId } } : undefined,
            },
            include: {
                tilesOnWord: {
                    include: { tile: true },
                },
            },
        });

        createdWord.tilesOnWord.sort((a, b) => a.position - b.position);

        const assembled = createdWord.tilesOnWord
            .map((tow) => tow.tile.letter)
            .join('')
            .toUpperCase();

        res.status(201).json({ id: createdWord.id, word: assembled, isValid: createdWord.isValid });
    } catch (err) {
        console.error(err);
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

        const assembled = word.tilesOnWord.map((tow) => tow.tile.letter).join('').toUpperCase();
        const isValid = DICTIONARY.has(assembled);

        if (word.isValid !== isValid) {
            await prisma.word.update({
                where: { id },
                data: { isValid },
            });
        }

        res.json({ wordId: word.id, word: assembled, isValid });
    } catch (error) {
        console.error('Error checking word:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function place_one(req: Request, res: Response) {
    try {
        assert(req.body, WordPlaceData);
        const { wordId, startX, startY, orientation, boardId, playerId, animalId } = req.body;

        const word = await prisma.word.findUnique({
            where: { id: wordId },
            include: {
                tilesOnWord: {
                    include: { tile: true },
                    orderBy: { position: 'asc' },
                },
            },
        });

        if (!word) {
            return res.status(404).json({ message: 'Word not found' });
        }

        req.params.wordId = wordId.toString();
        const mockRes = createMemoryResponse();
        await check(req, mockRes);

        const result = mockRes.jsonBody;
        if (!result?.isValid) {
            return res.status(400).json({ message: `Invalid word '${result?.word}'` });
        }

        for (let i = 0; i < word.tilesOnWord.length; i++) {
            const x = orientation === 'HORIZONTAL' ? startX + i : startX;
            const y = orientation === 'VERTICAL' ? startY + i : startY;
            const letter = word.tilesOnWord[i].tile.letter;

            const existing = await prisma.placedTile.findFirst({
                where: { boardId, x, y },
                include: { tile: true },
            });

            if (existing && existing.tile.letter !== letter) {
                return res.status(409).json({
                    message: `Conflict at (${x}, ${y}): expected '${letter}', found '${existing.tile.letter}'`,
                });
            }
        }

        for (let i = 0; i < word.tilesOnWord.length; i++) {
            const x = orientation === 'HORIZONTAL' ? startX + i : startX;
            const y = orientation === 'VERTICAL' ? startY + i : startY;
            const tileId = word.tilesOnWord[i].tile.id;

            const alreadyPlaced = await prisma.placedTile.findFirst({
                where: { boardId, x, y },
            });

            if (!alreadyPlaced) {
                await prisma.placedTile.create({
                    data: {
                        x,
                        y,
                        tile: { connect: { id: tileId } },
                        board: { connect: { id: boardId } },
                    },
                });
            }
        }

        await prisma.word.update({
            where: { id: wordId },
            data: {
                startX,
                startY,
                orientation,
                board: { connect: { id: boardId } },
                player: playerId ? { connect: { id: playerId } } : undefined,
                animal: animalId ? { connect: { id: animalId } } : undefined,
            },
        });

        const updatedWord = await prisma.word.update({
            where: { id: wordId },
            data: {
                score: await calculateScoreForWord({
                    startX: startX!,
                    startY: startY!,
                    orientation: orientation as 'HORIZONTAL' | 'VERTICAL',
                    tilesOnWord: word.tilesOnWord,
                    boardId: boardId!,
                }),
            },
        });

        res.status(201).json({
            wordId,
            word: result.word,
            isValid: result.isValid,
            score: updatedWord.score,
            message: `Word '${result.word}' placed successfully (${updatedWord.score} pts).`,
            playerId,
            animalId,
        });
    } catch (err) {
        console.error('Error placing word:', err);
        if (err instanceof StructError) {
            return res.status(400).json({ message: 'Invalid request data', details: err.message });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
}

function createMemoryResponse(): Response & { jsonBody?: any } {
    const res = {} as Response & { jsonBody?: any };
    res.status = (code: number) => res;
    res.json = (body: any) => {
        res.jsonBody = body;
        return res;
    };
    return res;
}

async function calculateScoreForWord(word: {
    startX: number;
    startY: number;
    orientation: 'HORIZONTAL' | 'VERTICAL';
    tilesOnWord: {
        tile: { id: number; value: number };
    }[];
    boardId: number;
}) {
    const { startX, startY, orientation, tilesOnWord, boardId } = word;

    const bonuses = await prisma.boardBonus.findMany({
        where: { boardId },
    });

    let wordMultiplier = 1;
    let totalPoints = 0;

    for (let i = 0; i < tilesOnWord.length; i++) {
        const x = orientation === 'HORIZONTAL' ? startX + i : startX;
        const y = orientation === 'VERTICAL' ? startY + i : startY;
        const tileValue = tilesOnWord[i].tile.value;

        const bonus = bonuses.find((b) => b.x === x && b.y === y);

        if (bonus) {
            switch (bonus.type) {
                case 'DL':
                    totalPoints += tileValue * 2;
                    break;
                case 'TL':
                    totalPoints += tileValue * 3;
                    break;
                case 'DW':
                    totalPoints += tileValue;
                    wordMultiplier *= 2;
                    break;
                case 'TW':
                    totalPoints += tileValue;
                    wordMultiplier *= 3;
                    break;
            }
        } else {
            totalPoints += tileValue;
        }
    }

    return totalPoints * wordMultiplier;
}
