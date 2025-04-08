// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 获取登录表单
    const loginForm = document.getElementById('loginForm');
    
    // 添加表单提交事件监听器
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault(); // 阻止表单默认提交行为
        
        // 获取用户名和密码
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // 简单的表单验证
        if (!username || !password) {
            alert('请输入用户名和密码');
            return;
        }
        
        // 这里应该发送到后端进行验证
        // 临时使用本地存储模拟登录
        if (username === 'admin' && password === 'admin') {
            // 登录成功，跳转到首页
            window.location.href = '../pages/dashboard.html';
        } else {
            alert('用户名或密码错误');
        }
    });
}); 