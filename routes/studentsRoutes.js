const express = require('express');
const { addStudent, getStudents } = require('../controllers/studentsController');
const { getGradesByStudent, addGrade, addGradePage } = require('../controllers/gradesCotrollers');

const router = express.Router();

router.get('/add', (req, res) => {
    res.render('add-student');
});

router.post('/add', addStudent);

router.get('/', getStudents);

router.get('/:id', getGradesByStudent);
router.get('/:id/grade', addGradePage);
router.post('/:id/grade', addGrade);

module.exports = router;