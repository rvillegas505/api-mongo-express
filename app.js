const express = require('express');
const initDB = require('./config/db');
const app = express();

//config express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json('holaa');
})

app.use(require('./routes'));


app.listen(3000, () => {
    console.log('server corriendo');
});

initDB();

module.exports = app;