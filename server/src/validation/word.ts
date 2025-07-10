import {
    object,
    boolean,
    array,
    refine,
    union,
    string,
    number,
    optional,
    enums,
} from 'superstruct';
import { isInt } from 'validator';

const IntLike = refine(union([string(), number()]), 'int', (value) => isInt(String(value)));

export const WordGetAllQuery = object({});

export const WordAddData = object({
    tileIds: array(number()),
    playerId: optional(IntLike),
    animalId: optional(IntLike),
});

export const WordPlaceData = object({
    wordId: IntLike,
    startX: IntLike,
    startY: IntLike,
    orientation: enums(['HORIZONTAL', 'VERTICAL']),
    boardId: IntLike,
    playerId: optional(IntLike),
    animalId: optional(IntLike),
});

export const WordIdParams = object({
    wordId: IntLike,
});
