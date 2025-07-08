import {
    object,
    boolean,
    array,
    union,
    string,
    number,
    optional,
    refine,
} from 'superstruct';
import { isInt } from 'validator';

const IntLike = refine(union([string(), number()]), 'int', (value) => isInt(String(value)));

export const BoardGetAllQuery = object({});

export const BoardCreateData = object({
    isValid: optional(boolean()),
    tileIds: array(IntLike),
    startX: IntLike,
    startY: IntLike,
    orientation: union([string(), number()]),
    boardId: IntLike,
});

export const BoardIdParams = object({
    boardId: IntLike,
});
