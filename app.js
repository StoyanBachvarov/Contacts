// Initialize Supabase client
// REPLACE THESE VALUES WITH YOUR ACTUAL SUPABASE URL AND ANON KEY
const SUPABASE_URL = 'https://kdborjjsklzmcgvynoxa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkYm9yampza2x6bWNndnlub3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExOTM3OTEsImV4cCI6MjA4Njc2OTc5MX0.9lLgS6foedMIEhGYHNg8c-Bq4F7UIduNDw6fcIhXPak';

// Check if Supabase is available
if (!window.supabase) {
    console.error('Supabase library not loaded');
    document.getElementById('contactsList').innerHTML = '<div class="loading">Error: Supabase library not loaded. Check internet connection.</div>';
}

const sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM Elements
const authContainer = document.getElementById('authContainer');
const appContainer = document.getElementById('appContainer');
const authActions = document.getElementById('authActions');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const logoutBtn = document.getElementById('logoutBtn');
const userEmailSpan = document.getElementById('userEmail');
const authMessage = document.getElementById('authMessage');

const contactsList = document.getElementById('contactsList');
const searchInput = document.getElementById('searchInput');
const addContactBtn = document.getElementById('addContactBtn');
const contactModal = document.getElementById('contactModal');
const deleteModal = document.getElementById('deleteModal');
const contactForm = document.getElementById('contactForm');
const modalTitle = document.getElementById('modalTitle');
const closeModal = document.querySelector('.close');
const cancelBtn = document.getElementById('cancelBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

// State
let currentDeleteId = null;
let allContacts = [];
let currentUser = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkUser();
});

// Event Listeners
addContactBtn.addEventListener('click', () => openModal());
closeModal.addEventListener('click', closeModalFunc);
cancelBtn.addEventListener('click', closeModalFunc);
window.addEventListener('click', (e) => {
    if (e.target === contactModal) closeModalFunc();
    if (e.target === deleteModal) closeDeleteModalFunc();
});

contactForm.addEventListener('submit', handleFormSubmit);
searchInput.addEventListener('input', handleSearch);
cancelDeleteBtn.addEventListener('click', closeDeleteModalFunc);
confirmDeleteBtn.addEventListener('click', handleDelete);

// Auth Event Listeners
loginForm.addEventListener('submit', handleLogin);
registerForm.addEventListener('submit', handleRegister);
logoutBtn.addEventListener('click', handleLogout);

// Auth Functions
async function checkUser() {
    const { data: { session } } = await sbClient.auth.getSession();
    handleSession(session);

    sbClient.auth.onAuthStateChange((_event, session) => {
        handleSession(session);
    });
}

function handleSession(session) {
    if (session) {
        currentUser = session.user;
        userEmailSpan.textContent = currentUser.email;
        authContainer.style.display = 'none';
        appContainer.style.display = 'block';
        authActions.style.display = 'flex';
        fetchContacts();
    } else {
        currentUser = null;
        userEmailSpan.textContent = '';
        authContainer.style.display = 'block';
        appContainer.style.display = 'none';
        authActions.style.display = 'none';
        contactsList.innerHTML = ''; // Clear contacts
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    showMessage('Logging in...', 'info');

    try {
        const { error } = await sbClient.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        // Success handled by onAuthStateChange
        showMessage('', 'none');
    } catch (error) {
        console.error('Login error:', error);
        showMessage(error.message, 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    showMessage('Registering...', 'info');

    try {
        const { error } = await sbClient.auth.signUp({
            email,
            password
        });
        if (error) throw error;
        showMessage('Registration successful! Please check your email to confirm.', 'success');
    } catch (error) {
        console.error('Registration error:', error);
        showMessage(error.message, 'error');
    }
}

async function handleLogout() {
    try {
        const { error } = await sbClient.auth.signOut();
        if (error) throw error;
        // handled by onAuthStateChange
    } catch (error) {
        console.error('Logout error:', error);
        alert(error.message);
    }
}

function showMessage(msg, type) {
    authMessage.style.display = type === 'none' ? 'none' : 'block';
    authMessage.textContent = msg;
    authMessage.className = `message ${type}`;
    if (type === 'error') authMessage.style.backgroundColor = '#ffebee';
    if (type === 'success') authMessage.style.backgroundColor = '#e8f5e9';
    if (type === 'info') authMessage.style.backgroundColor = '#e3f2fd';
}

function switchTab(tabName) {
    // Hide all forms
    document.querySelectorAll('.auth-form').forEach(form => form.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    // Show selected
    if (tabName === 'login') {
        document.getElementById('loginForm').style.display = 'flex';
        document.querySelector('.tab-btn:first-child').classList.add('active');
    } else {
        document.getElementById('registerForm').style.display = 'flex';
        document.querySelector('.tab-btn:last-child').classList.add('active');
    }
    
    // Clear messages
    showMessage('', 'none');
}

// Global scope for HTML onclick
window.switchTab = switchTab;

// Data Functions

async function fetchContacts() {
    if (!currentUser) return; // Guard clause
    contactsList.innerHTML = '<div class="loading">Loading contacts...</div>';

    
    try {
        // Fetch contacts for the current user
        console.log("Fetching contacts for user:", currentUser.id);
        
        const { data, error } = await sbClient
            .from('contacts')
            .select('*')
            // Filter by user_id so users only see their own contacts
            .eq('user_id', currentUser.id)
            .order('name', { ascending: true });

        if (error) {
            console.error("Supabase Fetch Error:", error);
            throw error;
        }
        
        console.log("Contacts fetched:", data);
        allContacts = data;
        renderContacts(allContacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        contactsList.innerHTML = `<div class="loading">Error loading contacts: ${error.message}</div>`;
    }
}

function renderContacts(contacts) {
    contactsList.innerHTML = '';
    
    if (contacts.length === 0) {
        contactsList.innerHTML = '<div class="loading">No contacts found.</div>';
        return;
    }

    contacts.forEach(contact => {
        const card = document.createElement('div');
        card.className = 'contact-card';
        card.innerHTML = `
            <h3>${escapeHtml(contact.name)}</h3>
            <div class="contact-info">
                <p><strong>Phone:</strong> ${escapeHtml(contact.phone || 'N/A')}</p>
                <p><strong>Email:</strong> ${escapeHtml(contact.email || 'N/A')}</p>
                <p><strong>Town:</strong> ${escapeHtml(contact.town || 'N/A')}</p>
                <p><strong>Comments:</strong> ${escapeHtml(contact.comments || '')}</p>
            </div>
            <div class="card-actions">
                <button class="btn secondary" onclick="editContact(${contact.id})">Edit</button>
                <button class="btn danger" onclick="confirmDelete(${contact.id})">Delete</button>
            </div>
        `;
        contactsList.appendChild(card);
    });
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredContacts = allContacts.filter(contact => 
        (contact.name && contact.name.toLowerCase().includes(searchTerm)) ||
        (contact.town && contact.town.toLowerCase().includes(searchTerm)) ||
        (contact.email && contact.email.toLowerCase().includes(searchTerm))
    );
    renderContacts(filteredContacts);
}

function openModal(contact = null) {
    contactModal.style.display = 'flex';
    if (contact) {
        modalTitle.textContent = 'Edit Contact';
        document.getElementById('contactId').value = contact.id;
        document.getElementById('name').value = contact.name || '';
        document.getElementById('phone').value = contact.phone || '';
        document.getElementById('email').value = contact.email || '';
        document.getElementById('town').value = contact.town || '';
        document.getElementById('comments').value = contact.comments || '';
    } else {
        modalTitle.textContent = 'Add Contact';
        contactForm.reset();
        document.getElementById('contactId').value = '';
    }
}

function closeModalFunc() {
    contactModal.style.display = 'none';
}

function closeDeleteModalFunc() {
    deleteModal.style.display = 'none';
    currentDeleteId = null;
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('contactId').value;
    const contactData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value || null,
        email: document.getElementById('email').value || null,
        town: document.getElementById('town').value || null,
        comments: document.getElementById('comments').value || null,
        user_id: currentUser.id // Link contact to current user
    };

    try {
        if (id) {
            // Update existing
            const { error } = await sbClient
                .from('contacts')
                .update(contactData)
                .eq('id', id);
            
            if (error) throw error;
        } else {
            // Create new
            const { error } = await sbClient
                .from('contacts')
                .insert([contactData]);
            
            if (error) throw error;
        }

        closeModalFunc();
        fetchContacts();
    } catch (error) {
        console.error('Error saving contact:', error);
        alert(`Error saving contact: ${error.message}`);
    }
}

// Global functions for inline onclick handlers
window.editContact = (id) => {
    const contact = allContacts.find(c => c.id === id);
    if (contact) {
        openModal(contact);
    }
};

window.confirmDelete = (id) => {
    currentDeleteId = id;
    deleteModal.style.display = 'flex';
};

async function handleDelete() {
    if (!currentDeleteId) return;

    try {
        const { error } = await sbClient
            .from('contacts')
            .delete()
            .eq('id', currentDeleteId);

        if (error) throw error;

        closeDeleteModalFunc();
        fetchContacts();
    } catch (error) {
        console.error('Error deleting contact:', error);
        alert(`Error deleting contact: ${error.message}`);
    }
}

function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    return text
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
