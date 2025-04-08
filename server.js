const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { pool, initDatabase } = require('./config/database');

const app = express();

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// API路由
// 获取所有学生
app.get('/api/students', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM students ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('获取学生列表失败:', error);
        res.status(500).json({ error: '获取学生列表失败' });
    }
});

// 添加学生
app.post('/api/students', async (req, res) => {
    try {
        const student = req.body;
        const [result] = await pool.query(
            'INSERT INTO students (name, age, gender, birthday, parent_name, parent_phone, course, total_lessons, completed_lessons) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [student.name, student.age, student.gender, student.birthday, student.parentName, student.parentPhone, student.course, student.totalLessons, student.completedLessons]
        );
        res.json({ id: result.insertId, ...student });
    } catch (error) {
        console.error('添加学生失败:', error);
        res.status(500).json({ error: '添加学生失败' });
    }
});

// 更新学生
app.put('/api/students/:id', async (req, res) => {
    try {
        const student = req.body;
        await pool.query(
            'UPDATE students SET name=?, age=?, gender=?, birthday=?, parent_name=?, parent_phone=?, course=?, total_lessons=?, completed_lessons=? WHERE id=?',
            [student.name, student.age, student.gender, student.birthday, student.parentName, student.parentPhone, student.course, student.totalLessons, student.completedLessons, req.params.id]
        );
        res.json({ id: req.params.id, ...student });
    } catch (error) {
        console.error('更新学生失败:', error);
        res.status(500).json({ error: '更新学生失败' });
    }
});

// 删除学生
app.delete('/api/students/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM students WHERE id=?', [req.params.id]);
        res.json({ message: '删除成功' });
    } catch (error) {
        console.error('删除学生失败:', error);
        res.status(500).json({ error: '删除学生失败' });
    }
});

// 前端路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'students.html'));
});

// 初始化数据库并启动服务器
const port = process.env.PORT || 5500;
initDatabase()
    .then(() => {
        app.listen(port, () => {
            console.log(`服务器运行在 http://localhost:${port}`);
        });
    })
    .catch(error => {
        console.error('服务器启动失败:', error);
    }); 