import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { formatDisplayDate } from '../../utils/date';
import { formatCurrency } from '../../utils/currency';
import { formatPhoneDisplay, getWhatsAppReminderUrl } from '../../utils/phone';
import { Phone, Calendar, IndianRupee, History, PlusCircle, Edit3, Send, Trash2, AlertTriangle } from 'lucide-react';

export function ClientProfileModal({ isOpen, onClose, client, onRecordVisit, onEditClient, onDeleteClient }) {
  const [showConfirmDelete, setShowConfirmDelete] = React.useState(false);

  if (!client) return null;

  const visits = client.visits || [];
  const waUrl = getWhatsAppReminderUrl(client.phoneNumber, client.name);

  const handleDelete = () => {
    if (onDeleteClient) {
      onDeleteClient(client);
      setShowConfirmDelete(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Client Profile" maxWidth="max-w-lg">
      <div className="flex flex-col gap-6">
        {/* Header Profile Info */}
        <div className="flex items-start justify-between bg-[#f8f9ff] p-4 rounded-2xl border border-[#e5eeff]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#585990] to-[#8b8cc7] text-white font-bold text-lg flex items-center justify-center border-2 border-white shadow-xs">
              {client.name ? client.name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <h3 className="font-bold text-base text-[#0b1c30]">{client.name}</h3>
              <p className="text-xs text-[#46464f] flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3 text-[#777680]" />
                {formatPhoneDisplay(client.phoneNumber)}
              </p>
              {client.preferredService && (
                <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-[#ceeac5]/60 text-[#4c6548] font-bold text-[11px]">
                  {client.preferredService}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onEditClient(client)}
              className="p-2 rounded-xl text-[#585990] bg-white hover:bg-[#e5eeff] border border-[#d3e4fe] transition-colors"
              title="Edit Client"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="p-2 rounded-xl text-red-600 bg-white hover:bg-red-50 border border-red-200 transition-colors"
              title="Delete Client"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Delete Confirmation Box */}
        {showConfirmDelete && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs flex flex-col gap-2.5 animate-fade-in">
            <div className="flex items-center gap-2 text-red-800 font-bold">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Delete Client Record?</span>
            </div>
            <p className="text-red-700 leading-relaxed">
              Are you sure you want to delete <strong className="font-bold">{client.name}</strong>? This action cannot be undone and will permanently remove all their visit history.
            </p>
            <div className="flex items-center justify-end gap-2 mt-1">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-3 py-1.5 rounded-xl bg-white border border-red-200 text-red-800 text-xs font-semibold hover:bg-red-100/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Yes, Delete Client
              </button>
            </div>
          </div>
        )}

        {/* Notes if present */}
        {client.notes && (
          <div className="text-xs bg-[#eff4ff] p-3 rounded-xl border border-[#d3e4fe] text-[#0b1c30]">
            <span className="font-bold text-[#585990] block mb-1">Notes:</span>
            {client.notes}
          </div>
        )}

        {/* Client Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-white p-3 rounded-xl border border-[#e2e8f0]">
            <span className="text-[10px] text-[#46464f] font-semibold uppercase block">Last Visit</span>
            <span className="text-xs font-bold text-[#0b1c30]">
              {formatDisplayDate(client.lastVisitDate)}
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-[#e2e8f0]">
            <span className="text-[10px] text-[#805252] font-semibold uppercase block">Next Reminder</span>
            <span className="text-xs font-bold text-[#805252]">
              {formatDisplayDate(client.nextReminderDate)}
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-[#e2e8f0]">
            <span className="text-[10px] text-[#46464f] font-semibold uppercase block">Total Visits</span>
            <span className="text-xs font-bold text-[#0b1c30]">{client.totalVisits || 0}</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-[#e2e8f0]">
            <span className="text-[10px] text-[#46464f] font-semibold uppercase block">Total Spent</span>
            <span className="text-xs font-bold text-[#585990]">{formatCurrency(client.totalSpent || 0)}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            icon={PlusCircle}
            onClick={() => onRecordVisit(client)}
            className="flex-1 py-2.5 text-xs font-bold"
          >
            Record Visit
          </Button>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#ceeac5]/60 hover:bg-[#ceeac5] text-[#4c6548] font-bold text-xs border border-[#ceeac5] transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            Send Reminder
          </a>
        </div>

        {/* Visit History */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <History className="w-4 h-4 text-[#585990]" />
            <h4 className="font-bold text-sm text-[#0b1c30]">Visit History</h4>
          </div>

          {visits.length === 0 ? (
            <p className="text-xs text-[#46464f] italic py-2">No past visits recorded yet.</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {visits.map((v) => (
                <div
                  key={v._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#f8f9ff] border border-[#eff4ff] text-xs"
                >
                  <div>
                    <span className="font-bold text-[#0b1c30] block">{v.serviceName}</span>
                    <span className="text-[11px] text-[#46464f]">
                      {formatDisplayDate(v.visitDate)} •{' '}
                      <span className="capitalize">{v.paymentMethod || 'cash'}</span>
                    </span>
                  </div>
                  <span className="font-bold text-[#585990] text-sm">
                    {formatCurrency(v.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
