import {
    object,
    optional,
    refine,
    union,
    string,
    number,
    array,
    size,
} from 'superstruct';
import { isInt } from 'validator';

const IntLike = refine(union([string(), number()]), 'int', (value) => isInt(String(value)));

export const TileGetAllQuery = object({});
export const TileArray = size(array(number()), 7, 7);

export const TileCreateData = object({
    letter: string(),
    value: IntLike,
});

export const TileUpdateData = object({
    letter: optional(string()),
    value: optional(IntLike),
});
