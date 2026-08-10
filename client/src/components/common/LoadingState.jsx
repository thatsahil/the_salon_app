import React from 'react';

export function LoadingState({ message = 'Loading details...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-10 h-10 border-3 border-[#e5eeff] border-t-[#585990] rounded-full animate-spin mb-3"></div>
      <p className="text-sm font-medium text-[#46464f]">{message}</p>
    </div>
  );
}
