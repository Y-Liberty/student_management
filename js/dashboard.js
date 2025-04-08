// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 获取退出按钮
    const logoutBtn = document.querySelector('.logout-btn');
    
    // 添加退出按钮点击事件
    logoutBtn.addEventListener('click', function() {
        if (confirm('确定要退出系统吗？')) {
            // 清除登录状态
            localStorage.removeItem('isLoggedIn');
            // 跳转到登录页面
            window.location.href = '../pages/login.html';
        }
    });
    
    // 获取搜索框
    const searchInput = document.querySelector('.search-box input');
    
    // 添加搜索框输入事件
    searchInput.addEventListener('input', function(e) {
        const searchText = e.target.value.toLowerCase();
        // 这里可以添加搜索逻辑
        console.log('搜索内容：', searchText);
    });
    
    // 获取导航菜单项
    const navItems = document.querySelectorAll('.nav-menu li');
    
    // 添加导航菜单点击事件
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有active类
            navItems.forEach(navItem => navItem.classList.remove('active'));
            // 添加当前active类
            this.classList.add('active');
        });
    });
    
    // 模拟获取统计数据
    function updateStats() {
        // 这里应该从后端获取实际数据
        const stats = {
            students: 120,
            teachers: 15,
            courses: 8,
            todayClasses: 6
        };
        
        // 更新统计卡片数据
        document.querySelectorAll('.card .number').forEach((card, index) => {
            const values = Object.values(stats);
            card.textContent = values[index];
        });
    }
    
    // 初始化统计数据
    updateStats();
    
    // 模拟获取最近活动
    function updateRecentActivities() {
        // 这里应该从后端获取实际数据
        const activities = [
            '张三同学完成了Python基础课程',
            '李四老师添加了新的Scratch课程',
            '王五同学报名了C++进阶课程'
        ];
        
        // 更新活动列表
        const activitiesList = document.querySelector('.recent-activities ul');
        activitiesList.innerHTML = activities.map(activity => 
            `<li>${activity}</li>`
        ).join('');
    }
    
    // 初始化最近活动
    updateRecentActivities();
}); 