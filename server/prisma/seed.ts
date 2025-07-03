import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const speciesNames = ['Squirrel', 'Wolf', 'Bear', 'Mole', 'Woodpecker'];

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

// Utility function to shuffle array (Fisher-Yates algorithm)
function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length -1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

async function main() {
    // Create Badger (only once)
    const player = await prisma.player.upsert({
        where: { name: 'Badger' },
        update: {},
        create: { name: 'Badger' },
    });
    console.log(`Player created or found: ${player.name} (id=${player.id})`);

    // Create species (only once)
    const speciesCreated: any[] = [];
    for (const name of speciesNames) {
        let species = await prisma.species.findUnique({ where: { name } });
        if (!species) {
            species = await prisma.species.create({ data: { name } });
            console.log(`Created species: ${name}`);
        }
        speciesCreated.push(species);
    }

    // Create 50 animals of random species and names
    await prisma.animal.deleteMany();
    console.log('All previous animals deleted.');

    const shuffledAnimalNames = shuffleArray(animalNames).slice(0, 50);

    const animalsData = shuffledAnimalNames.map((name) => {
        const species = speciesCreated[Math.floor(Math.random() * speciesCreated.length)];
        return {
            name,
            speciesId: species.id,
        };
    });

    await prisma.animal.createMany({ data: animalsData });
    console.log(`Created ${animalsData.length} animals.`);

    // Create tiles (only once)s
    const tileCount = await prisma.tile.count();
    if (tileCount === 0) {
        const tilesData = tilesDistribution.flatMap(({ letter, value, count }) =>
            Array.from({ length: count }, () => ({
                letter,
                value,
            }))
        );
        await prisma.tile.createMany({ data: tilesData });
        console.log(`Created ${tilesData.length} tiles.`);
    } else {
        console.log('Tiles already exist, skipping creation.');
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
        console.log('Seeding done.');
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
