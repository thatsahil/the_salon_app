import React, { useState } from 'react';
import { ClientList } from '../components/clients/ClientList';
import { LoadingState } from '../components/common/LoadingState';

export function Clients({
  clients = [],
  loading,
  searchQuery,
  setSearchQuery,
  onSelectClient,
  onAddClient,
}) {
  if (loading && clients.length === 0) {
    return <LoadingState message="Fetching client directory..." />;
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#0b1c30] tracking-tight">
          Client Database
        </h2>
        <p className="text-xs sm:text-sm text-[#46464f]">
          Manage customer records, visit history, and contact preferences.
        </p>
      </div>

      <ClientList
        clients={clients}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectClient={onSelectClient}
        onAddClient={onAddClient}
      />
    </div>
  );
}
