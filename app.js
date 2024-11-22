const express = require('express');
const path = require('path');
const createTables = require('./db/createTables');
const routeApp = require('./routes');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

routeApp(app);

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    try {
        await createTables();
        console.log('Database tables initialized successfully.');
    } catch (err) {
        console.error('Error initializing database tables:', err);
    }
});