const database = require('../services/db')

exports.getAdvertisements = async (req, res) => {
    const { type } = req.query;
    console.log(type) // Récupérer le type d'annonce (short ou long)
    const { page = 1, limit = 10 } = req.query; // Page par défaut à 1 et limite par défaut à 10

    const offset = (page - 1) * limit; // Calculer l'offset

    let query;
    if (type === 'short') {
        query = `
            SELECT 
                ad.id, 
                ad.name, 
                ad.short_desc AS description, 
                ad.salary, 
                ad.place, 
                comp.name AS company_name
            FROM 
                advertisement ad
            JOIN 
                company comp ON ad.id_comp = comp.id
            LIMIT $1 OFFSET $2`;
    } else if (type === 'long') {
        query = `
            SELECT 
                ad.id, 
                ad.name, 
                ad.long_desc AS description, 
                ad.salary, 
                ad.place, 
                comp.name AS company_name
            FROM 
                advertisement ad
            JOIN 
                company comp ON ad.id_comp = comp.id
            JOIN 
                users usr ON ad.id_user = usr.id
            LIMIT $1 OFFSET $2`;
    } else {
        return res.status(400).json({ error: 'Invalid advertisement type. Use "short" or "long".' });
    }

    try {
        const result = await database.pool.query(query, [limit, offset]);
        return res.status(200).json({ ads: result.rows, page: parseInt(page), limit: parseInt(limit) });
    } catch (error) {
        console.error('Error fetching advertisements:', error);
        return res.status(500).json({ error: error.message });
    }
};



exports.createAdvertisement = async (req, res) => {
    try {
        const { name, shortDesc, longDesc, salary, place, company } = req.body; // Ajoutez longDesc ici

        if (!name || !shortDesc || !longDesc|| !salary || !place) {
            return res.status(422).json({ error: 'All fields are required' }); // Vérifiez les champs requis
        }

        const result = await database.pool.query({
            text: 'INSERT INTO advertisement (name, short_desc, long_desc, salary, place) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            values: [name, shortDesc, longDesc, salary, place], // Ajoutez longDesc ici
        });

        return res.status(201).json({ ad: [result.rows[0]] }); // Retournez l'annonce créée
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


exports.getAdvertisementById = async (req, res) => {
    try {
        const adId = req.params.id; // Récupère l'ID depuis les paramètres de la requête
        const { type } = req.query; // Récupérer le type d'annonce (short ou long)

        let query;
        if (type === 'short') {
            query = `
                SELECT 
                    ad.id, 
                    ad.name, 
                    ad.short_desc AS shortDescription, 
                    ad.salary, 
                    ad.place, 
                    comp.name AS company_name
                FROM 
                    advertisement ad
                LEFT JOIN 
                    company comp ON ad.id_comp = comp.id
                WHERE 
                    ad.id = $1`;
        } else if (type === 'long') {
            query = `
                SELECT 
                    ad.id, 
                    ad.name, 
                    ad.long_desc AS longDescription, 
                    ad.salary, 
                    ad.place, 
                    comp.name AS company_name
                FROM 
                    advertisement ad
                LEFT JOIN 
                    company comp ON ad.id_comp = comp.id
                WHERE 
                    ad.id = $1`;

                    
        } else {
            return res.status(400).json({ error: 'Invalid advertisement type. Use "short" or "long".' });
        }

        const result = await database.pool.query(query, [adId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Advertisement not found' });
        }

        return res.status(200).json({ ad: result.rows[0] }); // Retourne l'annonce trouvée
    } catch (error) {
        console.error('Error fetching advertisement:', error);
        return res.status(500).json({ error: error.message });
    }
};



exports.delAdvertisement = async (req, res) => {
    try {
        const adId = req.params.id;

        if (!adId) {
            return res.status(422).json({ error: 'ID is required' });
        }

        const result = await database.pool.query({
            text: 'DELETE FROM advertisements WHERE id = $1 RETURNING *',
            values: [adId]
        });

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Advertisement not found' });
        }

        return res.status(200).json({ message: 'Advertisement deleted successfully', ad: result.rows[0] });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.updateShortAd = async (req, res) => {
    try {
        const adId = req.params.id;
        const {name, shortDesc, salary, place } = req.body; 

        console.log('ID reçu :', adId); // Vérifie si l'ID est bien reçu

        if (!adId) {
            return res.status(422).json({ error: 'ID is required' });
        }

        if (!name || !shortDesc || !salary ||!place) {
            return res.status(422).json({ error: 'All fields are required' });
        }

        const result = await database.pool.query({
            text: 'UPDATE advertisement SET name = $1, short_desc = $2, salary = $3, place = $4 RETURNING *',
            values: [name, shortDesc, salary, place],
        });

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Advertisement not found' });
        }

        return res.status(200).json({ message: 'Advertisement updated successfully', ad: result.rows[0] });
    } catch (error) {
        console.error('Erreur serveur :', error); // Log l'erreur du serveur
        return res.status(500).json({ error: error.message });
    }
};


