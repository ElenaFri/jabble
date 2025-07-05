import { PrismaClient } from '@prisma/client';
import express, { Request, Response, NextFunction } from 'express';

import { assert, object, optional, refine, string, StructError } from 'superstruct';
import { isInt } from 'validator';

import { HttpError } from './error';

import * as player from './requestHandlers/player';
import * as animal from './requestHandlers/animal';
import * as tile from './requestHandlers/tile';
import * as word from './requestHandlers/word';

const app = express();
const port = 3000;

const ReqParams = object({
    player_id: optional(refine(string(), 'int', (value) => isInt(value))),
    animal_id: optional(refine(string(), 'int', (value) => isInt(value))),
    tile_id: optional(refine(string(), 'int', (value) => isInt(value))),
    word_id: optional(refine(string(), 'int', (value) => isInt(value))),
});
const validateParams = (req: Request, res: Response, next: NextFunction) => {
    assert(req.params, ReqParams);
    next();
}

// Middleware to parse JSON bodies
app.use(express.json());

// Listing routes
app.route('/badger')
    .get(player.get)
    .patch(player.update);

app.route('/badger/hand')
    .get(player.get_hand)
    .put(player.init_hand)
    .post(player.add_tiles);

app.route('/badger/hand/:tileId')
    .delete(player.remove_tile);

app.route('/badger/animals')
    .get(player.get_animals);

app.route('/animals')
    .get(animal.get_all);

app.route('/tiles')
    .get(tile.get_all);

app.route('/words')
    .get(word.get_all)
    .post(word.add_one);

app.route('/words/:wordId')
    .post(word.check);

// Basic root route
app.get('/', (req: Request, res: Response) => {
    res.send('Hi! Jabble server is under construction.');
});

// Start server
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
