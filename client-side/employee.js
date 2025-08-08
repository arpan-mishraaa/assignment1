let isEditMode = false;
let currentEditEmail = null;


document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('isAuthenticated')) {
        alert('You are not authenticated. Please login first.');
        window.location.href = 'login.html';
        return;
    }
    loadEmployees();
});


document.getElementById('logoutBtn').addEventListener('click', function() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userEmail');
        window.location.href = 'login.html';
    }
});


document.getElementById('employeeForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (isEditMode) {
        await updateEmployee();
    } else {
        await addEmployee();
    }
});


document.getElementById('updateBtn').addEventListener('click', async function() {
    await updateEmployee();
});


document.getElementById('cancelBtn').addEventListener('click', function() {
    resetForm();
});


async function loadEmployees() {
    try {
        const response = await fetch('http://localhost:5262/api/Employee', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            mode: 'cors'
        });
        
        if (response.ok) {
            const employees = await response.json();
            displayEmployees(employees);
        } else {
            showMessage('Failed to load employees', 'error');
        }
    } catch (error) {
        showMessage(`Error: ${error.message}`, 'error');
    }
}


function displayEmployees(employees) {
    const tbody = document.getElementById('employeeTableBody');
    tbody.innerHTML = '';
    
    employees.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.empId}</td>
            <td>${employee.email}</td>
            <td>${employee.name}</td>
            <td>${new Date(employee.dob).toLocaleDateString()}</td>
            <td>${employee.isAdmin ? 'Yes' : 'No'}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editEmployee('${employee.email}')">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteEmployee(${employee.empId})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}


async function addEmployee() {
    const employeeData = getFormData();
    
    try {
        const response = await fetch('http://localhost:5262/api/Employee', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(employeeData)
        });
        
        if (response.ok) {
            showMessage('Employee added successfully!', 'success');
            resetForm();
            loadEmployees();
        } else {
            const errorData = await response.text();
            showMessage(`Failed to add employee: ${errorData}`, 'error');
        }
    } catch (error) {
        showMessage(`Error: ${error.message}`, 'error');
    }
}


async function updateEmployee() {
    const employeeData = getFormData();
    
    try {
        const response = await fetch(`http://localhost:5262/api/Employee/${employeeData.EmpId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify({ updatedEmployee: employeeData })
        });
        
        if (response.ok) {
            showMessage('Employee updated successfully!', 'success');
            resetForm();
            loadEmployees();
        } else {
            const errorData = await response.text();
            showMessage(`Failed to update employee: ${errorData}`, 'error');
        }
    } catch (error) {
        showMessage(`Error: ${error.message}`, 'error');
    }
}


async function deleteEmployee(empId) {
    if (!confirm('Are you sure you want to delete this employee?')) {
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:5262/api/Employee/${empId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json'
            },
            mode: 'cors'
        });
        
        if (response.ok) {
            showMessage('Employee deleted successfully!', 'success');
            loadEmployees();
        } else {
            const errorData = await response.text();
            showMessage(`Failed to delete employee: ${errorData}`, 'error');
        }
    } catch (error) {
        showMessage(`Error: ${error.message}`, 'error');
    }
}

function editEmployee(email) {
    
    const rows = document.querySelectorAll('#employeeTableBody tr');
    let employeeData = null;
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells[1].textContent === email) {
            employeeData = {
                empId: cells[0].textContent,
                email: cells[1].textContent,
                name: cells[2].textContent,
                dob: cells[3].textContent,
                isAdmin: cells[4].textContent === 'Yes'
            };
        }
    });
    
    if (employeeData) {
        
        document.getElementById('empId').value = employeeData.empId;
        document.getElementById('email').value = employeeData.email;
        document.getElementById('name').value = employeeData.name;
        
        
        const dateParts = employeeData.dob.split('/');
        const formattedDate = `${dateParts[2]}-${dateParts[0].padStart(2, '0')}-${dateParts[1].padStart(2, '0')}`;
        document.getElementById('dob').value = formattedDate;
        
        document.getElementById('isAdmin').checked = employeeData.isAdmin;
        
        
        isEditMode = true;
        currentEditEmail = email;
        document.getElementById('addBtn').style.display = 'none';
        document.getElementById('updateBtn').style.display = 'inline-block';
        document.getElementById('cancelBtn').style.display = 'inline-block';
    }
}


function getFormData() {
    const dobValue = document.getElementById('dob').value;
    
    return {
        EmpId: parseInt(document.getElementById('empId').value),
        Email: document.getElementById('email').value,
        Name: document.getElementById('name').value,
        DOB: dobValue,
        IsAdmin: document.getElementById('isAdmin').checked
    };
}


function resetForm() {
    document.getElementById('employeeForm').reset();
    isEditMode = false;
    currentEditEmail = null;
    document.getElementById('addBtn').style.display = 'inline-block';
    document.getElementById('updateBtn').style.display = 'none';
    document.getElementById('cancelBtn').style.display = 'none';
}


function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = message;
    messageDiv.className = type;
    
    setTimeout(() => {
        messageDiv.innerHTML = '';
        messageDiv.className = '';
    }, 5000);
}