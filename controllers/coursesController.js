const pool = require('../db/pool');

// Controller to handle adding a course
async function addCourse(req, res) {
    const { coursename, credits } = req.body;

    if (!coursename || !credits) {
        return res.status(400).send('All fields are required.');
    }

    try {
        const connection = await pool.getConnection();
        const query = `
            INSERT INTO COURSES (coursename, credits) 
            VALUES (?, ?);
        `;
        const [result] = await connection.execute(query, [coursename, credits]);
        connection.release();

        console.log('Course added successfully:', result.insertId);
        res.redirect('/courses'); // Redirect to the courses list page
    } catch (err) {
        console.error('Error adding course:', err);
        res.status(500).send('Error adding course. Please try again.');
    }
}

// Controller to fetch and display all courses
async function getCourses(req, res) {
    try {
        const connection = await pool.getConnection();
        const query = 'SELECT * FROM COURSES;';
        const [rows] = await connection.query(query);
        connection.release();

        res.render('courses-list', { title: 'Courses List', courses: rows });
    } catch (err) {
        console.error('Error fetching courses:', err);
        res.status(500).send('Error fetching courses. Please try again.');
    }
}

module.exports = {
    addCourse,
    getCourses,
};
