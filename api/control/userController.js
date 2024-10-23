const database = require('../services/db')

exports.getAllUser=async (req, res) => {
    try{
        const result = await database.pool.query('SELECT * FROM users')
        return res.status(200).json([{ads:result.rows}]) //retourne dans un objet ads
    }catch(error){
        return res.status(500).json({error : error.message})
    }
}
exports.delUser = async (req, res) => {
    try {
        const delId = req.params.id; 

        if (!delId) {
            return res.status(422).json({ error: 'ID is required' });
        }

        const result = await database.pool.query({
            text: 'DELETE FROM users WHERE id = $1 RETURNING *',
            values: [delId]
        });

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ message: 'User deleted successfully', ad: result.rows[0] });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params; // Récupérer l'ID de l'utilisateur à mettre à jour
    const { firstName, lastName, email } = req.body; // Récupérer les nouvelles valeurs

    try {
        // Récupérer l'email actuel de l'utilisateur
        const { rows: currentUser } = await database.pool.query(
            'SELECT email FROM users WHERE id = $1',
            [id]
        );

        if (currentUser.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const currentEmail = currentUser[0].email;

        // Vérifier si l'email a changé
        if (email && email !== currentEmail) {
            // Vérifier si le nouvel email existe déjà
            const { rows: emailCheck } = await database.pool.query(
                'SELECT * FROM users WHERE email = $1',
                [email]
            );

            if (emailCheck.length > 0) {
                return res.status(400).json({ error: 'Email already in use' });
            }
        }

        // Effectuer la mise à jour
        const updatedFields = [];
        const values = [];

        if (firstName) {
            updatedFields.push('first_name = $' + (values.length + 1));
            values.push(firstName);
        }
        if (lastName) {
            updatedFields.push('last_name = $' + (values.length + 1));
            values.push(lastName);
        }
        if (email) {
            updatedFields.push('email = $' + (values.length + 1));
            values.push(email);
        }

        // Si aucun champ à mettre à jour, retourner une erreur
        if (updatedFields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        // Ajout de l'ID à la fin des valeurs
        values.push(id);

        const updateQuery = `UPDATE users SET ${updatedFields.join(', ')} WHERE id = $${values.length} RETURNING *`;

        const { rows: updatedUser } = await database.pool.query(updateQuery, values);
        
        return res.status(200).json({ user: updatedUser[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

