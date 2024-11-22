const pool = require('./pool');

async function createTables() {
    const createStudentsTable = `
        CREATE TABLE IF NOT EXISTS STUDENTS (
            studentid INT AUTO_INCREMENT PRIMARY KEY,
            lastname VARCHAR(255) NOT NULL,
            firstname VARCHAR(255) NOT NULL,
            dob DATE NOT NULL
        );
    `;

    const createCoursesTable = `
        CREATE TABLE IF NOT EXISTS COURSES (
            courseid INT AUTO_INCREMENT PRIMARY KEY,
            coursename VARCHAR(255) NOT NULL,
            credits INT NOT NULL
        );
    `;

    const createGradesTable = `
        CREATE TABLE IF NOT EXISTS GRADES (
            courseid INT NOT NULL,
            studentid INT NOT NULL,
            term VARCHAR(50) NOT NULL,
            grade CHAR(1) NOT NULL,
            PRIMARY KEY (courseid, studentid, term),
            FOREIGN KEY (courseid) REFERENCES COURSES(courseid) ON DELETE CASCADE,
            FOREIGN KEY (studentid) REFERENCES STUDENTS(studentid) ON DELETE CASCADE
        );
    `;

    try {
        const connection = await pool.getConnection();
        console.log('Connected to the database.');

        await connection.query(createStudentsTable);
        console.log('STUDENTS table created or already exists.');

        await connection.query(createCoursesTable);
        console.log('COURSES table created or already exists.');

        await connection.query(createGradesTable);
        console.log('GRADES table created or already exists.');

        connection.release();
        console.log('Tables setup completed successfully.');
    } catch (err) {
        console.error('Error creating tables:', err);
        process.exit(1);
    }
}

module.exports = createTables;