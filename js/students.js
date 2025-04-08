// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const addStudentBtn = document.querySelector('.add-student-btn');
    const studentModal = document.getElementById('studentModal');
    const studentForm = document.getElementById('studentForm');
    const cancelBtn = document.querySelector('.cancel-btn');
    const searchInput = document.querySelector('.search-box input');
    const studentsTable = document.querySelector('.students-table tbody');
    const prevPageBtn = document.querySelector('.prev-page');
    const nextPageBtn = document.querySelector('.next-page');
    const pageInfo = document.querySelector('.page-info');
    
    // 当前页码和每页显示数量
    let currentPage = 1;
    const pageSize = 10;
    
    // API请求函数
    async function fetchApi(url, options = {}) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API请求失败:', error);
            throw error;
        }
    }
    
    // 获取所有学生
    async function getAllStudents() {
        try {
            return await fetchApi('/api/students');
        } catch (error) {
            console.error('获取学生列表失败:', error);
            alert('获取学生列表失败，请刷新页面重试');
            return [];
        }
    }
    
    // 添加学生
    async function addStudent(student) {
        try {
            return await fetchApi('/api/students', {
                method: 'POST',
                body: JSON.stringify(student)
            });
        } catch (error) {
            console.error('添加学生失败:', error);
            throw error;
        }
    }
    
    // 更新学生
    async function updateStudent(id, student) {
        try {
            return await fetchApi(`/api/students/${id}`, {
                method: 'PUT',
                body: JSON.stringify(student)
            });
        } catch (error) {
            console.error('更新学生失败:', error);
            throw error;
        }
    }
    
    // 删除学生
    async function deleteStudent(id) {
        try {
            return await fetchApi(`/api/students/${id}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error('删除学生失败:', error);
            throw error;
        }
    }
    
    // 渲染学生列表
    async function renderStudents() {
        try {
            const students = await getAllStudents();
            studentsTable.innerHTML = '';
            students.forEach(student => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${student.name}</td>
                    <td>${student.age}</td>
                    <td>${student.gender}</td>
                    <td>${student.birthday}</td>
                    <td>${student.course}</td>
                    <td>${student.completed_lessons}/${student.total_lessons}</td>
                    <td>
                        <button class="action-btn edit-btn" data-id="${student.id}">编辑</button>
                        <button class="action-btn delete-btn" data-id="${student.id}">删除</button>
                    </td>
                `;
                studentsTable.appendChild(row);
            });
            
            updatePagination(students.length);
        } catch (error) {
            console.error('渲染学生列表失败:', error);
            alert('获取学生列表失败，请刷新页面重试');
        }
    }
    
    // 更新分页信息
    function updatePagination(totalStudents) {
        const totalPages = Math.ceil(totalStudents / pageSize);
        pageInfo.textContent = `第 ${currentPage} 页，共 ${totalPages} 页`;
        
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
    }
    
    // 处理表单提交
    studentForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('表单提交开始');
        
        try {
            const formData = new FormData(studentForm);
            const studentData = Object.fromEntries(formData.entries());
            console.log('表单数据:', studentData);
            
            // 验证必填字段
            if (!studentData.name || !studentData.age || !studentData.gender || !studentData.birthday || !studentData.course) {
                alert('请填写所有必填字段！');
                return;
            }
            
            // 构建学生数据
            const student = {
                name: studentData.name.trim(),
                age: parseInt(studentData.age),
                gender: studentData.gender,
                birthday: studentData.birthday,
                parentName: studentData.parentName || '',
                parentPhone: studentData.parentPhone || '',
                course: studentData.course,
                totalLessons: parseInt(studentData.totalLessons) || 0,
                completedLessons: parseInt(studentData.completedLessons) || 0
            };
            
            // 验证课时数据
            if (student.completedLessons > student.totalLessons) {
                alert('已完成课时不能大于总课时！');
                return;
            }
            
            console.log('准备保存的学生数据:', student);
            
            const studentId = studentForm.dataset.studentId;
            if (studentId) {
                // 更新现有学生
                await updateStudent(studentId, student);
            } else {
                // 添加新学生
                await addStudent(student);
            }
            
            await renderStudents();
            studentModal.style.display = 'none';
            studentForm.reset();
            delete studentForm.dataset.studentId;
            
        } catch (error) {
            console.error('保存学生信息失败:', error);
            alert('保存失败，请重试');
        }
    });
    
    // 处理编辑和删除按钮点击
    studentsTable.addEventListener('click', async function(e) {
        if (e.target.classList.contains('edit-btn')) {
            const studentId = e.target.dataset.id;
            try {
                const students = await getAllStudents();
                const student = students.find(s => s.id === parseInt(studentId));
                
                if (student) {
                    // 填充表单
                    studentForm.elements.name.value = student.name;
                    studentForm.elements.age.value = student.age;
                    studentForm.elements.gender.value = student.gender;
                    studentForm.elements.birthday.value = student.birthday;
                    studentForm.elements.parentName.value = student.parent_name || '';
                    studentForm.elements.parentPhone.value = student.parent_phone || '';
                    studentForm.elements.course.value = student.course;
                    studentForm.elements.completedLessons.value = student.completed_lessons;
                    studentForm.elements.totalLessons.value = student.total_lessons;
                    
                    // 保存学生ID用于更新
                    studentForm.dataset.studentId = student.id;
                    
                    studentModal.style.display = 'block';
                    document.querySelector('.modal h2').textContent = '编辑学生';
                }
            } catch (error) {
                console.error('加载学生信息失败:', error);
                alert('加载学生信息失败，请重试');
            }
        }
        
        if (e.target.classList.contains('delete-btn')) {
            const studentId = e.target.dataset.id;
            if (confirm('确定要删除这个学生吗？')) {
                try {
                    await deleteStudent(studentId);
                    await renderStudents();
                } catch (error) {
                    console.error('删除学生失败:', error);
                    alert('删除失败，请重试');
                }
            }
        }
    });
    
    // 其他事件处理...
    addStudentBtn.addEventListener('click', function() {
        studentModal.style.display = 'block';
        studentForm.reset();
        delete studentForm.dataset.studentId;
        document.querySelector('.modal h2').textContent = '添加学生';
    });
    
    cancelBtn.addEventListener('click', function() {
        studentModal.style.display = 'none';
        studentForm.reset();
        delete studentForm.dataset.studentId;
    });
    
    // 点击弹窗外部关闭
    window.addEventListener('click', function(e) {
        if (e.target === studentModal) {
            studentModal.style.display = 'none';
        }
    });
    
    // 处理搜索
    searchInput.addEventListener('input', function(e) {
        const searchText = e.target.value.toLowerCase();
        // 这里可以添加搜索逻辑
        console.log('搜索内容：', searchText);
    });
    
    // 处理分页
    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderStudents();
        }
    });
    
    nextPageBtn.addEventListener('click', function() {
        getAllStudents()
            .then(students => {
                const totalPages = Math.ceil(students.length / pageSize);
                if (currentPage < totalPages) {
                    currentPage++;
                    renderStudents();
                }
            })
            .catch(error => {
                console.error('获取学生列表失败:', error);
                alert('获取学生列表失败，请刷新页面重试');
            });
    });
    
    // 初始化加载数据
    renderStudents();
}); 