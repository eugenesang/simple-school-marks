const studentRouter = require('./routes/studentsRoutes')
const coursesRouter = require('./routes/coursesRoutes');

function routeApp(app) {

    app.use('/students', studentRouter);
    app.use('/courses', coursesRouter);
    app.get('/', (req, res) => {
        res.render('index');
    })
}

module.exports = routeApp;