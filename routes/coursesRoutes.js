const express = require('express');
const router = express.Router();
const { addCourse, getCourses } = require('../controllers/coursesController');


router.get('/add', (req, res) => {
    res.render('add-course');
});

router.post('/', addCourse);
router.get('/', getCourses);

module.exports = router;
