import React from 'react';
import { Search, UserPlus, Users } from 'lucide-react';
import { ClientCard } from './ClientCard';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';

export function ClientList({ clients = [], searchQuery, setSearchQuery, onSelectClient, onAddClient }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777680]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name or phone number..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#c8c5d0] focus:border-[#585990] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#585990]/20 transition-all text-[#0b1c30] placeholder-[#777680]"
          />
        </div>

        <Button variant="primary" icon={UserPlus} onClick={onAddClient} className="shrink-0">
          New Client
        </Button>
      </div>

      {/* Clients Count Header */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold text-[#46464f] uppercase tracking-wider">
          All Clients ({clients.length})
        </span>
      </div>

      {/* Clients Cards */}
      {clients.length === 0 ? (
        <EmptyState
          title="No Clients Found"
          description={
            searchQuery
              ? `No matching client for "${searchQuery}".`
              : 'You haven\'t added any salon clients yet.'
          }
          icon={Users}
          action={
            <Button variant="primary" icon={UserPlus} onClick={onAddClient} size="sm">
              Add First Client
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {clients.map((client) => (
            <ClientCard key={client._id} client={client} onClick={onSelectClient} />
          ))}
        </div>
      )}
    </div>
  );
}
