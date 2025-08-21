import { prisma } from '../db';
import type { Request, Response } from 'express';
import { assert } from 'superstruct';

import { PlayerUpdateData, PlayerGetAllQuery } from '../validation/player';
import { TileArray } from '../validation/tile';

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
        const animalIdsToAdd: number[] | undefined = req.body.animalIdsToAdd;

        const dataToUpdate: any = {
            ...(score !== undefined && { score }),
            ...(animalIdsToAdd !== undefined && {
                animals: {
                    connect: animalIdsToAdd.map(id => ({ id })),
                },
            }),
        };

        const updatedPlayer = await prisma.player.update({
            where: { name: 'Badger' },
            data: dataToUpdate,
            include: { animals: true },
        });

        res.json(updatedPlayer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function get_hand(req: Request, res: Response) {
    try {
        const playerWithHand = await prisma.player.findUnique({
            where: { name: 'Badger' },
            select: {
                hand: true,
            },
        });

        if (!playerWithHand) {
            res.status(404).json({ message: 'Player not found' });
            return;
        }

        res.json(playerWithHand.hand);
    } catch (error) {
        console.error('Error fetching hand:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function init_hand(req: Request, res: Response) {
    try {
        assert(req.body, TileArray);

        const tileIds: number[] = req.body;

        await prisma.tile.updateMany({
            where: { playerId: 1 },
            data: { playerId: null },
        });

        await prisma.tile.updateMany({
            where: { id: { in: tileIds } },
            data: { playerId: 1 },
        });

        const newHand = await prisma.tile.findMany({
            where: { playerId: 1 },
        });

        res.json(newHand);
    } catch (error) {
        console.error('Error initializing hand:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function get_animals(req: Request, res: Response) {
    try {
        const player = await prisma.player.findUnique({
            where: { name: 'Badger' },
            include: {
                animals: true,
            },
        });

        if (!player) {
            res.status(404).json({ message: 'Player not found' });
            return;
        }

        res.json(player.animals);
    } catch (error) {
        console.error('Error fetching animals:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function add_tiles(req: Request, res: Response) {
    const { tileId } = req.body;

    if (typeof tileId !== 'number') {
        res.status(400).json({ message: 'tileId must be a number' });
        return;
    }

    try {
        const tile = await prisma.tile.findUnique({ where: { id: tileId } });
        if (!tile) {
            res.status(404).json({ message: 'Tile not found' });
            return;
        }

        const updatedTile = await prisma.tile.update({
            where: { id: tileId },
            data: { player: { connect: { name: 'Badger' } } },
        });

        res.json(updatedTile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function remove_tile(req: Request, res: Response) {
    const tileId = Number(req.params.tileId);

    if (isNaN(tileId)) {
        res.status(400).json({ message: 'Invalid tileId' });
        return;
    }

    try {
        const tile = await prisma.tile.findUnique({ where: { id: tileId } });

        if (!tile) {
            res.status(404).json({ message: 'Tile not found' });
            return;
        }

        if (tile.playerId === null) {
            res.status(400).json({ message: 'Tile is not assigned to any player' });
            return;
        }

        const updatedTile = await prisma.tile.update({
            where: { id: tileId },
            data: { player: { disconnect: true } },
        });

        res.json(updatedTile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
