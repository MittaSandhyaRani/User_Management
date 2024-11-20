let users = []; // Array to store user data fetched from the server
let editUserId = null; // Variable to track the user being edited (null for adding new user)

// Function to fetch users from the API
async function fetchUsers() {
    try {
        // Fetch user data from the placeholder API
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        users = await response.json(); // Store fetched data in the users array
        renderUserList(); // Render the list of users
    } catch (error) {
        alert('Error fetching users'); // Show an error message if fetching fails
    }
}

// Function to render the user list on the page
function renderUserList() {
    const userList = document.getElementById('user-list'); // Target the user list container
    userList.innerHTML = users.map(user => `
        <div class="user-item">
            <p>ID: ${user.id}</p>
            <p>Name: ${user.name}</p>
            <p>Email: ${user.email}</p>
            <p>Department: ${user.company.name}</p>
            <button onclick="showEditForm(${user.id})">Edit</button>
            <button onclick="deleteUser(${user.id})">Delete</button>
        </div>
    `).join(''); // Generate HTML for each user and inject it into the container
}

// Function to delete a user by ID
async function deleteUser(id) {
    try {
        // Send a DELETE request to the API
        await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
            method: 'DELETE',
        });
        // Remove the user from the users array
        users = users.filter(user => user.id !== id);
        renderUserList(); // Re-render the user list
    } catch (error) {
        alert('Error deleting user'); // Show an error message if deletion fails
    }
}

// Function to show the form for adding a new user
function showAddForm() {
    document.getElementById('user-form').style.display = 'block'; // Display the form
    document.getElementById('form-title').innerText = 'Add User'; // Set form title
    document.getElementById('form').reset(); // Clear the form inputs
    editUserId = null; // Reset editUserId for adding a new user
}

// Function to show the form for editing an existing user
function showEditForm(id) {
    const user = users.find(u => u.id === id); // Find the user by ID
    document.getElementById('user-form').style.display = 'block'; // Display the form
    document.getElementById('form-title').innerText = 'Edit User'; // Set form title
    // Pre-fill form inputs with existing user data
    document.getElementById('first-name').value = user.name.split(' ')[0];
    document.getElementById('last-name').value = user.name.split(' ')[1];
    document.getElementById('email').value = user.email;
    document.getElementById('department').value = user.company.name;
    editUserId = id; // Set editUserId to the current user's ID
}

// Function to hide the form
function hideForm() {
    document.getElementById('user-form').style.display = 'none'; // Hide the form
}

// Function to handle form submission for adding or editing a user
async function handleFormSubmit(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get input values from the form
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const department = document.getElementById('department').value;

    // Create a user data object
    const userData = {
        name: `${firstName} ${lastName}`, // Combine first and last names
        email: email,
        company: {
            name: department, // Assign department to company name
        },
    };

    try {
        if (editUserId) {
            // Update an existing user
            await fetch(`https://jsonplaceholder.typicode.com/users/${editUserId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData), // Send updated user data
            });
            const userIndex = users.findIndex(user => user.id === editUserId);
            users[userIndex] = { ...users[userIndex], ...userData }; // Update the local users array
        } else {
            // Add a new user
            await fetch('https://jsonplaceholder.typicode.com/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData), // Send new user data
            });

            // Add the new user to the local users array
            users.push({ ...userData, id: users.length + 1 });
        }
        renderUserList(); // Re-render the user list
        hideForm(); // Hide the form after submission
        
    } catch (error) {
        alert('Error saving user'); // Show an error message if saving fails
    }
}

// Initial fetch to populate the user list
fetchUsers();
