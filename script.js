// Datos de la aplicación
let appointments = JSON.parse(localStorage.getItem('peludos_appointments')) || [];
let patients = JSON.parse(localStorage.getItem('peludos_patients')) || [];
let medicalHistory = JSON.parse(localStorage.getItem('peludos_history')) || [];

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadSampleData();
    updateDashboard();
    renderAppointments();
    renderPatients();
    renderMedicalHistory();
    setupEventListeners();
});

// Inicializar la aplicación
function initializeApp() {
    // Establecer fecha mínima para citas (hoy)
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('appointmentDate').min = today;
    
    // Cargar pacientes en el select
    updatePatientSelect();
}

// Cargar datos de ejemplo
function loadSampleData() {
    if (patients.length === 0) {
        patients = [
            {
                id: 1,
                petName: "Luna",
                petSpecies: "dog",
                petBreed: "Golden Retriever",
                petAge: 3,
                petColor: "Dorado",
                ownerName: "María González",
                ownerPhone: "300-123-4567",
                ownerEmail: "maria@email.com",
                ownerAddress: "Calle 123 #45-67, Bogotá",
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                petName: "Mittens",
                petSpecies: "cat",
                petBreed: "Siamés",
                petAge: 2,
                petColor: "Blanco y negro",
                ownerName: "Carlos Rodríguez",
                ownerPhone: "310-987-6543",
                ownerEmail: "carlos@email.com",
                ownerAddress: "Carrera 78 #12-34, Medellín",
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                petName: "Rocky",
                petSpecies: "dog",
                petBreed: "Bulldog Francés",
                petAge: 1.5,
                petColor: "Gris",
                ownerName: "Ana Martínez",
                ownerPhone: "315-555-1234",
                ownerEmail: "ana@email.com",
                ownerAddress: "Avenida 5 #23-45, Cali",
                createdAt: new Date().toISOString()
            }
        ];
        savePatients();
    }

    if (appointments.length === 0) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        appointments = [
            {
                id: 1,
                patientId: 1,
                date: today.toISOString().split('T')[0],
                time: "09:00",
                type: "checkup",
                notes: "Revisión anual de rutina",
                status: "confirmed",
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                patientId: 2,
                date: tomorrow.toISOString().split('T')[0],
                time: "14:30",
                type: "vaccination",
                notes: "Vacuna triple felina",
                status: "pending",
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                patientId: 3,
                date: today.toISOString().split('T')[0],
                time: "16:00",
                type: "emergency",
                notes: "Dolor en la pata trasera",
                status: "confirmed",
                createdAt: new Date().toISOString()
            }
        ];
        saveAppointments();
    }

    if (medicalHistory.length === 0) {
        medicalHistory = [
            {
                id: 1,
                patientId: 1,
                date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                type: "checkup",
                diagnosis: "Saludable",
                treatment: "Vacuna anual aplicada",
                notes: "Paciente en excelente estado",
                veterinarian: "Dr. García"
            },
            {
                id: 2,
                patientId: 2,
                date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                type: "emergency",
                diagnosis: "Infección respiratoria",
                treatment: "Antibióticos por 7 días",
                notes: "Mejorar ventilación en casa",
                veterinarian: "Dra. López"
            }
        ];
        saveMedicalHistory();
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Formularios
    document.getElementById('appointmentForm').addEventListener('submit', handleAppointmentSubmit);
    document.getElementById('patientForm').addEventListener('submit', handlePatientSubmit);
    
    // Búsqueda y filtros
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.getElementById('filterStatus').addEventListener('change', handleFilter);
    document.getElementById('filterDate').addEventListener('change', handleFilter);
    
    // Cerrar modales al hacer clic fuera
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('active');
        }
    });
}

// Funciones de navegación
function showTab(tabName) {
    // Ocultar todas las pestañas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar pestaña seleccionada
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
}

function setView(viewType) {
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Aquí se podría implementar vista de calendario
    if (viewType === 'calendar') {
        showToast('Vista de calendario próximamente', 'info');
    }
}

// Funciones de modal
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    if (modalId === 'appointmentModal') {
        updatePatientSelect();
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.getElementById(modalId).querySelector('form')?.reset();
}

// Manejo de formularios
function handleAppointmentSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const appointment = {
        id: Date.now(),
        patientId: parseInt(formData.get('patientSelect')),
        date: formData.get('appointmentDate'),
        time: formData.get('appointmentTime'),
        type: formData.get('appointmentType'),
        notes: formData.get('appointmentNotes'),
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    appointments.push(appointment);
    saveAppointments();
    
    closeModal('appointmentModal');
    updateDashboard();
    renderAppointments();
    showToast('Cita creada exitosamente', 'success');
}

function handlePatientSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const patient = {
        id: Date.now(),
        petName: formData.get('petName'),
        petSpecies: formData.get('petSpecies'),
        petBreed: formData.get('petBreed'),
        petAge: parseFloat(formData.get('petAge')) || 0,
        petColor: formData.get('petColor'),
        ownerName: formData.get('ownerName'),
        ownerPhone: formData.get('ownerPhone'),
        ownerEmail: formData.get('ownerEmail'),
        ownerAddress: formData.get('ownerAddress'),
        createdAt: new Date().toISOString()
    };
    
    patients.push(patient);
    savePatients();
    
    closeModal('patientModal');
    updateDashboard();
    renderPatients();
    updatePatientSelect();
    showToast('Paciente registrado exitosamente', 'success');
}

// Funciones de renderizado
function renderAppointments() {
    const container = document.getElementById('appointmentsList');
    const filteredAppointments = getFilteredAppointments();
    
    if (filteredAppointments.length === 0) {
        container.innerHTML = '<div class="empty-state">No hay citas programadas</div>';
        return;
    }
    
    container.innerHTML = filteredAppointments.map(appointment => {
        const patient = patients.find(p => p.id === appointment.patientId);
        const appointmentTypeText = getAppointmentTypeText(appointment.type);
        const statusText = getStatusText(appointment.status);
        
        return `
            <div class="appointment-card">
                <div class="appointment-header">
                    <div class="appointment-info">
                        <h3>${patient ? patient.petName : 'Paciente no encontrado'}</h3>
                        <p>${patient ? patient.ownerName : ''}</p>
                    </div>
                    <span class="appointment-status status-${appointment.status}">${statusText}</span>
                </div>
                <div class="appointment-details">
                    <div class="detail-item">
                        <i class="fas fa-calendar"></i>
                        <span>${formatDate(appointment.date)}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>${appointment.time}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-stethoscope"></i>
                        <span>${appointmentTypeText}</span>
                    </div>
                </div>
                ${appointment.notes ? `<p style="color: #666; margin-bottom: 15px;">${appointment.notes}</p>` : ''}
                <div class="appointment-actions">
                    <button class="action-btn" onclick="editAppointment(${appointment.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" onclick="changeAppointmentStatus(${appointment.id})" title="Cambiar estado">
                        <i class="fas fa-exchange-alt"></i>
                    </button>
                    <button class="action-btn" onclick="deleteAppointment(${appointment.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function renderPatients() {
    const container = document.getElementById('patientsList');
    const filteredPatients = getFilteredPatients();
    
    if (filteredPatients.length === 0) {
        container.innerHTML = '<div class="empty-state">No hay pacientes registrados</div>';
        return;
    }
    
    container.innerHTML = filteredPatients.map(patient => {
        const speciesText = getSpeciesText(patient.petSpecies);
        const patientAppointments = appointments.filter(a => a.patientId === patient.id);
        
        return `
            <div class="patient-card">
                <div class="patient-header">
                    <div class="patient-avatar">
                        ${patient.petName.charAt(0).toUpperCase()}
                    </div>
                    <div class="patient-info">
                        <h3>${patient.petName}</h3>
                        <p>${speciesText} • ${patient.petBreed || 'Sin raza especificada'}</p>
                    </div>
                </div>
                <div class="patient-details">
                    <div class="patient-detail">
                        <i class="fas fa-user"></i>
                        <span>${patient.ownerName}</span>
                    </div>
                    <div class="patient-detail">
                        <i class="fas fa-phone"></i>
                        <span>${patient.ownerPhone}</span>
                    </div>
                    <div class="patient-detail">
                        <i class="fas fa-birthday-cake"></i>
                        <span>${patient.petAge} años</span>
                    </div>
                    <div class="patient-detail">
                        <i class="fas fa-calendar"></i>
                        <span>${patientAppointments.length} citas</span>
                    </div>
                </div>
                <div class="patient-actions">
                    <button class="btn btn-secondary" onclick="viewMedicalHistory(${patient.id})">
                        <i class="fas fa-history"></i> Historial
                    </button>
                    <button class="btn btn-primary" onclick="scheduleAppointment(${patient.id})">
                        <i class="fas fa-plus"></i> Cita
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function renderMedicalHistory() {
    const container = document.getElementById('historyList');
    
    if (medicalHistory.length === 0) {
        container.innerHTML = '<div class="empty-state">No hay historial médico registrado</div>';
        return;
    }
    
    container.innerHTML = medicalHistory.map(record => {
        const patient = patients.find(p => p.id === record.patientId);
        const typeText = getAppointmentTypeText(record.type);
        
        return `
            <div class="history-item">
                <div class="history-header">
                    <span class="history-date">${formatDate(record.date)}</span>
                    <span class="history-type">${typeText}</span>
                </div>
                <div class="history-content">
                    <p><strong>Paciente:</strong> ${patient ? patient.petName : 'No encontrado'}</p>
                    <p><strong>Diagnóstico:</strong> ${record.diagnosis}</p>
                    <p><strong>Tratamiento:</strong> ${record.treatment}</p>
                    ${record.notes ? `<p><strong>Notas:</strong> ${record.notes}</p>` : ''}
                    <p><strong>Veterinario:</strong> ${record.veterinarian}</p>
                </div>
            </div>
        `;
    }).join('');
}

// Funciones de utilidad
function updateDashboard() {
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(a => a.date === today);
    const pendingAppointments = appointments.filter(a => a.status === 'pending');
    const reminders = appointments.filter(a => {
        const appointmentDate = new Date(a.date);
        const today = new Date();
        const diffTime = appointmentDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 2 && diffDays >= 0 && a.status !== 'completed';
    });
    
    document.getElementById('todayAppointments').textContent = todayAppointments.length;
    document.getElementById('totalPatients').textContent = patients.length;
    document.getElementById('pendingAppointments').textContent = pendingAppointments.length;
    document.getElementById('reminders').textContent = reminders.length;
}

function updatePatientSelect() {
    const select = document.getElementById('patientSelect');
    select.innerHTML = '<option value="">Seleccionar paciente</option>';
    
    patients.forEach(patient => {
        const option = document.createElement('option');
        option.value = patient.id;
        option.textContent = `${patient.petName} (${patient.ownerName})`;
        select.appendChild(option);
    });
}

function getFilteredAppointments() {
    let filtered = [...appointments];
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('filterStatus').value;
    const dateFilter = document.getElementById('filterDate').value;
    
    if (searchTerm) {
        filtered = filtered.filter(appointment => {
            const patient = patients.find(p => p.id === appointment.patientId);
            return patient && (
                patient.petName.toLowerCase().includes(searchTerm) ||
                patient.ownerName.toLowerCase().includes(searchTerm)
            );
        });
    }
    
    if (statusFilter) {
        filtered = filtered.filter(appointment => appointment.status === statusFilter);
    }
    
    if (dateFilter) {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        filtered = filtered.filter(appointment => {
            const appointmentDate = new Date(appointment.date);
            switch (dateFilter) {
                case 'today':
                    return appointment.date === today.toISOString().split('T')[0];
                case 'week':
                    return appointmentDate >= startOfWeek;
                case 'month':
                    return appointmentDate >= startOfMonth;
                default:
                    return true;
            }
        });
    }
    
    return filtered.sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));
}

function getFilteredPatients() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (!searchTerm) return patients;
    
    return patients.filter(patient => 
        patient.petName.toLowerCase().includes(searchTerm) ||
        patient.ownerName.toLowerCase().includes(searchTerm) ||
        patient.ownerPhone.includes(searchTerm)
    );
}

// Funciones de acción
function editAppointment(appointmentId) {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (!appointment) return;
    
    // Aquí se implementaría la edición
    showToast('Función de edición próximamente', 'info');
}

function changeAppointmentStatus(appointmentId) {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (!appointment) return;
    
    const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    const currentIndex = statuses.indexOf(appointment.status);
    const nextIndex = (currentIndex + 1) % statuses.length;
    appointment.status = statuses[nextIndex];
    
    saveAppointments();
    renderAppointments();
    updateDashboard();
    showToast(`Estado cambiado a: ${getStatusText(appointment.status)}`, 'success');
}

function deleteAppointment(appointmentId) {
    if (confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
        appointments = appointments.filter(a => a.id !== appointmentId);
        saveAppointments();
        renderAppointments();
        updateDashboard();
        showToast('Cita eliminada exitosamente', 'success');
    }
}

function viewMedicalHistory(patientId) {
    const patient = patients.find(p => p.id === patientId);
    const patientHistory = medicalHistory.filter(h => h.patientId === patientId);
    
    const content = document.getElementById('historyContent');
    content.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3>Historial de ${patient.petName}</h3>
            <p><strong>Propietario:</strong> ${patient.ownerName}</p>
        </div>
        ${patientHistory.length === 0 ? 
            '<p>No hay historial médico registrado para este paciente.</p>' :
            patientHistory.map(record => `
                <div style="border: 1px solid #f0f0f0; border-radius: 12px; padding: 15px; margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <strong>${formatDate(record.date)}</strong>
                        <span style="background: #d4edda; color: #155724; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem;">
                            ${getAppointmentTypeText(record.type)}
                        </span>
                    </div>
                    <p><strong>Diagnóstico:</strong> ${record.diagnosis}</p>
                    <p><strong>Tratamiento:</strong> ${record.treatment}</p>
                    ${record.notes ? `<p><strong>Notas:</strong> ${record.notes}</p>` : ''}
                    <p><strong>Veterinario:</strong> ${record.veterinarian}</p>
                </div>
            `).join('')
        }
        <button class="btn btn-primary" onclick="addMedicalRecord(${patientId})">
            <i class="fas fa-plus"></i> Agregar Registro
        </button>
    `;
    
    openModal('historyModal');
}

function scheduleAppointment(patientId) {
    document.getElementById('patientSelect').value = patientId;
    openModal('appointmentModal');
}

function addMedicalRecord(patientId) {
    // Aquí se implementaría la adición de registros médicos
    showToast('Función de agregar registro médico próximamente', 'info');
}

// Funciones de búsqueda y filtros
function handleSearch() {
    renderAppointments();
    renderPatients();
}

function handleFilter() {
    renderAppointments();
}

// Funciones de almacenamiento
function saveAppointments() {
    localStorage.setItem('peludos_appointments', JSON.stringify(appointments));
}

function savePatients() {
    localStorage.setItem('peludos_patients', JSON.stringify(patients));
}

function saveMedicalHistory() {
    localStorage.setItem('peludos_history', JSON.stringify(medicalHistory));
}

// Funciones de utilidad de texto
function getAppointmentTypeText(type) {
    const types = {
        'checkup': 'Revisión General',
        'vaccination': 'Vacunación',
        'emergency': 'Emergencia',
        'surgery': 'Cirugía',
        'followup': 'Seguimiento'
    };
    return types[type] || type;
}

function getStatusText(status) {
    const statuses = {
        'pending': 'Pendiente',
        'confirmed': 'Confirmada',
        'completed': 'Completada',
        'cancelled': 'Cancelada'
    };
    return statuses[status] || status;
}

function getSpeciesText(species) {
    const speciesMap = {
        'dog': 'Perro',
        'cat': 'Gato',
        'bird': 'Ave',
        'other': 'Otro'
    };
    return speciesMap[species] || species;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

// Sistema de notificaciones
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Verificar recordatorios automáticamente
setInterval(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const tomorrowAppointments = appointments.filter(a => 
        a.date === tomorrow.toISOString().split('T')[0] && 
        a.status !== 'completed' && 
        a.status !== 'cancelled'
    );
    
    if (tomorrowAppointments.length > 0) {
        showToast(`Tienes ${tomorrowAppointments.length} cita(s) mañana`, 'info');
    }
}, 60000); // Verificar cada minuto 