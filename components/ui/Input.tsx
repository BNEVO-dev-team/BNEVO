import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5 ml-1">
          {label}
        </label>
      )}
      <input
        className={`w-full min-h-[48px] rounded-xl border-slate-200 dark:border-slate-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base px-4 py-3 border transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-500 font-medium ml-1">{error}</p>}
    </div>
  );
};