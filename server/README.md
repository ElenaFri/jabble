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
  - `/games` lists all existing games
  - `/games/:gameId` returns a specific game
- DELETE :
  - `/badger/hand/:tileId` removes a tile by its ID from Badger's hand
  - `/games` deletes all existing games
  - `/games/:gameId` deletes a specific game
- PATCH :
  - `/badger` updates Badger's info (namely animals they meet, and the score)
- POST :
  - `/badger/hand` adds one or more tiles to the hand
  - `/words` records a new word (which may be valid or not)
  - `/words/play` places a word on the board and computes the score for Badger or the animal, respectively
  - `/games` add a new game on a given board for a given player
- PUT :
  - `/badger/hand` inits hand (like in the beginning of the game or if Badger wants to change all tiles)

## Problems

As of now, **_Badger is the only one who manipulates tiles._** A generic computer player should probably be introduced, to facilitate tile status attribution. Anyway, animals must know how to play.

Of course, score calculation is necessary, for both Badger and their adversaries (**_upd_**: already implemented for Badger).

The end of game has not been implemented yet either, but it should be a simpler task.

## Algorithms

A possible algorithm for automated animal play may be to :
1. Look at the tiles in its possession;
2. Make anagrams (**_problem: it might take heaps of time, so think of the euristics, see the rationale below_**), checking if those are in the dictionary. If yes, place the word in the very same manner Badger already does.

As-for-now ideas for making anagrams:
- start from a letter already on board
  - Choose a specific place ?
- work out from letters it has on hand
  - Limited to 3-, 4-, 5-letter word? Maybe start with three letters for the sake of simplicity.
  - Start with the maximum word length? But there will be even more resources consumed then.
- use AI
  - The obvious question is how?