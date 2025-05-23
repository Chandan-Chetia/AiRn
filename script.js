// Firebase configuration - REPLACE WITH YOUR ACTUAL CONFIG
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "airn-242d6.firebaseapp.com",
    projectId: "airn-242d6",
    storageBucket: "airn-242d6.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const loginBtn = document.querySelector('.btn.login');
const signupBtn = document.querySelector('.btn.signup');
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const forgotPasswordModal = document.getElementById('forgot-password-modal');
const closeModalButtons = document.querySelectorAll('.close-modal');
const forgotPasswordLink = document.querySelector('.forgot-password');
const backToLoginLink = document.querySelector('.switch-to-login');
const switchToSignup = document.querySelector('.switch-to-signup');
const switchToLogin = document.querySelector('.switch-to-login');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mainNav = document.querySelector('.main-nav ul');

// Mobile Menu Toggle
mobileMenuBtn?.addEventListener('click', () => {
    mainNav?.classList.toggle('show');
});

// Modal Functions
function openModal(modal) {
    if (!modal) return;
    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

// Event Listeners for Modals
loginBtn?.addEventListener('click', () => openModal(loginModal));
signupBtn?.addEventListener('click', () => openModal(signupModal));

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        closeModal(modal);
    });
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target);
    }
});

forgotPasswordLink?.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(loginModal);
    openModal(forgotPasswordModal);
});

backToLoginLink?.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(forgotPasswordModal);
    openModal(loginModal);
});

switchToSignup?.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(loginModal);
    openModal(signupModal);
});

switchToLogin?.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(signupModal);
    openModal(loginModal);
});

// Form Validation Functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// Show Error Function
function showError(input, message) {
    const formGroup = input.parentElement;
    const error = formGroup.querySelector('.error-message') || document.createElement('div');
    error.className = 'error-message';
    error.style.color = '#ef4444';
    error.style.fontSize = '0.875rem';
    error.style.marginTop = '0.25rem';
    error.textContent = message;
    
    if (!formGroup.querySelector('.error-message')) {
        formGroup.appendChild(error);
    }
    
    input.style.borderColor = '#ef4444';
}

// Clear Error Function
function clearError(input) {
    const formGroup = input.parentElement;
    const error = formGroup.querySelector('.error-message');
    if (error) {
        error.remove();
    }
    input.style.borderColor = '#ddd';
}

// Loading State Function
function setLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    } else {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText;
    }
}

// Login Function
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const loginButton = document.querySelector('.login-btn');
    
    // Validate inputs
    let isValid = true;
    
    if (!validateEmail(email)) {
        showError(document.getElementById('login-email'), 'Please enter a valid email');
        isValid = false;
    } else {
        clearError(document.getElementById('login-email'));
    }
    
    if (!validatePassword(password)) {
        showError(document.getElementById('login-password'), 'Password must be at least 6 characters');
        isValid = false;
    } else {
        clearError(document.getElementById('login-password'));
    }
    
    if (!isValid) return;
    
    // Save original button text
    loginButton.dataset.originalText = loginButton.innerHTML;
    setLoading(loginButton, true);
    
    try {
        // Sign in with Firebase
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Update UI
        updateAuthUI(user);
        
        closeModal(loginModal);
        showToast('Login successful!', 'success');
    } catch (error) {
        let errorMessage = 'Login failed. Please try again.';
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'No user found with this email.';
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Incorrect password.';
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Account temporarily disabled due to too many failed attempts.';
        }
        showToast(errorMessage, 'error');
    } finally {
        setLoading(loginButton, false);
    }
});

// Signup Function
document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const signupButton = document.querySelector('.signup-btn');
    
    // Validate inputs
    let isValid = true;
    
    if (name.trim() === '') {
        showError(document.getElementById('signup-name'), 'Name is required');
        isValid = false;
    } else {
        clearError(document.getElementById('signup-name'));
    }
    
    if (!validateEmail(email)) {
        showError(document.getElementById('signup-email'), 'Please enter a valid email');
        isValid = false;
    } else {
        clearError(document.getElementById('signup-email'));
    }
    
    if (!validatePassword(password)) {
        showError(document.getElementById('signup-password'), 'Password must be at least 6 characters');
        isValid = false;
    } else {
        clearError(document.getElementById('signup-password'));
    }
    
    if (password !== confirmPassword) {
        showError(document.getElementById('signup-confirm-password'), 'Passwords do not match');
        isValid = false;
    } else {
        clearError(document.getElementById('signup-confirm-password'));
    }
    
    if (!isValid) return;
    
    // Save original button text
    signupButton.dataset.originalText = signupButton.innerHTML;
    setLoading(signupButton, true);
    
    try {
        // Create user with Firebase
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Save additional user data to Firestore
        await db.collection('users').doc(user.uid).set({
            name: name,
            email: email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            premium: false
        });
        
        // Update UI
        updateAuthUI(user);
        
        closeModal(signupModal);
        showToast('Signup successful! Welcome to AI Hub Pro!', 'success');
    } catch (error) {
        let errorMessage = 'Signup failed. Please try again.';
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'Email already in use. Please login instead.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Password should be at least 6 characters';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Please enter a valid email address';
        }
        showToast(errorMessage, 'error');
    } finally {
        setLoading(signupButton, false);
    }
});

// Forgot Password Function
document.getElementById('forgot-password-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('reset-email').value;
    const resetButton = document.querySelector('#forgot-password-form button');
    
    // Validate email
    if (!validateEmail(email)) {
        showError(document.getElementById('reset-email'), 'Please enter a valid email');
        return;
    }
    
    // Save original button text
    resetButton.dataset.originalText = resetButton.innerHTML;
    setLoading(resetButton, true);
    
    try {
        // Send password reset email
        await auth.sendPasswordResetEmail(email);
        showToast('Password reset email sent! Please check your inbox.', 'success');
        closeModal(forgotPasswordModal);
    } catch (error) {
        let errorMessage = 'Error sending reset email. Please try again.';
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'No user found with this email.';
        }
        showToast(errorMessage, 'error');
    } finally {
        setLoading(resetButton, false);
    }
});

// Social Login Functions
document.querySelector('.social-btn.google')?.addEventListener('click', async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    const loginButton = document.querySelector('.social-btn.google');
    
    // Save original button text
    loginButton.dataset.originalText = loginButton.innerHTML;
    setLoading(loginButton, true);
    
    try {
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        
        // Check if user is new
        if (result.additionalUserInfo?.isNewUser) {
            // Save user data to Firestore
            await db.collection('users').doc(user.uid).set({
                name: user.displayName,
                email: user.email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                premium: false
            });
        }
        
        // Update UI
        updateAuthUI(user);
        
        closeModal(loginModal);
        showToast('Login successful with Google!', 'success');
    } catch (error) {
        showToast('Google login failed. Please try again.', 'error');
    } finally {
        setLoading(loginButton, false);
    }
});

// Update Authentication UI
function updateAuthUI(user) {
    if (!user) {
        // User is signed out
        document.querySelector('.auth-buttons').innerHTML = `
            <button class="btn login">Login</button>
            <button class="btn signup">Sign Up</button>
        `;
        
        // Reattach event listeners
        document.querySelector('.btn.login')?.addEventListener('click', () => openModal(loginModal));
        document.querySelector('.btn.signup')?.addEventListener('click', () => openModal(signupModal));
        return;
    }
    
    // User is signed in
    const displayName = user.displayName || user.email.split('@')[0];
    
    document.querySelector('.auth-buttons').innerHTML = `
        <div class="user-dropdown">
            <button class="btn user-btn">
                <i class="fas fa-user-circle"></i> ${displayName}
            </button>
            <div class="dropdown-content">
                <a href="#profile">Profile</a>
                <a href="#settings">Settings</a>
                <a href="#" id="logout-btn">Logout</a>
            </div>
        </div>
    `;
    
    // Add logout functionality
    document.getElementById('logout-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        auth.signOut();
    });
}

// Toast Notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Check Auth State
auth.onAuthStateChanged((user) => {
    updateAuthUI(user);
});

// Set dark theme by default
document.documentElement.setAttribute('data-theme', 'dark');

// Add some basic CSS for toast notifications
const toastCSS = document.createElement('style');
toastCSS.textContent = `
.toast {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 24px;
    border-radius: 4px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
    max-width: 90%;
    text-align: center;
}
.toast.show {
    opacity: 1;
}
.toast-success {
    background-color: #10b981;
}
.toast-error {
    background-color: #ef4444;
}
.toast-info {
    background-color: #3b82f6;
}
`;
document.head.appendChild(toastCSS);