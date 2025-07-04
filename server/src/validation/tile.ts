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

export const TileGetAllQuery = object({});

export const TileCreateData = object({
    letter: string(),
    value: IntLike,
});

export const TileUpdateData = object({
    letter: optional(string()),
    value: optional(IntLike),
});
