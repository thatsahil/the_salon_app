import React, { useState, useEffect, useCallback } from 'react';
import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './pages/Dashboard';
import { Clients } from './pages/Clients';
import { Reports } from './pages/Reports';
import { ClientForm } from './components/clients/ClientForm';
import { VisitForm } from './components/clients/VisitForm';
import { ClientProfileModal } from './components/clients/ClientProfileModal';
import { AuthScreen } from './components/auth/AuthScreen';
import { LoadingState } from './components/common/LoadingState';
import { api } from './services/api';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal States
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState(null);
  const [isVisitFormOpen, setIsVisitFormOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // Notification Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Check auth session on startup
  useEffect(() => {
    async function verifyAuth() {
      const token = localStorage.getItem('salon_jwt_token');
      if (!token) {
        setAuthChecking(false);
        return;
      }

      try {
        const res = await api.getMe();
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          localStorage.removeItem('salon_jwt_token');
        }
      } catch (err) {
        localStorage.removeItem('salon_jwt_token');
      } finally {
        setAuthChecking(false);
      }
    }

    verifyAuth();
  }, []);

  const loadInitialData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [dashRes, clientRes, srvRes] = await Promise.all([
        api.getDashboard(),
        api.getClients(searchQuery),
        api.getServices(),
      ]);

      if (dashRes.success) setDashboardData(dashRes.data);
      if (clientRes.success) setClients(clientRes.data);
      if (srvRes.success) setServices(srvRes.data);
    } catch (err) {
      console.error('Data loading error:', err);
    } finally {
      setLoading(false);
    }
  }, [user, searchQuery]);

  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user, loadInitialData]);

  // Handle Client Search
  useEffect(() => {
    if (!user) return;
    const handler = setTimeout(async () => {
      try {
        const res = await api.getClients(searchQuery);
        if (res.success) setClients(res.data);
      } catch (err) {
        console.error(err);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery, user]);

  // Open Profile Modal with details & visit history
  const handleSelectClient = async (client) => {
    try {
      const res = await api.getClientById(client._id);
      if (res.success) {
        setSelectedClient(res.data);
      } else {
        setSelectedClient(client);
      }
    } catch (err) {
      setSelectedClient(client);
    }
    setIsProfileModalOpen(true);
  };

  // Open Add Client
  const handleOpenAddClient = () => {
    setClientToEdit(null);
    setIsClientFormOpen(true);
  };

  // Open Edit Client
  const handleOpenEditClient = (client) => {
    setClientToEdit(client);
    setIsProfileModalOpen(false);
    setIsClientFormOpen(true);
  };

  // Save Client (Add or Edit)
  const handleSaveClient = async (clientData) => {
    try {
      if (clientToEdit) {
        const res = await api.updateClient(clientToEdit._id, clientData);
        if (res.success) {
          showToast(`Updated client ${res.data.name}`);
          loadInitialData();
        }
      } else {
        const res = await api.createClient(clientData);
        if (res.success) {
          if (res.isExisting) {
            showToast(`Client already exists! Opened existing record for ${res.data.name}`, 'info');
          } else {
            showToast(`Added new client ${res.data.name}`);
          }
          loadInitialData();
        }
      }
    } catch (err) {
      showToast(err.message || 'Failed to save client', 'error');
    }
  };

  // Delete Client
  const handleDeleteClient = async (client) => {
    try {
      const res = await api.deleteClient(client._id);
      if (res.success) {
        showToast(`Deleted client ${client.name}`);
        setIsProfileModalOpen(false);
        setSelectedClient(null);
        loadInitialData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete client', 'error');
    }
  };

  // Open Visit Form
  const handleOpenVisitForm = (client = null) => {
    setSelectedClient(client);
    setIsProfileModalOpen(false);
    setIsVisitFormOpen(true);
  };

  // Record Visit
  const handleRecordVisit = async (customerId, visitData) => {
    try {
      const res = await api.createVisit(customerId, visitData);
      if (res.success) {
        const custName = res.data.customer?.name || 'Client';
        const remDate = res.data.customer?.nextReminderDate || '';
        showToast(`Visit recorded for ${custName}! Next reminder set for ${remDate}`);
        loadInitialData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to record visit', 'error');
    }
  };

  // Log Out
  const handleLogout = () => {
    localStorage.removeItem('salon_jwt_token');
    setUser(null);
    setDashboardData(null);
    setClients([]);
  };

  // Handle successful login/signup from AuthScreen
  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'clients':
        return 'Clients';
      case 'reports':
        return 'Reports';
      default:
        return 'Dashboard';
    }
  };

  if (authChecking) {
    return <LoadingState message="Connecting to secure salon workspace..." />;
  }

  if (!user) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <AppShell
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      title={getPageTitle()}
      user={user}
      onLogout={handleLogout}
    >
      {/* Active Page View */}
      {activeTab === 'dashboard' && (
        <Dashboard
          user={user}
          dashboardData={dashboardData}
          loading={loading}
          onAddVisit={() => handleOpenVisitForm()}
          onAddClient={handleOpenAddClient}
          onSelectClient={handleSelectClient}
        />
      )}

      {activeTab === 'clients' && (
        <Clients
          clients={clients}
          loading={loading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSelectClient={handleSelectClient}
          onAddClient={handleOpenAddClient}
        />
      )}

      {activeTab === 'reports' && <Reports />}

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold border transition-all animate-bounce ${
            toast.type === 'error'
              ? 'bg-red-600 text-white border-red-700'
              : 'bg-[#0b1c30] text-white border-[#213145]'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-300" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-[#ceeac5]" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Client Profile Modal */}
      <ClientProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        client={selectedClient}
        onRecordVisit={handleOpenVisitForm}
        onEditClient={handleOpenEditClient}
        onDeleteClient={handleDeleteClient}
      />

      {/* Add/Edit Client Form Modal */}
      <ClientForm
        isOpen={isClientFormOpen}
        onClose={() => setIsClientFormOpen(false)}
        onSubmit={handleSaveClient}
        clientToEdit={clientToEdit}
        services={services}
      />

      {/* Record Visit Form Modal */}
      <VisitForm
        isOpen={isVisitFormOpen}
        onClose={() => setIsVisitFormOpen(false)}
        onSubmit={handleRecordVisit}
        clients={clients}
        services={services}
        preselectedClient={selectedClient}
      />
    </AppShell>
  );
}
