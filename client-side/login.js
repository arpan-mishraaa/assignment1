document.getElementById('generateOtpBtn').addEventListener('click', async function() {
    const email = document.getElementById('email').value;
    
    if (!email) {
        showMessage('Please enter your email first', 'error');
        return;
    }
    
    try {
        const response = await fetch('http://localhost:5262/api/Otp/request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(email)
        });
        
        if (response.ok) {
            showMessage('OTP sent to your email!', 'success');
        } else {
            const errorData = await response.text();
            showMessage(`Failed to send OTP: ${errorData}`, 'error');
        }
    } catch (error) {
        showMessage(`Error: ${error.message}`, 'error');
    }
});

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const otp = document.getElementById('otp').value;
    
    try {
        const response = await fetch('http://localhost:5262/api/Otp/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify({ 
                Email: email,
                Otp: otp 
            })
        });
        
        if (response.ok) {
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userEmail', email);
            showMessage('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'employee.html';
            }, 2000);
        } else {
            const errorData = await response.text();
            showMessage(`Login failed: ${errorData}`, 'error');
        }
    } catch (error) {
        showMessage(`Error: ${error.message}`, 'error');
    }
});

function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = message;
    messageDiv.className = type;
}