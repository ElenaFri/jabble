import {
    object,
    boolean,
    array,
    refine,
    union,
    string,
    number
} from 'superstruct';
import { isInt } from 'validator';

const IntLike = refine(union([string(), number()]), 'int', (value) => isInt(String(value)));

export const WordGetAllQuery = object({});

export const WordCreateData = object({
    isValid: boolean(),
    tileIds: array(IntLike),
});
