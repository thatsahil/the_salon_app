import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { User, Phone, FileText, Scissors } from 'lucide-react';

export function ClientForm({ isOpen, onClose, onSubmit, clientToEdit = null, services = [] }) {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [preferredService, setPreferredService] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (clientToEdit) {
      setName(clientToEdit.name || '');
      setPhoneNumber(clientToEdit.phoneNumber || '');
      setNotes(clientToEdit.notes || '');
      setPreferredService(clientToEdit.preferredService || '');
    } else {
      setName('');
      setPhoneNumber('');
      setNotes('');
      setPreferredService('');
    }
    setError('');
  }, [clientToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Client name is required');
      return;
    }
    if (!phoneNumber.trim()) {
      setError('Phone number is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit({
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        notes: notes.trim(),
        preferredService,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save client details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={clientToEdit ? 'Edit Client Details' : 'Add New Salon Client'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <Input
          label="Full Name"
          placeholder="e.g. Aria Sterling"
          icon={User}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Phone Number"
          placeholder="e.g. 9876543210"
          icon={Phone}
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          helperText="Unique customer identifier"
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#0b1c30] flex items-center gap-1">
            <Scissors className="w-3.5 h-3.5 text-[#585990]" /> Preferred Service (Optional)
          </label>
          <select
            value={preferredService}
            onChange={(e) => setPreferredService(e.target.value)}
            className="w-full rounded-lg border border-[#c8c5d0] bg-white px-3 py-2.5 text-sm text-[#0b1c30] outline-none focus:border-[#585990] focus:ring-2 focus:ring-[#585990]/20"
          >
            <option value="">Select preferred service...</option>
            {services.map((srv) => (
              <option key={srv._id || srv.name} value={srv.name}>
                {srv.name} (₹{srv.price})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#0b1c30] flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-[#585990]" /> Notes / Preferences (Optional)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Sensitive scalp, prefers Saturday mornings..."
            className="w-full rounded-lg border border-[#c8c5d0] bg-white p-3 text-sm text-[#0b1c30] outline-none focus:border-[#585990] focus:ring-2 focus:ring-[#585990]/20 resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 mt-2">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={loading}>
            {clientToEdit ? 'Save Changes' : 'Create Client'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
