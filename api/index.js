const express = require('express');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Utilisation des routes
app.use('/advertisement', require('./route/advetisement'));
app.use('/users', require('./route/user'));
app.use('/company', require('./route/company'));
app.use('/jobApplication', require('./route/jobApplication'));
app.use('/auth', require('./route/auth'));
app.use('/search', require('./route/search')); //GET http://localhost:3000/search?query=votreTermeDeRecherche


app.listen(3001, () => console.log('Server on port 3001'));
