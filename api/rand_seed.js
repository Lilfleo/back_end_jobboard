const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

const pool = new Pool({
    user: 'piq',
    host: 'localhost',
    database: 'job_board',
    password: 'pollux',
    port: 5432,
});

// Fonction pour récupérer les rôles disponibles
const getRoles = async () => {
    const result = await pool.query('SELECT id FROM roles');
    return result.rows.map(row => row.id);
};

const seedDatabase = async (numUsers = 100) => {
    const userIds = [];
    const roles = await getRoles(); // Récupérer les rôles disponibles

    for (let i = 0; i < numUsers; i++) {
        const hashedPassword = bcrypt.hashSync('test', 8);
        const userValues = [
            faker.person.firstName(),
            faker.person.lastName(),
            faker.internet.email(),
            hashedPassword,
            roles[Math.floor(Math.random() * roles.length)], // ID de rôle aléatoire parmi les rôles récupérés
        ];

        try {
            const result = await pool.query(
                'INSERT INTO users (first_name, last_name, email, password, id_role) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                userValues
            );

            userIds.push(result.rows[0].id);
        } catch (error) {
            console.error('Error inserting user:', error);
        }
    }

    console.log(`${numUsers} users seeded successfully`);
    return userIds;
};

const seedCompanies = async (numCompanies = 10) => {
    const companyIds = [];

    for (let i = 0; i < numCompanies; i++) {
        const result = await pool.query(
            'INSERT INTO company (name) VALUES ($1) RETURNING id',
            [faker.company.name()]
        );
        companyIds.push(result.rows[0].id);
    }

    console.log(`${numCompanies} companies seeded successfully`);
    return companyIds;
};

const seedAdvertisements = async (userIds, companyIds, numAds = 100) => {
    for (let i = 0; i < numAds; i++) {
        await pool.query(
            'INSERT INTO advertisement (name, short_desc, long_desc, salary, place, id_user, id_comp) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [
                faker.person.jobTitle(),
                faker.lorem.sentence(),
                faker.lorem.paragraph(),
                faker.number.int({ min: 40000, max: 80000 }),
                faker.location.city(),
                userIds[Math.floor(Math.random() * userIds.length)],
                companyIds[Math.floor(Math.random() * companyIds.length)]
            ]
        );
    }
    console.log(`${numAds} advertisements seeded successfully.`);
};

const seedRole = async () => {
    let roles = ["user", "admin"]
    for (i in roles) {
        await pool.query(
            'INSERT INTO roles (role_name) VALUES ($1)',
            [
                roles[i],
            ]
        );
    }
    
    console.log(`Roles seeded successfully.`);
}
const main = async () => {
    try {
        const userIds = await seedDatabase(); // Insérer les utilisateurs
        const companyIds = await seedCompanies(); // Insérer les entreprises
        await seedAdvertisements(userIds, companyIds); // Insérer les annonces
        console.log('Seeding completed successfully.');
        await seedRole()
    } catch (error) {
        console.error('Error in seeding process:', error);
    } finally {
        await pool.end(); // Fermer le pool ici, après toutes les opérations
    }
};

main();
