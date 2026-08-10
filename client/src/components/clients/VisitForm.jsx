import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { getTodayStr } from '../../utils/date';
import { Scissors, Calendar, CreditCard, FileText, User } from 'lucide-react';

export function VisitForm({
  isOpen,
  onClose,
  onSubmit,
  clients = [],
  services = [],
  preselectedClient = null,
}) {
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [visitDate, setVisitDate] = useState(getTodayStr());
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (preselectedClient) {
      setSelectedCustomerId(preselectedClient._id);
      if (preselectedClient.preferredService) {
        setServiceName(preselectedClient.preferredService);
        const matchedSrv = services.find((s) => s.name === preselectedClient.preferredService);
        if (matchedSrv) {
          setAmount(matchedSrv.price);
        }
      }
    } else {
      setSelectedCustomerId(clients.length > 0 ? clients[0]._id : '');
    }
    setVisitDate(getTodayStr());
    setPaymentMethod('cash');
    setError('');
  }, [preselectedClient, isOpen, clients, services]);

  const handleServiceChange = (e) => {
    const sName = e.target.value;
    setServiceName(sName);
    const matched = services.find((s) => s.name === sName);
    if (matched) {
      setAmount(matched.price);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      setError('Please select a customer');
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

        {/* Customer Select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#0b1c30] flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-[#585990]" /> Select Client *
          </label>
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            disabled={!!preselectedClient}
            className="w-full rounded-lg border border-[#c8c5d0] bg-white px-3 py-2.5 text-sm text-[#0b1c30] outline-none focus:border-[#585990] focus:ring-2 focus:ring-[#585990]/20 disabled:bg-[#f8f9ff]"
          >
            {clients.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} ({c.phoneNumber})
              </option>
            ))}
          </select>
        </div>

        {/* Service Select / Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#0b1c30] flex items-center gap-1">
            <Scissors className="w-3.5 h-3.5 text-[#585990]" /> Service Rendered *
          </label>
          <select
            value={serviceName}
            onChange={handleServiceChange}
            className="w-full rounded-lg border border-[#c8c5d0] bg-white px-3 py-2.5 text-sm text-[#0b1c30] outline-none focus:border-[#585990] focus:ring-2 focus:ring-[#585990]/20"
          >
            <option value="">Select service from catalog...</option>
            {services.map((srv) => (
              <option key={srv._id || srv.name} value={srv.name}>
                {srv.name} — ₹{srv.price}
              </option>
            ))}
          </select>
          <Input
            placeholder="Or type custom service name..."
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
            placeholder="450"
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
              className="w-full rounded-lg border border-[#c8c5d0] bg-white px-3 py-2.5 text-sm text-[#0b1c30] outline-none focus:border-[#585990] focus:ring-2 focus:ring-[#585990]/20"
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
            className="w-full rounded-lg border border-[#c8c5d0] bg-white px-3 py-2.5 text-sm text-[#0b1c30] outline-none focus:border-[#585990]"
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
