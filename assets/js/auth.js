/* assets/js/auth.js */

const USERS_KEY = 'mugcraft_users';
const SESSION_KEY = 'mugcraft_current_user';

// Get all users
function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch (e) {
        return [];
    }
}

// Get current session
function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem(SESSION_KEY));
    } catch (e) {
        return null;
    }
}

// Register new user
function registerUser(name, email, password) {
    const users = getUsers();
    if (users.find(u => u.email === email)) {
        return { success: false, message: 'Email already registered' };
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        password // In a real app, hash this!
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return { success: true, message: 'Registration successful' };
}

// Login user
function loginUser(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Create session (exclude password)
        const sessionUser = { id: user.id, name: user.name, email: user.email };
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
        updateAuthUI();
        return { success: true, user: sessionUser };
    }

    return { success: false, message: 'Invalid credentials' };
}

// Logout
function logoutUser() {
    localStorage.removeItem(SESSION_KEY);
    updateAuthUI();
    window.location.href = 'index.html';
}

// Update Header UI based on auth state
function updateAuthUI() {
    const user = getCurrentUser();
    const authLinks = document.getElementById('auth-links');

    if (!authLinks) return;

    if (user) {
        authLinks.innerHTML = `
            <span class="auth-welcome">Hi, ${user.name}</span>
            <a href="#" onclick="logoutUser(); return false;" class="auth-link">Logout</a>
        `;
    } else {
        authLinks.innerHTML = `
            <a href="login.html" class="auth-link">Login</a>
            <a href="signup.html" class="auth-link register-link">Sign Up</a>
        `;
    }
}

// Run on load
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
});
