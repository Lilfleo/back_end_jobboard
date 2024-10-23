const database = require('../services/db')

exports.getComp=async (req, res) => {
    try{
        const result = await database.pool.query('SELECT * FROM company')
        return res.status(200).json([{ads:result.rows}]) //retourne dans un objet ads
    }catch(error){
        return res.status(500).json({error : error.message})
    }
}
exports.createComp= async(req,res) => {
    const {name } = req.body
    try{
        if(!name ){
            return res.status(422).json({error:'All fields are required'})//invalid data vers le serveur 
        }

        const result = await database.pool.query({
            text:'INSERT INTO company (name) VALUES ($1) RETURNING *', 
            values:[req.body.name]            
        });
        return res.status(201).json({ad:[result.rows[0]]}) //retourne dans un objet ad

    }catch(error){
        return res.status(500).json({error : error.message})
    }
}
exports.getCompById = async (req, res) => {
    try {
        const adId = req.params.id; // Récupère l'ID depuis les paramètres de la requête
        const result = await database.pool.query('SELECT * FROM company WHERE id = $1', [adId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Company not found' });
        }

        return res.status(200).json({ ad: result.rows[0] }); // Retourne l'annonce trouvée
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
exports.delComp = async (req, res) => {
    try {
        const delId = req.params.id; 

        if (!delId) {
            return res.status(422).json({ error: 'ID is required' });
        }

        const result = await database.pool.query({
            text: 'DELETE FROM company WHERE id = $1 RETURNING *',
            values: [delId]
        });

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Company not found' });
        }

        return res.status(200).json({ message: 'Company deleted successfully', ad: result.rows[0] });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.updateComp = async (req, res) => {
    try {
        const adId = req.params.id;
        const {name,} = req.body; 

        console.log('ID reçu :', adId); // Vérifie si l'ID est bien reçu

        if (!adId) {
            return res.status(422).json({ error: 'ID is required' });
        }

        if (!name ) {
            return res.status(422).json({ error: 'All fields requiere' });
        }

        const result = await database.pool.query({
            text: 'UPDATE company SET name = $1,place = $2 RETURNING *',
            values: [name],
        });

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Company not found' });
        }

        return res.status(200).json({ message: 'Company updated successfully', ad: result.rows[0] });
    } catch (error) {
        console.error('Erreur serveur :', error); // Log l'erreur du serveur
        return res.status(500).json({ error: error.message });
    }
};