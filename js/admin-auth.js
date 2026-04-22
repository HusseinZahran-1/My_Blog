// ADMIN AUTH - Login handler with admin flag
document.addEventListener('DOMContentLoaded', () => {
    console.log('Login page loaded');
    
    const form = document.getElementById('loginForm');
    const errorDiv = document.getElementById('errorMsg');
    const togglePwd = document.getElementById('togglePassword');
    const pwdInput = document.getElementById('password');
    const usernameInput = document.getElementById('username');
    
    // Toggle password visibility
    if (togglePwd && pwdInput) {
        togglePwd.onclick = function(e) {
            e.preventDefault();
            const type = pwdInput.type === 'password' ? 'text' : 'password';
            pwdInput.type = type;
            this.textContent = type === 'password' ? 'SHOW' : 'HIDE';
        };
    }
    
    // Handle login form submission
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            
            const username = usernameInput ? usernameInput.value.trim() : '';
            const password = pwdInput ? pwdInput.value : '';
            
            console.log('Login attempt:', username);
            
            // Check credentials against ADMIN_CREDS from data.js
            if (username === ADMIN_CREDS.username && password === ADMIN_CREDS.password) {
                // Store auth token in localStorage
                const token = btoa(username + ':' + Date.now());
                localStorage.setItem('hussein_auth', token);
                localStorage.setItem('hussein_user', username);
                
                // ========== ADD ADMIN FLAG ==========
                // Store additional flag to identify admin user
                localStorage.setItem('hussein_is_admin', 'true');
                // ====================================
                
                console.log('Login successful, admin flag set, redirecting...');
                
                // Show success message
                const successMsg = document.createElement('div');
                successMsg.className = 'success-toast';
                successMsg.textContent = 'LOGIN SUCCESSFUL! Redirecting to dashboard...';
                successMsg.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                    padding: 12px 24px;
                    border-radius: 12px;
                    z-index: 10000;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 14px;
                    animation: slideInRight 0.3s ease;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                `;
                document.body.appendChild(successMsg);
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 500);
            } else {
                // Show error message
                console.log('Login failed');
                if (errorDiv) {
                    errorDiv.style.display = 'block';
                    errorDiv.textContent = 'INVALID CREDENTIALS';
                    errorDiv.classList.add('shake');
                    
                    // Shake animation on the card
                    const card = document.querySelector('.login-card');
                    if (card) {
                        card.style.animation = 'shake 0.5s ease';
                        setTimeout(() => {
                            card.style.animation = '';
                        }, 500);
                    }
                    
                    setTimeout(() => {
                        errorDiv.style.display = 'none';
                        errorDiv.classList.remove('shake');
                    }, 3000);
                }
                
                // Clear password field
                if (pwdInput) pwdInput.value = '';
            }
        };
    }
    
    // Add enter key support
    if (pwdInput) {
        pwdInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (form) form.dispatchEvent(new Event('submit'));
            }
        });
    }
    
    if (usernameInput) {
        usernameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (form) form.dispatchEvent(new Event('submit'));
            }
        });
    }
});