// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "Airn.firebaseapp.com",
    projectId: "AiRn",
    storageBucket: "AiRn.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef1234567890"
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
mobileMenuBtn.addEventListener('click', () => {
    mainNav.classList.toggle('show');
});

// Modal Functions
function openModal(modal) {
    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

// Event Listeners for Modals
loginBtn.addEventListener('click', () => openModal(loginModal));
signupBtn.addEventListener('click', () => openModal(signupModal));

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
    error.textContent = message;
    
    if (!formGroup.querySelector('.error-message')) {
        formGroup.appendChild(error);
    }
    
    input.style.borderColor = '#ff7675';
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
        document.querySelector('.auth-buttons').innerHTML = `
            <div class="user-dropdown">
                <button class="btn user-btn">
                    <i class="fas fa-user-circle"></i> ${user.email}
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
            auth.signOut().then(() => {
                window.location.reload();
            });
        });
        
        closeModal(loginModal);
        alert('Login successful!');
    } catch (error) {
        let errorMessage = 'Login failed. Please try again.';
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'No user found with this email.';
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Incorrect password.';
        }
        alert(errorMessage);
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
        document.querySelector('.auth-buttons').innerHTML = `
            <div class="user-dropdown">
                <button class="btn user-btn">
                    <i class="fas fa-user-circle"></i> ${user.email}
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
            auth.signOut().then(() => {
                window.location.reload();
            });
        });
        
        closeModal(signupModal);
        alert('Signup successful! Welcome to AI Hub Pro!');
    } catch (error) {
        let errorMessage = 'Signup failed. Please try again.';
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'Email already in use. Please login instead.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Password should be at least 6 characters';
        }
        alert(errorMessage);
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
        alert('Password reset email sent! Please check your inbox.');
        closeModal(forgotPasswordModal);
    } catch (error) {
        alert('Error sending reset email. Please try again.');
    } finally {
        setLoading(resetButton, false);
    }
});

// Social Login Functions
document.querySelector('.social-btn.google')?.addEventListener('click', async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
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
        document.querySelector('.auth-buttons').innerHTML = `
            <div class="user-dropdown">
                <button class="btn user-btn">
                    <i class="fas fa-user-circle"></i> ${user.email}
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
            auth.signOut().then(() => {
                window.location.reload();
            });
        });
        
        closeModal(loginModal);
        alert('Login successful with Google!');
    } catch (error) {
        alert('Google login failed. Please try again.');
    }
});

// Check Auth State
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        document.querySelector('.auth-buttons').innerHTML = `
            <div class="user-dropdown">
                <button class="btn user-btn">
                    <i class="fas fa-user-circle"></i> ${user.email}
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
            auth.signOut().then(() => {
                window.location.reload();
            });
        });
    }
});

// Search Functionality
document.getElementById('search-button')?.addEventListener('click', (e) => {
    e.preventDefault();
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const toolCards = document.querySelectorAll('.tool-card');
    const courseCards = document.querySelectorAll('.course-card');
    let visibleCount = 0;

    if (searchTerm.trim() === '') {
        toolCards.forEach(card => card.style.display = '');
        courseCards.forEach(card => card.style.display = '');
        document.getElementById('results-count').textContent = '';
        return;
    }

    toolCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('.tool-description').textContent.toLowerCase();
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    courseCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('.course-description').textContent.toLowerCase();
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    document.getElementById('results-count').textContent = `${visibleCount} results found`;
});

// Tab Filtering
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.dataset.category || btn.dataset.tab;
        const isToolTab = btn.dataset.category !== undefined;
        
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        
        if (isToolTab) {
            // Filter tools
            const tools = document.querySelectorAll('.tool-card');
            tools.forEach(tool => {
                if (category === 'all' || tool.dataset.category === category) {
                    tool.style.display = '';
                } else {
                    tool.style.display = 'none';
                }
            });
        } else {
            // Filter courses
            const courses = document.querySelectorAll('.course-card');
            courses.forEach(course => {
                if (category === 'all' || 
                    (category === 'free' && course.classList.contains('free')) || 
                    (category === 'premium' && course.classList.contains('premium'))) {
                    course.style.display = '';
                } else {
                    course.style.display = 'none';
                }
            });
        }
    });
});

// Course Enrollment
document.querySelectorAll('.btn.enroll, .btn.premium-enroll').forEach(btn => {
    btn.addEventListener('click', () => {
        const courseTitle = btn.closest('.course-card').querySelector('h3').textContent;
        if (btn.classList.contains('premium-enroll')) {
            alert(`You've enrolled in the premium course: ${courseTitle}`);
        } else {
            alert(`You've enrolled in the free course: ${courseTitle}`);
        }
    });
});

// Set dark theme by default
document.documentElement.setAttribute('data-theme', 'dark');