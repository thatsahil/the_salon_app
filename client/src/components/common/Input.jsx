import React from 'react';

export function Input({
  label,
  error,
  helperText,
  icon: Icon,
  type = 'text',
  className = '',
  id,
  value,
  onChange,
  placeholder,
  required = false,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-[#0b1c30] tracking-wide flex items-center justify-between">
          <span>
            {label} {required && <span className="text-red-500">*</span>}
          </span>
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-[#777680] pointer-events-none flex items-center justify-center">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-[#0b1c30] placeholder-[#777680] outline-none transition-all ${
            Icon ? 'pl-9' : ''
          } ${
            error
              ? 'border-red-500 focus:ring-2 focus:ring-red-200'
              : 'border-[#c8c5d0] focus:border-[#585990] focus:ring-2 focus:ring-[#585990]/20'
          }`}
          {...props}
        />
      </div>

      {error ? (
        <span className="text-xs font-medium text-red-600">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-[#46464f]">{helperText}</span>
      ) : null}
    </div>
  );
}
