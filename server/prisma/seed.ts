import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const speciesNames = [
    'Fox', 'Squirrel', 'Wolf', 'Bear', 'Mole', 'Woodpecker', 'Butterfly', 'Trout'
];

const animalNames = [
    'Alfred', 'Baxter', 'Charlie', 'Daisy', 'Elliot', 'Fiona', 'Gus', 'Hazel', 'Ivy', 'Jack',
    'Kiki', 'Lola', 'Milo', 'Nina', 'Oscar', 'Penny', 'Quinn', 'Rex', 'Sasha', 'Toby',
    'Uma', 'Violet', 'Willow', 'Xander', 'Yara', 'Zane', 'Archie', 'Belle', 'Coco', 'Dexter',
    'Ellie', 'Freya', 'George', 'Holly', 'Izzy', 'Jasper', 'Kona', 'Luna', 'Max', 'Nico',
    'Olive', 'Piper', 'Queenie', 'Riley', 'Sadie', 'Theo', 'Ulysses', 'Vera', 'Wally', 'Zara',
];

const tilesDistribution = [
    { letter: 'A', value: 1, count: 9 },
    { letter: 'B', value: 3, count: 2 },
    { letter: 'C', value: 3, count: 2 },
    { letter: 'D', value: 2, count: 4 },
    { letter: 'E', value: 1, count: 12 },
    { letter: 'F', value: 4, count: 2 },
    { letter: 'G', value: 2, count: 3 },
    { letter: 'H', value: 4, count: 2 },
    { letter: 'I', value: 1, count: 9 },
    { letter: 'J', value: 8, count: 1 },
    { letter: 'K', value: 5, count: 1 },
    { letter: 'L', value: 1, count: 4 },
    { letter: 'M', value: 3, count: 2 },
    { letter: 'N', value: 1, count: 6 },
    { letter: 'O', value: 1, count: 8 },
    { letter: 'P', value: 3, count: 2 },
    { letter: 'Q', value: 10, count: 1 },
    { letter: 'R', value: 1, count: 6 },
    { letter: 'S', value: 1, count: 4 },
    { letter: 'T', value: 1, count: 6 },
    { letter: 'U', value: 1, count: 4 },
    { letter: 'V', value: 4, count: 2 },
    { letter: 'W', value: 4, count: 2 },
    { letter: 'X', value: 8, count: 1 },
    { letter: 'Y', value: 4, count: 2 },
    { letter: 'Z', value: 10, count: 1 },
    { letter: '', value: 0, count: 2 },
];

function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

async function main() {
    // Cleanup
    await prisma.tilesOnWord.deleteMany();
    await prisma.placedTile.deleteMany();
    await prisma.word.deleteMany();
    console.log('✔ Cleared previous game state (placed tiles & words)');

    // Ensure Badger exists
    const player = await prisma.player.upsert({
        where: { name: 'Badger' },
        update: {},
        create: { name: 'Badger' },
    });
    console.log(`✔ Player: ${player.name}`);

    // Init Badger's hand
    await prisma.tile.updateMany({
        where: { playerId: player.id },
        data: { playerId: null },
    });

    // Ensure species exist
    const speciesCreated: { id: any }[] = [];
    for (const name of speciesNames) {
        const species = await prisma.species.upsert({
            where: { name },
            update: {},
            create: { name },
        });
        speciesCreated.push(species);
    }
    console.log(`✔ ${speciesCreated.length} species ensured.`);

    // Recreate animals
    await prisma.animal.deleteMany();
    const shuffledNames = shuffleArray(animalNames).slice(0, 50);
    const animals = shuffledNames.map(name => ({
        name,
        speciesId: speciesCreated[Math.floor(Math.random() * speciesCreated.length)].id,
    }));
    await prisma.animal.createMany({ data: animals });
    console.log(`✔ ${animals.length} animals created.`);

    // Ensure tile set exists
    const tileCount = await prisma.tile.count();
    if (tileCount === 0) {
        const tilesData = tilesDistribution.flatMap(({ letter, value, count }) =>
            Array.from({ length: count }, () => ({ letter, value }))
        );
        await prisma.tile.createMany({ data: tilesData });
        console.log(`✔ ${tilesData.length} tiles created.`);
    } else {
        console.log('✔ Tiles already present.');
    }

    // Get or create board
    let board = await prisma.board.findFirst();
    if (!board) {
        board = await prisma.board.create({ data: {} });
        console.log(`✔ Board created: id=${board.id}`);

        const bonusLayout = [
            { x: 0, y: 0, type: 'TW' }, { x: 0, y: 7, type: 'TW' }, { x: 0, y: 14, type: 'TW' },
            { x: 7, y: 0, type: 'TW' }, { x: 7, y: 14, type: 'TW' },
            { x: 14, y: 0, type: 'TW' }, { x: 14, y: 7, type: 'TW' }, { x: 14, y: 14, type: 'TW' },
            { x: 1, y: 1, type: 'DW' }, { x: 2, y: 2, type: 'DW' }, { x: 3, y: 3, type: 'DW' }, { x: 4, y: 4, type: 'DW' },
            { x: 10, y: 10, type: 'DW' }, { x: 11, y: 11, type: 'DW' }, { x: 12, y: 12, type: 'DW' }, { x: 13, y: 13, type: 'DW' },
            { x: 1, y: 13, type: 'DW' }, { x: 2, y: 12, type: 'DW' }, { x: 3, y: 11, type: 'DW' }, { x: 4, y: 10, type: 'DW' },
            { x: 10, y: 4, type: 'DW' }, { x: 11, y: 3, type: 'DW' }, { x: 12, y: 2, type: 'DW' }, { x: 13, y: 1, type: 'DW' },
            { x: 1, y: 5, type: 'TL' }, { x: 1, y: 9, type: 'TL' }, { x: 5, y: 1, type: 'TL' },
            { x: 5, y: 5, type: 'TL' }, { x: 5, y: 9, type: 'TL' }, { x: 5, y: 13, type: 'TL' },
            { x: 9, y: 1, type: 'TL' }, { x: 9, y: 5, type: 'TL' }, { x: 9, y: 9, type: 'TL' }, { x: 9, y: 13, type: 'TL' },
            { x: 13, y: 5, type: 'TL' }, { x: 13, y: 9, type: 'TL' },
            { x: 0, y: 3, type: 'DL' }, { x: 0, y: 11, type: 'DL' }, { x: 2, y: 6, type: 'DL' }, { x: 2, y: 8, type: 'DL' },
            { x: 3, y: 0, type: 'DL' }, { x: 3, y: 7, type: 'DL' }, { x: 3, y: 14, type: 'DL' },
            { x: 6, y: 2, type: 'DL' }, { x: 6, y: 6, type: 'DL' }, { x: 6, y: 8, type: 'DL' }, { x: 6, y: 12, type: 'DL' },
            { x: 7, y: 3, type: 'DL' }, { x: 7, y: 11, type: 'DL' }, { x: 8, y: 2, type: 'DL' },
            { x: 8, y: 6, type: 'DL' }, { x: 8, y: 8, type: 'DL' }, { x: 8, y: 12, type: 'DL' },
            { x: 11, y: 0, type: 'DL' }, { x: 11, y: 7, type: 'DL' }, { x: 11, y: 14, type: 'DL' },
            { x: 12, y: 6, type: 'DL' }, { x: 12, y: 8, type: 'DL' }, { x: 14, y: 3, type: 'DL' }, { x: 14, y: 11, type: 'DL' },
        ];

        await prisma.boardBonus.createMany({
            data: bonusLayout.map(b => ({ ...b, boardId: board.id })),
        });
        console.log(`✔ ${bonusLayout.length} bonuses placed.`);
    } else {
        console.log(`✔ Board already exists: id=${board.id} — no changes made.`);
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
        console.log('🎉 Seeding complete.');
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
