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

export const AnimalGetAllQuery = object({});

export const AnimalUpdateData = object({
    name: optional(string()),
    speciesId: optional(IntLike),
});
