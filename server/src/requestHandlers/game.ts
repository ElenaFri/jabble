import { prisma } from '../db';
import type { Request, Response } from 'express';
import { assert } from 'superstruct';

import { GameAddData, GameIdParams } from '../validation/game';

export async function get_all(req: Request, res: Response) {
    try {
        const games = await prisma.game.findMany({
            include: {
                board: true,
                player: true,
                animals: {
                    include: {
                        animal: {
                            include: {
                                species: true
                            }
                        }
                    }
                },
                words: true,
                winnerPlayer: true,
                winnerAnimal: true
            },
            orderBy: {
                startedAt: 'desc'
            }
        });
        res.json(games);
    } catch (error) {
        console.error('Error retrieving games:', error);
        res.status(500).json({ error: 'Failed to retrieve games.' });
    }
}

export async function remove_all(req: Request, res: Response) {
    try {
        await prisma.game.deleteMany();
        res.json({ message: 'All games deleted.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete games.' });
    }
}

export async function get_one(req: Request, res: Response) {
    try {
        assert(req.params, GameIdParams);
        const id = parseInt(req.params.gameId);

        const game = await prisma.game.findUnique({
            where: { id },
            include: {
                board: true,
                player: true,
                animals: {
                    include: { animal: true }
                },
                words: true,
                winnerPlayer: true,
                winnerAnimal: true
            }
        });

        if (!game) return res.status(404).json({ error: 'Game not found.' });

        res.json(game);
    } catch (error) {
        res.status(400).json({ error: 'Invalid game ID.' });
    }
}

export async function add_one(req: Request, res: Response) {
    try {
        assert(req.body, GameAddData);

        const boardId = parseInt(req.body.boardId);
        const playerId = parseInt(req.body.playerId);

        const game = await prisma.game.create({
            data: {
                board: { connect: { id: boardId } },
                player: { connect: { id: playerId } },
            },
        });

        res.status(201).json(game);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Invalid input for game creation.' });
    }
}

export async function remove_one(req: Request, res: Response) {
    try {
        assert(req.params, GameIdParams);
        const id = parseInt(req.params.gameId);

        const game = await prisma.game.delete({
            where: { id }
        });

        res.json({ message: `Game ${id} deleted.`, game });
    } catch (error) {
        res.status(400).json({ error: 'Invalid game ID or game not found.' });
    }
}
