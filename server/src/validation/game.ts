import {
    object,
    optional,
    refine,
    union,
    string,
    number
} from 'superstruct';
import { isInt } from 'validator';

const IntLike = refine(union([string(), number()]), 'int', (value) => isInt(String(value)));

export const GameIdParams = object({
    gameId: IntLike,
});

export const GameAddData = object({
    boardId: IntLike,
    playerId: IntLike,
});