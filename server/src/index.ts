import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Hi! Jabble server is under construction.');
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
