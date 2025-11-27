// Admin Dashboard JavaScript
class AdminDashboard {
    constructor() {
        // IMPORTANT: Replace this URL with your Railway backend URL after deployment
        // Example: 'https://tradegpt-production-xxxx.up.railway.app/api'
        // Production: https://trade-gpt-ay57.onrender.com/api
        this.baseURL = window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : 'https://trade-gpt-ay57.onrender.com/api';
        this.currentPage = 1;
        this.leadsPerPage = 25;
        this.allLeads = [];
        this.filteredLeads = [];
        this.selectedLeadIds = new Set();
        
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.setupEventListeners();
        this.setupNavigation();
    }

    checkAuthentication() {
        // Check if user is logged in (you might want to implement a proper session check)
        const isLoggedIn = localStorage.getItem('adminLoggedIn');
        if (isLoggedIn === 'true') {
            this.showDashboard();
            this.loadLeads();
            this.loadStatistics();
        } else {
            this.showLogin();
        }
    }

    setupEventListeners() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Refresh leads
        document.getElementById('refreshLeads').addEventListener('click', () => {
            this.loadLeads();
        });

        // Search and filters
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        document.getElementById('statusFilter').addEventListener('change', (e) => {
            this.handleStatusFilter(e.target.value);
        });

        document.getElementById('investmentFilter').addEventListener('change', (e) => {
            this.handleInvestmentFilter(e.target.value);
        });

        // Select all checkbox
        document.getElementById('selectAllLeads').addEventListener('change', (e) => {
            this.handleSelectAll(e.target.checked);
        });

        // Bulk actions
        document.getElementById('exportSelectedCSV').addEventListener('click', () => {
            this.exportSelectedLeads('csv');
        });

        document.getElementById('exportSelectedExcel').addEventListener('click', () => {
            this.exportSelectedLeads('excel');
        });

        document.getElementById('sendToWebhook').addEventListener('click', () => {
            this.showWebhookModal();
        });

        document.getElementById('deselectAll').addEventListener('click', () => {
            this.clearSelection();
        });

        // Export buttons
        document.getElementById('exportCSV').addEventListener('click', () => {
            this.exportData('csv');
        });

        document.getElementById('exportExcel').addEventListener('click', () => {
            this.exportData('excel');
        });

        // Modal close handlers
        document.querySelectorAll('.close-modal, .cancel-edit, .cancel-webhook').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModal('editLeadModal');
                this.closeModal('webhookModal');
            });
        });

        // Integration buttons
        this.setupIntegrationButtons();
        
        // Form handlers
        this.setupEventListenersForForms();
    }

    setupIntegrationButtons() {
        // Get all Configure buttons in integration cards
        const integrationButtons = document.querySelectorAll('.integration-card .btn');
        
        integrationButtons.forEach((button, index) => {
            const card = button.closest('.integration-card');
            const integrationName = card.querySelector('h3').textContent;
            const statusBadge = card.querySelector('.integration-status');
            
            button.addEventListener('click', () => {
                this.handleIntegrationConfig(integrationName, statusBadge, button);
            });
        });
        
        console.log(`✅ Setup ${integrationButtons.length} integration buttons`);
    }

    async handleIntegrationConfig(integrationName, statusBadge, button) {
        console.log(`🔗 Configuring ${integrationName} integration`);
        
        // Show configuration modal based on integration type
        if (integrationName === 'Webhook') {
            this.showWebhookConfigModal();
        } else if (integrationName === 'HubSpot') {
            this.configureHubSpot(statusBadge, button);
        } else if (integrationName === 'Salesforce') {
            this.configureSalesforce(statusBadge, button);
        } else if (integrationName === 'Pipedrive') {
            this.configurePipedrive(statusBadge, button);
        }
    }

    showWebhookConfigModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.id = 'integrationWebhookModal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>🌐 Configure Webhook Integration</h2>
                    <span class="close-modal">&times;</span>
                </div>
                <form id="webhookIntegrationForm">
                    <div class="form-group">
                        <label for="webhookIntegrationURL">Webhook URL</label>
                        <input type="url" id="webhookIntegrationURL" 
                               placeholder="https://hooks.make.com/..." 
                               class="form-control" required>
                        <small>This URL will receive all new leads automatically</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="webhookIntegrationName">Integration Name</label>
                        <input type="text" id="webhookIntegrationName" 
                               placeholder="My Webhook Integration" 
                               class="form-control" required>
                    </div>
                    
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="webhookIntegrationActive" checked>
                            Active (send leads automatically)
                        </label>
                    </div>
                    
                    <div class="info-box">
                        <h4>📋 Webhook Payload Format:</h4>
                        <pre>{
  "id": 123,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "investment": "250-999",
  "status": "new",
  "created_at": "2025-11-13T10:00:00Z"
}</pre>
                    </div>
                    
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary close-integration-modal">Cancel</button>
                        <button type="submit" class="btn btn-primary">
                            <span class="btn-icon">✓</span>
                            Save Integration
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close handlers
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('.close-integration-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        // Form submit
        modal.querySelector('#webhookIntegrationForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.saveWebhookIntegration(modal);
        });
    }

    async saveWebhookIntegration(modal) {
        const url = document.getElementById('webhookIntegrationURL').value;
        const name = document.getElementById('webhookIntegrationName').value;
        const active = document.getElementById('webhookIntegrationActive').checked;
        
        try {
            const response = await fetch(`${this.baseURL}/integrations/webhook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    webhook_url: url,
                    name: name,
                    active: active,
                    type: 'webhook'
                })
            });
            
            if (response.ok) {
                this.showNotification('✅ Webhook integration saved successfully!', 'success');
                modal.remove();
                
                // Update the card status
                const webhookCard = Array.from(document.querySelectorAll('.integration-card'))
                    .find(card => card.querySelector('h3').textContent === 'Webhook');
                    
                if (webhookCard) {
                    const statusBadge = webhookCard.querySelector('.integration-status');
                    statusBadge.textContent = active ? 'Active' : 'Inactive';
                    statusBadge.className = `integration-status ${active ? 'active' : 'inactive'}`;
                }
            } else {
                const error = await response.json();
                this.showNotification('❌ Failed to save integration: ' + error.error, 'error');
            }
        } catch (error) {
            console.error('Error saving webhook integration:', error);
            this.showNotification('❌ Error: ' + error.message, 'error');
        }
    }

    async configureHubSpot(statusBadge, button) {
        const apiKey = prompt('Enter your HubSpot API Key:');
        
        if (apiKey) {
            button.disabled = true;
            button.textContent = 'Connecting...';
            
            try {
                const response = await fetch(`${this.baseURL}/integrations/hubspot`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        api_key: apiKey,
                        active: true,
                        type: 'hubspot'
                    })
                });
                
                if (response.ok) {
                    statusBadge.textContent = 'Active';
                    statusBadge.className = 'integration-status active';
                    button.textContent = 'Reconfigure';
                    this.showNotification('✅ HubSpot connected successfully!', 'success');
                } else {
                    throw new Error('Failed to connect to HubSpot');
                }
            } catch (error) {
                console.error('Error configuring HubSpot:', error);
                this.showNotification('❌ Failed to connect HubSpot', 'error');
                button.textContent = 'Configure';
            } finally {
                button.disabled = false;
            }
        }
    }

    async configureSalesforce(statusBadge, button) {
        this.showNotification('ℹ️ Salesforce integration coming soon! Use Webhook for now.', 'info');
    }

    async configurePipedrive(statusBadge, button) {
        this.showNotification('ℹ️ Pipedrive integration coming soon! Use Webhook for now.', 'info');
    }

    showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.querySelector('.admin-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = `admin-notification admin-notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    setupEventListenersForForms() {
        // Edit lead form
        document.getElementById('editLeadForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEditLead();
        });

        // Webhook form
        document.getElementById('webhookForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSendWebhook();
        });

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }

    setupNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all links and sections
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
                
                // Add active class to clicked link
                e.target.closest('.nav-link').classList.add('active');
                
                // Show corresponding section
                const sectionName = e.target.closest('.nav-link').dataset.section;
                document.getElementById(`${sectionName}Section`).classList.add('active');
                
                // Load section-specific data
                this.loadSectionData(sectionName);
            });
        });
    }

    async handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');

        try {
            console.log('Attempting login to:', `${this.baseURL}/login`);
            const response = await fetch(`${this.baseURL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ username, password })
            });

            console.log('Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Login successful:', data);
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('adminUsername', data.username);
                this.showDashboard();
                this.loadLeads();
                this.loadStatistics();
                errorDiv.textContent = '';
            } else {
                const error = await response.json();
                console.error('Login failed:', error);
                errorDiv.textContent = error.error || 'Login failed';
            }
        } catch (error) {
            console.error('Login error details:', error);
            errorDiv.textContent = 'Connection error. Please check if the backend server is running on port 5000.';
        }
    }

    async handleLogout() {
        try {
            await fetch(`${this.baseURL}/logout`, {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Logout error:', error);
        }

        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminUsername');
        this.showLogin();
    }

    showLogin() {
        document.getElementById('loginModal').style.display = 'flex';
        document.getElementById('dashboard').style.display = 'none';
    }

    showDashboard() {
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('dashboard').style.display = 'grid';
        
        const username = localStorage.getItem('adminUsername');
        document.getElementById('welcomeText').textContent = `Welcome, ${username}`;
    }

    async loadLeads() {
        try {
            const response = await fetch(`${this.baseURL}/leads?page=${this.currentPage}&per_page=${this.leadsPerPage}`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                this.allLeads = data.leads;
                this.filteredLeads = [...this.allLeads];
                this.renderLeadsTable();
                this.renderPagination(data);
            } else {
                console.error('Failed to load leads');
            }
        } catch (error) {
            console.error('Error loading leads:', error);
        }
    }

    async loadStatistics() {
        try {
            // In a real implementation, you'd have dedicated endpoints for statistics
            const response = await fetch(`${this.baseURL}/leads?per_page=1000`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                const leads = data.leads;
                
                const totalLeads = leads.length;
                const newLeads = leads.filter(lead => lead.status === 'new').length;
                const convertedLeads = leads.filter(lead => lead.status === 'converted').length;
                
                const today = new Date().toDateString();
                const todaysLeads = leads.filter(lead => 
                    new Date(lead.created_at).toDateString() === today
                ).length;

                document.getElementById('totalLeads').textContent = totalLeads;
                document.getElementById('newLeads').textContent = newLeads;
                document.getElementById('convertedLeads').textContent = convertedLeads;
                document.getElementById('todaysLeads').textContent = todaysLeads;
            }
        } catch (error) {
            console.error('Error loading statistics:', error);
        }
    }

    renderLeadsTable() {
        const tbody = document.getElementById('leadsTableBody');
        tbody.innerHTML = '';

        if (this.filteredLeads.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="11" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        No leads found
                    </td>
                </tr>
            `;
            return;
        }

        this.filteredLeads.forEach(lead => {
            const row = document.createElement('tr');
            const isSelected = this.selectedLeadIds.has(lead.id);
            
            // Parse notes to extract additional information
            const notes = lead.notes || '';
            const notesInfo = this.parseLeadNotes(notes);
            
            // Create tooltip with full details
            const detailsTooltip = this.buildLeadDetailsTooltip(lead, notesInfo);
            
            row.innerHTML = `
                <td><input type="checkbox" class="lead-checkbox" data-lead-id="${lead.id}" ${isSelected ? 'checked' : ''}></td>
                <td>#${lead.id}</td>
                <td>
                    <div style="line-height: 1.4;">
                        <strong>${lead.first_name} ${lead.last_name}</strong>
                        ${notesInfo.country ? `<br><small style="color: var(--text-muted);">🌍 ${notesInfo.country}</small>` : ''}
                    </div>
                </td>
                <td>${lead.email}</td>
                <td>${lead.phone}</td>
                <td>${lead.investment}</td>
                <td><span class="status-badge status-${lead.status}">${lead.status}</span></td>
                <td>
                    <div style="line-height: 1.4;">
                        <span>${this.formatSource(lead.source)}</span>
                        ${notesInfo.hasDeposit ? `<br><small style="color: ${notesInfo.hasDeposit === 'yes' ? '#10b981' : '#f59e0b'};">💰 ${notesInfo.hasDeposit === 'yes' ? 'Has $250+' : 'No deposit yet'}</small>` : ''}
                    </div>
                </td>
                <td title="${detailsTooltip}">
                    ${this.formatDateShort(lead.created_at)}
                    ${notesInfo.experience ? `<br><small style="color: var(--text-muted);">📊 ${notesInfo.experience}</small>` : ''}
                </td>
                <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis;" title="${notes}">
                    ${this.truncateText(notes, 50)}
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view-btn" onclick="adminDashboard.viewLead(${lead.id})" title="View Details">
                            👁️
                        </button>
                        <button class="action-btn edit-btn" onclick="adminDashboard.editLead(${lead.id})" title="Edit Lead">
                            ✏️
                        </button>
                        <button class="action-btn delete-btn" onclick="adminDashboard.deleteLead(${lead.id})" title="Delete Lead">
                            🗑️
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Add event listeners to checkboxes
        document.querySelectorAll('.lead-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handleLeadSelection(parseInt(e.target.dataset.leadId), e.target.checked);
            });
        });

        this.updateBulkActionsBar();
    }

    parseLeadNotes(notes) {
        const info = {
            country: null,
            hasDeposit: null,
            callTime: null,
            experience: null,
            message: null
        };

        if (!notes) return info;

        // Parse structured notes
        const countryMatch = notes.match(/Country:\s*([^,]+)/i);
        const depositMatch = notes.match(/Has Deposit:\s*([^,]+)/i);
        const callTimeMatch = notes.match(/Call Time:\s*([^,]+)/i);
        const experienceMatch = notes.match(/Experience:\s*([^,]+)/i);
        const messageMatch = notes.match(/Message:\s*(.+?)(?:,|$)/i);

        if (countryMatch) info.country = countryMatch[1].trim();
        if (depositMatch) info.hasDeposit = depositMatch[1].trim().toLowerCase();
        if (callTimeMatch) info.callTime = callTimeMatch[1].trim();
        if (experienceMatch) info.experience = experienceMatch[1].trim();
        if (messageMatch) info.message = messageMatch[1].trim();

        return info;
    }

    buildLeadDetailsTooltip(lead, notesInfo) {
        let tooltip = `Created: ${this.formatDate(lead.created_at)}\n`;
        tooltip += `Updated: ${this.formatDate(lead.updated_at)}\n`;
        
        if (notesInfo.country) tooltip += `\nCountry: ${notesInfo.country}`;
        if (notesInfo.hasDeposit) tooltip += `\nDeposit Available: ${notesInfo.hasDeposit}`;
        if (notesInfo.callTime) tooltip += `\nPreferred Call Time: ${notesInfo.callTime}`;
        if (notesInfo.experience) tooltip += `\nTrading Experience: ${notesInfo.experience}`;
        if (notesInfo.message) tooltip += `\n\nMessage: ${notesInfo.message}`;
        
        return tooltip;
    }

    formatSource(source) {
        const sourceMap = {
            'website': 'Landing Page',
            'education-page-contact-form': 'Education Page',
            'page2-lead-capture': 'Funnel Page 2',
            'page1-landing': 'Funnel Page 1'
        };
        return sourceMap[source] || source;
    }

    truncateText(text, maxLength) {
        if (!text) return '-';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    viewLead(leadId) {
        const lead = this.allLeads.find(l => l.id === leadId);
        if (!lead) return;

        const notesInfo = this.parseLeadNotes(lead.notes);

        const modalContent = `
            <div class="modal" id="viewLeadModal" style="display: flex;">
                <div class="modal-content" style="max-width: 600px;">
                    <span class="close-modal" onclick="adminDashboard.closeModal('viewLeadModal')">&times;</span>
                    <h2>Lead Details - #${lead.id}</h2>
                    
                    <div style="margin-top: 2rem;">
                        <div style="display: grid; gap: 1.5rem;">
                            <div>
                                <h3 style="color: var(--primary-color); margin-bottom: 0.5rem; font-size: 1rem;">Personal Information</h3>
                                <div style="background: var(--dark-secondary); padding: 1rem; border-radius: 8px;">
                                    <p><strong>Name:</strong> ${lead.first_name} ${lead.last_name}</p>
                                    <p><strong>Email:</strong> <a href="mailto:${lead.email}" style="color: var(--primary-color);">${lead.email}</a></p>
                                    <p><strong>Phone:</strong> <a href="tel:${lead.phone}" style="color: var(--primary-color);">${lead.phone}</a></p>
                                    ${notesInfo.country ? `<p><strong>Country:</strong> ${notesInfo.country}</p>` : ''}
                                </div>
                            </div>

                            <div>
                                <h3 style="color: var(--primary-color); margin-bottom: 0.5rem; font-size: 1rem;">Trading Information</h3>
                                <div style="background: var(--dark-secondary); padding: 1rem; border-radius: 8px;">
                                    <p><strong>Investment Amount:</strong> ${lead.investment}</p>
                                    ${notesInfo.experience ? `<p><strong>Experience Level:</strong> ${notesInfo.experience}</p>` : ''}
                                    ${notesInfo.hasDeposit ? `<p><strong>Has $250 Deposit:</strong> <span style="color: ${notesInfo.hasDeposit === 'yes' ? '#10b981' : '#f59e0b'};">${notesInfo.hasDeposit === 'yes' ? 'Yes ✓' : 'No ✗'}</span></p>` : ''}
                                    ${notesInfo.callTime ? `<p><strong>Preferred Call Time:</strong> ${notesInfo.callTime}</p>` : ''}
                                </div>
                            </div>

                            <div>
                                <h3 style="color: var(--primary-color); margin-bottom: 0.5rem; font-size: 1rem;">Lead Status</h3>
                                <div style="background: var(--dark-secondary); padding: 1rem; border-radius: 8px;">
                                    <p><strong>Status:</strong> <span class="status-badge status-${lead.status}">${lead.status}</span></p>
                                    <p><strong>Source:</strong> ${this.formatSource(lead.source)}</p>
                                    <p><strong>Created:</strong> ${this.formatDate(lead.created_at)}</p>
                                    <p><strong>Last Updated:</strong> ${this.formatDate(lead.updated_at)}</p>
                                </div>
                            </div>

                            ${notesInfo.message ? `
                            <div>
                                <h3 style="color: var(--primary-color); margin-bottom: 0.5rem; font-size: 1rem;">Message/Notes</h3>
                                <div style="background: var(--dark-secondary); padding: 1rem; border-radius: 8px;">
                                    <p style="white-space: pre-wrap; line-height: 1.6;">${notesInfo.message}</p>
                                </div>
                            </div>
                            ` : ''}

                            ${lead.notes ? `
                            <div>
                                <h3 style="color: var(--primary-color); margin-bottom: 0.5rem; font-size: 1rem;">Full Notes</h3>
                                <div style="background: var(--dark-secondary); padding: 1rem; border-radius: 8px;">
                                    <p style="white-space: pre-wrap; line-height: 1.6; font-size: 0.9rem; color: var(--text-secondary);">${lead.notes}</p>
                                </div>
                            </div>
                            ` : ''}
                        </div>

                        <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: flex-end;">
                            <button onclick="adminDashboard.editLead(${lead.id}); adminDashboard.closeModal('viewLeadModal');" class="btn btn-primary">
                                ✏️ Edit Lead
                            </button>
                            <button onclick="adminDashboard.closeModal('viewLeadModal')" class="btn btn-secondary">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('viewLeadModal');
        if (existingModal) existingModal.remove();

        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalContent);
    }

    renderPagination(data) {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';

        if (data.total_pages <= 1) return;

        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'pagination-btn';
        prevBtn.textContent = '← Previous';
        prevBtn.disabled = this.currentPage === 1;
        prevBtn.onclick = () => this.changePage(this.currentPage - 1);
        pagination.appendChild(prevBtn);

        // Page numbers
        for (let i = 1; i <= data.total_pages; i++) {
            if (i === this.currentPage || 
                i === 1 || 
                i === data.total_pages || 
                (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                
                const pageBtn = document.createElement('button');
                pageBtn.className = `pagination-btn ${i === this.currentPage ? 'active' : ''}`;
                pageBtn.textContent = i;
                pageBtn.onclick = () => this.changePage(i);
                pagination.appendChild(pageBtn);
            } else if ((i === this.currentPage - 3 && i > 1) || 
                       (i === this.currentPage + 3 && i < data.total_pages)) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.style.color = 'var(--text-muted)';
                ellipsis.style.padding = '0 0.5rem';
                pagination.appendChild(ellipsis);
            }
        }

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn';
        nextBtn.textContent = 'Next →';
        nextBtn.disabled = this.currentPage === data.total_pages;
        nextBtn.onclick = () => this.changePage(this.currentPage + 1);
        pagination.appendChild(nextBtn);
    }

    changePage(page) {
        this.currentPage = page;
        this.loadLeads();
    }

    handleSearch(searchTerm) {
        const term = searchTerm.toLowerCase();
        this.filteredLeads = this.allLeads.filter(lead => 
            lead.first_name.toLowerCase().includes(term) ||
            lead.last_name.toLowerCase().includes(term) ||
            lead.email.toLowerCase().includes(term) ||
            lead.phone.includes(term)
        );
        this.renderLeadsTable();
    }

    handleStatusFilter(status) {
        if (status === '') {
            this.filteredLeads = [...this.allLeads];
        } else {
            this.filteredLeads = this.allLeads.filter(lead => lead.status === status);
        }
        this.renderLeadsTable();
    }

    handleInvestmentFilter(investment) {
        if (investment === '') {
            this.filteredLeads = [...this.allLeads];
        } else {
            this.filteredLeads = this.allLeads.filter(lead => lead.investment === investment);
        }
        this.renderLeadsTable();
    }

    editLead(leadId) {
        const lead = this.allLeads.find(l => l.id === leadId);
        if (!lead) return;

        // Populate the edit form
        document.getElementById('editLeadId').value = lead.id;
        document.getElementById('editFirstName').value = lead.first_name;
        document.getElementById('editLastName').value = lead.last_name;
        document.getElementById('editEmail').value = lead.email;
        document.getElementById('editPhone').value = lead.phone;
        document.getElementById('editInvestment').value = lead.investment;
        document.getElementById('editStatus').value = lead.status;
        document.getElementById('editNotes').value = lead.notes || '';

        // Show the modal
        this.showModal('editLeadModal');
    }

    async handleEditLead() {
        const leadId = document.getElementById('editLeadId').value;
        const leadData = {
            first_name: document.getElementById('editFirstName').value,
            last_name: document.getElementById('editLastName').value,
            email: document.getElementById('editEmail').value,
            phone: document.getElementById('editPhone').value,
            investment: document.getElementById('editInvestment').value,
            status: document.getElementById('editStatus').value,
            notes: document.getElementById('editNotes').value
        };

        try {
            const response = await fetch(`${this.baseURL}/leads/${leadId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(leadData)
            });

            if (response.ok) {
                this.closeModal('editLeadModal');
                this.loadLeads();
                this.showNotification('Lead updated successfully', 'success');
            } else {
                const error = await response.json();
                this.showNotification(error.error || 'Failed to update lead', 'error');
            }
        } catch (error) {
            this.showNotification('Connection error. Please try again.', 'error');
            console.error('Edit lead error:', error);
        }
    }

    async deleteLead(leadId) {
        if (!confirm('Are you sure you want to delete this lead?')) return;

        try {
            const response = await fetch(`${this.baseURL}/leads/${leadId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                this.loadLeads();
                this.loadStatistics();
                this.showNotification('Lead deleted successfully', 'success');
            } else {
                const error = await response.json();
                this.showNotification(error.error || 'Failed to delete lead', 'error');
            }
        } catch (error) {
            this.showNotification('Connection error. Please try again.', 'error');
            console.error('Delete lead error:', error);
        }
    }

    async exportData(format) {
        try {
            const response = await fetch(`${this.baseURL}/export/${format}`, {
                credentials: 'include'
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `leads_export_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'csv'}`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
                this.showNotification(`${format.toUpperCase()} export completed`, 'success');
            } else {
                this.showNotification(`Failed to export ${format.toUpperCase()}`, 'error');
            }
        } catch (error) {
            this.showNotification('Connection error. Please try again.', 'error');
            console.error('Export error:', error);
        }
    }

    loadSectionData(sectionName) {
        switch (sectionName) {
            case 'leads':
                this.loadLeads();
                break;
            case 'integrations':
                this.loadIntegrations();
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
        }
    }

    async loadIntegrations() {
        try {
            const response = await fetch(`${this.baseURL}/integrations`, {
                credentials: 'include'
            });

            if (response.ok) {
                const integrations = await response.json();
                this.renderIntegrations(integrations);
            }
        } catch (error) {
            console.error('Error loading integrations:', error);
        }
    }

    renderIntegrations(integrations) {
        // Update integration status indicators
        integrations.forEach(integration => {
            const card = document.querySelector(`[data-integration="${integration.name}"]`);
            if (card) {
                const statusElement = card.querySelector('.integration-status');
                statusElement.textContent = integration.is_active ? 'Active' : 'Inactive';
                statusElement.className = `integration-status ${integration.is_active ? 'active' : 'inactive'}`;
            }
        });
    }

    loadAnalytics() {
        // Placeholder for analytics functionality
        // In a real implementation, you'd load chart data and render charts
        console.log('Loading analytics...');
    }

    showModal(modalId) {
        document.getElementById(modalId).style.display = 'flex';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles for notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--error)' : 'var(--primary-color)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }

    handleSelectAll(checked) {
        if (checked) {
            this.filteredLeads.forEach(lead => this.selectedLeadIds.add(lead.id));
        } else {
            this.selectedLeadIds.clear();
        }
        this.renderLeadsTable();
    }

    handleLeadSelection(leadId, checked) {
        if (checked) {
            this.selectedLeadIds.add(leadId);
        } else {
            this.selectedLeadIds.delete(leadId);
        }
        this.updateBulkActionsBar();
    }

    updateBulkActionsBar() {
        const bulkActionsBar = document.getElementById('bulkActionsBar');
        const selectedCount = document.getElementById('selectedCount');
        const selectAllCheckbox = document.getElementById('selectAllLeads');

        if (this.selectedLeadIds.size > 0) {
            bulkActionsBar.style.display = 'flex';
            selectedCount.textContent = this.selectedLeadIds.size;
        } else {
            bulkActionsBar.style.display = 'none';
        }

        // Update select all checkbox state
        const allSelected = this.filteredLeads.length > 0 && 
                           this.filteredLeads.every(lead => this.selectedLeadIds.has(lead.id));
        selectAllCheckbox.checked = allSelected;
    }

    clearSelection() {
        this.selectedLeadIds.clear();
        this.renderLeadsTable();
    }

    async exportSelectedLeads(format) {
        if (this.selectedLeadIds.size === 0) {
            this.showNotification('Please select leads to export', 'error');
            return;
        }

        try {
            const response = await fetch(`${this.baseURL}/export/${format}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    lead_ids: Array.from(this.selectedLeadIds)
                })
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `leads_export_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'csv'}`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
                this.showNotification(`Exported ${this.selectedLeadIds.size} leads to ${format.toUpperCase()}`, 'success');
            } else {
                this.showNotification(`Failed to export ${format.toUpperCase()}`, 'error');
            }
        } catch (error) {
            this.showNotification('Connection error. Please try again.', 'error');
            console.error('Export error:', error);
        }
    }

    showWebhookModal() {
        if (this.selectedLeadIds.size === 0) {
            this.showNotification('Please select leads to send', 'error');
            return;
        }

        document.getElementById('webhookLeadCount').textContent = this.selectedLeadIds.size;
        this.showModal('webhookModal');
    }

    async handleSendWebhook() {
        const webhookURL = document.getElementById('webhookURL').value.trim();

        if (!webhookURL) {
            this.showNotification('Please enter a webhook URL', 'error');
            return;
        }

        if (this.selectedLeadIds.size === 0) {
            this.showNotification('No leads selected', 'error');
            return;
        }

        try {
            const response = await fetch(`${this.baseURL}/leads/send-webhook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    webhook_url: webhookURL,
                    lead_ids: Array.from(this.selectedLeadIds)
                })
            });

            if (response.ok) {
                const result = await response.json();
                this.closeModal('webhookModal');
                this.showNotification(result.message, 'success');
                document.getElementById('webhookURL').value = '';
            } else {
                const error = await response.json();
                this.showNotification(error.error || 'Failed to send webhook', 'error');
            }
        } catch (error) {
            this.showNotification('Connection error. Please try again.', 'error');
            console.error('Webhook error:', error);
        }
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }

    formatDateShort(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
    }
`;
document.head.appendChild(style);

// Initialize the admin dashboard
const adminDashboard = new AdminDashboard();