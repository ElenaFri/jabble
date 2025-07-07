import {
    object,
    boolean,
    array,
    refine,
    union,
    string,
    number,
    optional,
} from 'superstruct';
import { isInt } from 'validator';

const IntLike = refine(union([string(), number()]), 'int', (value) => isInt(String(value)));

export const WordGetAllQuery = object({});

export const WordCreateData = object({
    isValid: optional(boolean()),
    tileIds: array(IntLike),
});

export const WordIdParams = object({
    wordId: IntLike,
});