const database = require('../services/db')

exports.getApplication=async (req, res) => {
    try{
        const result = await database.pool.query('SELECT id, id_ad, email FROM job_application')
        return res.status(200).json([{ads:result.rows}]) //retourne dans un objet ads
    }catch(error){
        return res.status(500).json({error : error.message})
    }
}

exports.createApplication = async (req, res) => {
    try {
        const { email } = req.body; // Récupère seulement l'email

        // Vérifie si l'email est fourni
        if (!email) {
            return res.status(422).json({ error: 'Email is required' });
        }

        // ID de l'annonce est passé en tant que paramètre dans l'URL
        const adId = req.params.id; 

        // Vérifie si l'id_ad existe dans la table advertisement
        const adCheck = await database.pool.query('SELECT * FROM advertisement WHERE id = $1', [adId]);
        if (adCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Advertisement not found' });
        }

        // Insère la candidature
        const result = await database.pool.query({
            text: 'INSERT INTO job_application (email, id_ad) VALUES ($1, $2) RETURNING *',
            values: [email, adId] // Utilise l'adId récupéré
        });

        return res.status(201).json({ application: [result.rows[0]] });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.delApplication = async (req, res) => {
    try {
        const delId = req.params.id; 

        if (!delId) {
            return res.status(422).json({ error: 'ID is required' });
        }

        const result = await database.pool.query({
            text: 'DELETE FROM job_application WHERE id = $1 RETURNING *',
            values: [delId]
        });

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ message: 'Application deleted successfully', ad: result.rows[0] });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};