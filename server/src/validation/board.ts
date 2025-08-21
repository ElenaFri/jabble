import {
    object,
    union,
    string,
    number,
    refine,
} from 'superstruct';
import { isInt } from 'validator';

const IntLike = refine(union([string(), number()]), 'int', (value) => isInt(String(value)));

export const BoardGetAllQuery = object({});

export const BoardIdParams = object({
    boardId: IntLike,
});
