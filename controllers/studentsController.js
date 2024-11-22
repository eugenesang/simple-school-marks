const pool = require('../db/pool');

// Controller to add a new student
async function addStudent(req, res) {
    const { firstname, lastname, dob } = req.body;

    if (!firstname || !lastname || !dob) {
        return res.status(400).send('All fields are required.');
    }

    try {
        const connection = await pool.getConnection();
        const query = `
            INSERT INTO STUDENTS (firstname, lastname, dob) 
            VALUES (?, ?, ?);
        `;
        const [result] = await connection.execute(query, [firstname, lastname, dob]);
        connection.release();

        console.log('Student added successfully:', result.insertId);
        res.redirect('/students');
    } catch (err) {
        console.error('Error adding student:', err);
        res.status(500).send('Error adding student. Please try again.');
    }
}

// Controller to fetch and display all students
async function getStudents(req, res) {
    try {
        const connection = await pool.getConnection();
        const query = 'SELECT * FROM STUDENTS;';
        const [rows] = await connection.query(query);
        connection.release();

        res.render('students-list', { title: 'Students List', students: rows });
    } catch (err) {
        console.error('Error fetching students:', err);
        res.status(500).send('Error fetching students. Please try again.');
    }
}

module.exports = {
    addStudent,
    getStudents,
};