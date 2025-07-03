import express, { Request, Response } from 'express';

import playerRouter from './routes/player';
import animalRouter from './routes/animal';
import tileRouter from './routes/tile';
import wordRouter from './routes/word';

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Listing routes
app.use('/badger', playerRouter);
app.use('/animals', animalRouter);
app.use('/tiles', tileRouter);
app.use('/words', wordRouter);

// Basic root route
app.get('/', (req: Request, res: Response) => {
    res.send('Hi! Jabble server is under construction.');
});

// Start server
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
