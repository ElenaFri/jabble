# Jabble game server part

## Database model notes

Badger, the tiles and all animals species are only created once.

The animals are re-created at every seed with random species attribution. 

## Features

The following routes are supported:
- GET :
  - `/badger` returns Badger's complete info
  - `/badger/hand` returns Badger's hand (tiles up to 7)
  - `/badger/animals` returns the animals Badger met
  - `/tiles` returns all existing tiles
  - `/animals` returns all existing animals
  - `/words` returns all words that have been placed
  - `/words/:wordId` looks up the word in the dictionary
  - `/board` lists all words that have been played
- DELETE :
  - `/badger/hand/:tileId` removes a tile by its ID from Badger's hand
- PATCH :
  - `/badger` updates Badger's info (namely animals they meet, and the score)
- POST :
  - `/badger/hand` adds one or more tiles to the hand
  - `/words` records a new word (which may be valid or not)
  - `/words/play` places a word on the board and computes the score for Badger or the animal, respectively
- PUT :
  - `/badger/hand` inits hand (like in the beginning of the game or if Badger wants to change all tiles)

## Problems

As of now, Badger is the only one who manipulates tiles. A generic computer player should probably be introduced, to facilitate tile status attribution.

Of course, score calculation is necessary, for both Badger and their adversaries.