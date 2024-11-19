let users = [];
let editUserId = null;

async function fetchUsers() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        users = await response.json();
        renderUserList();
    } catch (error) {
        alert('Error fetching users');
    }
}

function renderUserList() {
    const userList = document.getElementById('user-list');
    userList.innerHTML = users.map(user => `
        <div class="user-item">
            <p>ID: ${user.id}</p>
            <p>Name: ${user.name}</p>
            <p>Email: ${user.email}</p>
            <p>Department: ${user.company.name}</p>
            <button onclick="showEditForm(${user.id})">Edit</button>
            <button onclick="deleteUser(${user.id})">Delete</button>
        </div>
    `).join('');
}

async function deleteUser(id) {
    try {
        await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
            method: 'DELETE',
        });
        users = users.filter(user => user.id !== id);
        renderUserList();
    } catch (error) {
        alert('Error deleting user');
    }
}

function showAddForm() {
    document.getElementById('user-form').style.display = 'block';
    document.getElementById('form-title').innerText = 'Add User';
    document.getElementById('form').reset();
    editUserId = null;
}

function showEditForm(id) {
    const user = users.find(u => u.id === id);
    document.getElementById('user-form').style.display = 'block';
    document.getElementById('form-title').innerText = 'Edit User';
    document.getElementById('first-name').value = user.name.split(' ')[0];
    document.getElementById('last-name').value = user.name.split(' ')[1];
    document.getElementById('email').value = user.email;
    document.getElementById('department').value = user.company.name;
    editUserId = id;
}

function hideForm() {
    document.getElementById('user-form').style.display = 'none';
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const department = document.getElementById('department').value;

    const userData = {
        name: `${firstName} ${lastName}`,
        email: email,
        company: {
            name: department
        }
    };

    try {
        if (editUserId) {
            // Update user
            await fetch(`https://jsonplaceholder.typicode.com/users/${editUserId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            const userIndex = users.findIndex(user => user.id === editUserId);
            users[userIndex] = { ...users[userIndex], ...userData };
        } else {
            // Add new user
            await fetch('https://jsonplaceholder.typicode.com/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            users.push({ ...userData, id: users.length + 1 });
        }
        renderUserList();
        hideForm();
    } catch (error) {
        alert('Error saving user');
    }
}

fetchUsers();
