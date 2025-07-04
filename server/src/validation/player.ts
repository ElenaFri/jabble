import {
    object,
    optional,
    refine,
    union,
    string,
    number
} from 'superstruct';
import { isInt } from 'validator';

const IntLike = refine(
    union([string(), number()]),
    'int',
    (value) => isInt(String(value))
);

export const PlayerUpdateData = object({
    score: optional(IntLike),
    animalsMet: optional(IntLike),
});

export const PlayerGetAllQuery = object({
    name: optional(string()),
});
