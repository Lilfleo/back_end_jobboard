const searchJobs = async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }
    try {
        const { rows } = await database.pool.query(
            `SELECT a.*, c.name AS company_name
             FROM advertisement a
             JOIN company c ON a.id_comp = c.id
             WHERE a.name ILIKE $1 OR a.long_desc ILIKE $1 OR a.short_desc ILIKE $1 OR c.name ILIKE $1`,
            [`%${query}%`]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


module.exports = { searchJobs };