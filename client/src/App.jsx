import React, { useState, useEffect, useCallback } from 'react';
import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './pages/Dashboard';
import { Clients } from './pages/Clients';
import { Reports } from './pages/Reports';
import { ClientForm } from './components/clients/ClientForm';
import { VisitForm } from './components/clients/VisitForm';
import { ClientProfileModal } from './components/clients/ClientProfileModal';
import { api } from './services/api';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState({ name: 'Akshay Kumar', salonName: 'Serene Salon & Studio' });
  const [dashboardData, setDashboardData] = useState(null);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

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

  const loadInitialData = useCallback(async () => {
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
  }, [searchQuery]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Handle Client Search
  useEffect(() => {
    const handler = setTimeout(async () => {
      try {
        const res = await api.getClients(searchQuery);
        if (res.success) setClients(res.data);
      } catch (err) {
        console.error(err);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

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
  };

  // Open Visit Form
  const handleOpenVisitForm = (client = null) => {
    setSelectedClient(client);
    setIsProfileModalOpen(false);
    setIsVisitFormOpen(true);
  };

  // Record Visit
  const handleRecordVisit = async (customerId, visitData) => {
    const res = await api.createVisit(customerId, visitData);
    if (res.success) {
      const custName = res.data.customer?.name || 'Client';
      const remDate = res.data.customer?.nextReminderDate || '';
      showToast(`Visit recorded for ${custName}! Next reminder set for ${remDate}`);
      loadInitialData();
    }
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

  return (
    <AppShell
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      title={getPageTitle()}
      user={user}
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
