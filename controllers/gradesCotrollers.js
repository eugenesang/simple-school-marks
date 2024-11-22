const pool = require('../db/pool');

async function addGradePage(req, res) {
    try {
        const connection = await pool.getConnection();
        const studentid = req.params.id;

        const [courses] = await connection.query('SELECT * FROM COURSES');

        if (courses.length === 0) {
            connection.release();
            return res.status(400).send('Invalid course ID.');
        };

        const [[student]] = await connection.query('SELECT * FROM STUDENTS WHERE studentid = ?', studentid);
        
        if(!student){
            res.status(404).send("Student not found")
        }

        const terms = ['Spring', 'Summer', 'Fall', 'Winter'].map(d=>`${d} ${new Date().getFullYear()}`);

        console.log(student);
        
        res.render('add-grade', { title: 'Add Grade', studentid, student, courses, terms });
    } catch (error) {
        console.error('Error adding grade:', error);
        res.status(500).send('Error collecting courses');
    }
}

// Controller to add a grade for a student
async function addGrade(req, res) {
    const { courseid, term, grade } = req.body;
    const { id: studentid } = req.params;

    if (!courseid || !term || !grade) {
        return res.status(400).send('All fields are required.');
    }

    try {
        const connection = await pool.getConnection();

        // Check if the course exists
        const [courses] = await connection.query('SELECT * FROM COURSES WHERE courseid = ?', [courseid]);
        if (courses.length === 0) {
            connection.release();
            return res.status(400).send('Invalid course ID.');
        }

        // Insert the grade
        const query = `
            INSERT INTO GRADES (courseid, studentid, term, grade)
            VALUES (?, ?, ?, ?);
        `;
        await connection.execute(query, [courseid, studentid, term, grade]);
        connection.release();

        console.log('Grade added successfully for student:', studentid);
        res.redirect(`/students/${studentid}/grade`);
    } catch (err) {
        console.error('Error adding grade:', err);
        res.status(500).send('An Error Occurred! Do not re-enter grades.');
    }
}

// Controller to get grades by student ID
async function getGradesByStudent(req, res) {
    const { id: studentid } = req.params;

    try {
        const connection = await pool.getConnection();

        // Fetch student info
        const [studentRows] = await connection.query('SELECT * FROM STUDENTS WHERE studentid = ?', [studentid]);
        if (studentRows.length === 0) {
            connection.release();
            return res.status(404).send('Student not found.');
        }
        const student = studentRows[0];

        // Fetch grades for the student
        const query = `
            SELECT G.courseid, C.coursename, G.term, G.grade
            FROM GRADES G
            JOIN COURSES C ON G.courseid = C.courseid
            WHERE G.studentid = ?;
        `;
        const [grades] = await connection.query(query, [studentid]);
        connection.release();

        res.render('student-grades', { title: 'Student Grades', student, grades });
    } catch (err) {
        console.error('Error fetching grades:', err);
        res.status(500).send('Error fetching grades. Please try again.');
    }
}

module.exports = {
    addGrade,
    addGradePage,
    getGradesByStudent,
};