document.getElementById('registrationForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const uid = document.getElementById('uid').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    
    const userData = {
        UID: uid,
        Name: name,
        Email: email
    };
    
    try {
        const response = await fetch('http://localhost:5262/api/User', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(userData)
        });
        
        const messageDiv = document.getElementById('message');
        
        if (response.ok) {
            messageDiv.innerHTML = 'Registration successful!';
            messageDiv.className = 'success';
            document.getElementById('registrationForm').reset();
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            const errorData = await response.text();
            messageDiv.innerHTML = `Registration failed: ${errorData}`;
            messageDiv.className = 'error';
        }
    } catch (error) {
        const messageDiv = document.getElementById('message');
        messageDiv.innerHTML = `Error: ${error.message}`;
        messageDiv.className = 'error';
    }
});