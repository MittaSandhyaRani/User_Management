const apiUrl = 'https://jsonplaceholder.typicode.com/users';
let users = [];
let editUserId = null;

// Fetch users from the API and render them
async function fetchUsers() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch users');
        users = await response.json();
        renderUserList();
    } catch (error) {
        alert('Error fetching users from API: ' + error.message);
        // Display the error message in the UI
        document.getElementById('error-message').innerText = 'Failed to load users. Please try again later.';
    }
}

// Render the list of users
function renderUserList() {
    const userList = document.getElementById('user-list');
    if (users.length === 0) {
        userList.innerHTML = '<p>No users available.</p>';
    } else {
        userList.innerHTML = users.map(user => `
            <div class="user-item">
                <p><strong>ID:</strong> ${user.id}</p>
                <p><strong>Name:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Department:</strong> ${user.company?.name || 'N/A'}</p>
                <button onclick="showEditForm(${user.id})">Edit</button>
                <button onclick="deleteUser(${user.id})">Delete</button>
            </div>
        `).join('');
    }
}

// Show the form for adding or editing a user
function showForm() {
    document.getElementById('user-form').style.display = 'block';
}

// Hide the form
function hideForm() {
    document.getElementById('user-form').style.display = 'none';
    editUserId = null; // Clear edit ID
    document.getElementById('user-form').reset();
    document.getElementById('error-message').innerText = ''; // Clear error message
}

// Handle the form submission
async function handleFormSubmit(event) {
    event.preventDefault();

    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const department = document.getElementById('department').value.trim();

    if (!validateForm(firstName, lastName, email, department)) {
        return;
    }

    const userData = {
        name: `${firstName} ${lastName}`,
        email,
        company: { name: department },
    };

    if (editUserId) {
        await editUser(editUserId, userData);
    } else {
        await addUser(userData);
    }

    hideForm();
}

// Validate form input
function validateForm(firstName, lastName, email, department) {
    if (!firstName || !lastName || !email || !department) {
        document.getElementById('error-message').innerText = 'All fields are required.';
        return false;
    }
    if (!validateEmail(email)) {
        document.getElementById('error-message').innerText = 'Please enter a valid email address.';
        return false;
    }
    return true;
}

// Validate email format
function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
}

// Add a new user
async function addUser(userData) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        if (!response.ok) throw new Error('Failed to add user');
        const newUser = await response.json();
        users.push({ ...newUser, id: Date.now() }); // Simulated new user ID
        renderUserList();
    } catch (error) {
        alert('Error adding user: ' + error.message);
    }
}

// Show the edit form with pre-filled data
function showEditForm(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const [firstName, lastName] = user.name.split(' ');
    document.getElementById('first-name').value = firstName || '';
    document.getElementById('last-name').value = lastName || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('department').value = user.company?.name || '';
    editUserId = userId;

    showForm();
}

// Edit an existing user
async function editUser(userId, updatedData) {
    try {
        const response = await fetch(`${apiUrl}/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });
        if (!response.ok) throw new Error('Failed to edit user');
        const updatedUser = await response.json();
        const userIndex = users.findIndex(user => user.id === userId);
        if (userIndex !== -1) users[userIndex] = updatedUser;
        renderUserList();
    } catch (error) {
        alert('Error editing user: ' + error.message);
    }
}

// Delete a user
async function deleteUser(userId) {
    try {
        const response = await fetch(`${apiUrl}/${userId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete user');
        users = users.filter(user => user.id !== userId);
        renderUserList();
    } catch (error) {
        alert('Error deleting user: ' + error.message);
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
    document.getElementById('user-form').addEventListener('submit', handleFormSubmit);
    document.getElementById('cancel-button').addEventListener('click', hideForm);
});
