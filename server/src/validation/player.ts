import {
    object,
    optional,
    refine,
    union,
    string,
    number,
    array,
} from 'superstruct';
import { isInt } from 'validator';

const IntLike = refine(
    union([string(), number()]),
    'int',
    (value) => isInt(String(value))
);

export const PlayerUpdateData = object({
    score: optional(IntLike),
    animalIdsToAdd: optional(array(number())),
});

export const PlayerGetAllQuery = object({
    name: optional(string()),
});
