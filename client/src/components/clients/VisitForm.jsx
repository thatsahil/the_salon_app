import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { getTodayStr } from '../../utils/date';
import { formatPhoneDisplay } from '../../utils/phone';
import { Scissors, Calendar, CreditCard, FileText, User, Search, X, Check, Sparkles } from 'lucide-react';

const PREDEFINED_SERVICES = [
  { name: 'Haircut', price: 350 },
  { name: 'Beard Trim', price: 150 },
  { name: 'Haircut & Beard Combo', price: 450 },
  { name: 'Hair Color', price: 800 },
  { name: 'Hair Spa & Scalp Care', price: 600 },
  { name: 'Refreshing Facial', price: 500 },
  { name: 'Head Massage', price: 250 },
  { name: 'Shaving & Styling', price: 200 },
];

export function VisitForm({
  isOpen,
  onClose,
  onSubmit,
  clients = [],
  services = [],
  preselectedClient = null,
}) {
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);

  const [serviceName, setServiceName] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [visitDate, setVisitDate] = useState(getTodayStr());
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dropdownRef = useRef(null);

  // Combine API services with default predefined services (prevent duplicates)
  const combinedServices = React.useMemo(() => {
    const list = [...services];
    PREDEFINED_SERVICES.forEach((def) => {
      if (!list.some((s) => s.name.toLowerCase() === def.name.toLowerCase())) {
        list.push({ _id: `def_${def.name}`, name: def.name, price: def.price });
      }
    });
    return list;
  }, [services]);

  useEffect(() => {
    if (preselectedClient) {
      setSelectedCustomerId(preselectedClient._id);
      setClientSearchQuery(`${preselectedClient.name} (${formatPhoneDisplay(preselectedClient.phoneNumber)})`);
      if (preselectedClient.preferredService) {
        setServiceName(preselectedClient.preferredService);
        const matchedSrv = combinedServices.find((s) => s.name.toLowerCase() === preselectedClient.preferredService.toLowerCase());
        if (matchedSrv) {
          setAmount(matchedSrv.price.toString());
        }
      }
    } else {
      // Empty at the beginning as requested
      setSelectedCustomerId('');
      setClientSearchQuery('');
      setServiceName('');
      setAmount('');
    }
    setIsClientDropdownOpen(false);
    setVisitDate(getTodayStr());
    setPaymentMethod('cash');
    setError('');
  }, [preselectedClient, isOpen, combinedServices]);

  // Click outside listener for client dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsClientDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter clients based on user typing name or phone
  const matchingClients = React.useMemo(() => {
    if (!clientSearchQuery.trim()) return clients;
    const query = clientSearchQuery.toLowerCase().trim();
    return clients.filter((c) => {
      const nameMatch = c.name && c.name.toLowerCase().includes(query);
      const phoneMatch = c.phoneNumber && c.phoneNumber.includes(query);
      return nameMatch || phoneMatch;
    });
  }, [clients, clientSearchQuery]);

  const handleSelectClient = (client) => {
    setSelectedCustomerId(client._id);
    setClientSearchQuery(`${client.name} (${formatPhoneDisplay(client.phoneNumber)})`);
    setIsClientDropdownOpen(false);

    // Auto-fill preferred service if available and service not set
    if (client.preferredService && !serviceName) {
      setServiceName(client.preferredService);
      const matched = combinedServices.find((s) => s.name.toLowerCase() === client.preferredService.toLowerCase());
      if (matched) setAmount(matched.price.toString());
    }
  };

  const handleServiceSelect = (selectedName) => {
    setServiceName(selectedName);
    const matched = combinedServices.find((s) => s.name.toLowerCase() === selectedName.toLowerCase());
    if (matched) {
      setAmount(matched.price.toString());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      setError('Please search and select a client from the list');
      return;
    }
    if (!serviceName.trim()) {
      setError('Please select or enter a service name');
      return;
    }
    if (!amount || Number(amount) < 0) {
      setError('Please enter a valid visit amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit(selectedCustomerId, {
        serviceName: serviceName.trim(),
        amount: Number(amount),
        paymentMethod,
        visitDate,
        notes: notes.trim(),
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to record visit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Client Visit">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
            {error}
          </div>
        )}

        {/* Searchable Customer Select */}
        <div className="flex flex-col gap-1.5 relative" ref={dropdownRef}>
          <label className="text-xs font-semibold text-[#0b1c30] flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-[#585990]" /> Select Client <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-[#777680] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search client by name or phone number..."
              value={clientSearchQuery}
              onChange={(e) => {
                setClientSearchQuery(e.target.value);
                setSelectedCustomerId('');
                setIsClientDropdownOpen(true);
              }}
              onFocus={() => setIsClientDropdownOpen(true)}
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-[#c8c5d0] focus:border-[#585990] focus:ring-2 focus:ring-[#585990]/20 rounded-xl text-xs font-semibold text-[#0b1c30] outline-none transition-all"
            />
            {clientSearchQuery && (
              <button
                type="button"
                onClick={() => {
                  setClientSearchQuery('');
                  setSelectedCustomerId('');
                  setIsClientDropdownOpen(true);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777680] hover:text-[#0b1c30] p-0.5 rounded-full hover:bg-slate-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Client Search Dropdown */}
          {isClientDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e2e8f0] rounded-xl shadow-xl z-50 max-h-52 overflow-y-auto divide-y divide-[#eff4ff] animate-fade-in">
              {matchingClients.length === 0 ? (
                <div className="p-3 text-xs text-[#777680] text-center italic">
                  No client found matching "{clientSearchQuery}"
                </div>
              ) : (
                matchingClients.map((client) => {
                  const isSelected = client._id === selectedCustomerId;
                  return (
                    <div
                      key={client._id}
                      onClick={() => handleSelectClient(client)}
                      className={`p-2.5 flex items-center justify-between cursor-pointer hover:bg-[#f8f9ff] transition-colors text-xs ${
                        isSelected ? 'bg-[#eff4ff]' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#e5eeff] text-[#585990] font-bold text-xs flex items-center justify-center border border-[#d3e4fe]">
                          {client.name ? client.name.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div>
                          <span className="font-bold text-[#0b1c30] block">{client.name}</span>
                          <span className="text-[11px] text-[#46464f]">
                            {formatPhoneDisplay(client.phoneNumber)}
                          </span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#585990]" />}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Predefined Service Select & Autofill */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#0b1c30] flex items-center gap-1">
            <Scissors className="w-3.5 h-3.5 text-[#585990]" /> Service Rendered <span className="text-red-500">*</span>
          </label>

          <select
            value={serviceName}
            onChange={(e) => handleServiceSelect(e.target.value)}
            className="w-full rounded-xl border border-[#c8c5d0] bg-white px-3 py-2.5 text-xs font-semibold text-[#0b1c30] outline-none focus:border-[#585990] focus:ring-2 focus:ring-[#585990]/20 transition-all"
          >
            <option value="">Choose a predefined service...</option>
            {combinedServices.map((srv) => (
              <option key={srv._id || srv.name} value={srv.name}>
                {srv.name} — ₹{srv.price}
              </option>
            ))}
          </select>

          {/* Quick Choice Pills */}
          <div className="flex flex-wrap gap-1.5 mt-1">
            {PREDEFINED_SERVICES.slice(0, 5).map((def) => {
              const isActive = serviceName.toLowerCase() === def.name.toLowerCase();
              return (
                <button
                  key={def.name}
                  type="button"
                  onClick={() => handleServiceSelect(def.name)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                    isActive
                      ? 'bg-[#585990] text-white border-[#585990]'
                      : 'bg-[#f8f9ff] text-[#0b1c30] border-[#e2e8f0] hover:bg-[#e5eeff]'
                  }`}
                >
                  {def.name} (₹{def.price})
                </button>
              );
            })}
          </div>

          <Input
            placeholder="Or type a custom service name..."
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Amount & Payment Method */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Amount (₹)"
            type="number"
            placeholder="e.g. 350"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#0b1c30] flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-[#585990]" /> Payment Mode
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full rounded-xl border border-[#c8c5d0] bg-white px-3 py-2.5 text-xs font-semibold text-[#0b1c30] outline-none focus:border-[#585990] focus:ring-2 focus:ring-[#585990]/20"
            >
              <option value="cash">Cash 💵</option>
              <option value="online">Online / UPI 💳</option>
            </select>
          </div>
        </div>

        {/* Visit Date */}
        <Input
          label="Visit Date"
          type="date"
          icon={Calendar}
          value={visitDate}
          onChange={(e) => setVisitDate(e.target.value)}
          required
        />

        {/* Notes */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#0b1c30] flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-[#585990]" /> Visit Notes (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Special hair conditioner used..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl border border-[#c8c5d0] bg-white px-3 py-2.5 text-xs font-semibold text-[#0b1c30] outline-none focus:border-[#585990]"
          />
        </div>

        <div className="flex items-center justify-end gap-3 mt-2">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={loading}>
            Save & Recalculate Reminder
          </Button>
        </div>
      </form>
    </Modal>
  );
}

