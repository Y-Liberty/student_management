const mysql = require('mysql2');

// 创建数据库连接池
const pool = mysql.createPool(
    process.env.DATABASE_URL
        ? process.env.DATABASE_URL
        : {
              host: process.env.DB_HOST || 'localhost',
              user: process.env.DB_USER || 'root',
              password: process.env.DB_PASSWORD || '',
              database: process.env.DB_NAME || 'student_management',
              waitForConnections: true,
              connectionLimit: 10,
              queueLimit: 0
          }
);

// 创建数据库和表
async function initDatabase() {
    try {
        // 创建学生表
        await pool.promise().query(`
            CREATE TABLE IF NOT EXISTS students (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                age INT NOT NULL,
                gender VARCHAR(10) NOT NULL,
                birthday DATE NOT NULL,
                parent_name VARCHAR(255),
                parent_phone VARCHAR(20),
                course VARCHAR(255) NOT NULL,
                total_lessons INT DEFAULT 0,
                completed_lessons INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        
        console.log('数据库表初始化成功');
    } catch (error) {
        console.error('数据库初始化失败:', error);
        throw error;
    }
}

// 导出连接池和初始化函数
module.exports = {
    pool: pool.promise(),
    initDatabase
}; 