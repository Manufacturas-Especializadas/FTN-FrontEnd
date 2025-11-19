import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
    ({ label, id, error, className = '', ...props }, ref) => {
        const inputId = id || (label || '').replace(/\s+/g, '-').toLowerCase();

        return (
            <div className="mb-4">
                <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
                <input
                    ref={ref}
                    id={inputId}
                    className={`w-full px-4 py-2.5 rounded-lg border ${error
                        ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } focus:outline-none focus:ring-2 transition-all bg-white shadow-sm ${className}`}
                    {...props}
                />
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
        );
    }
);

InputField.displayName = 'InputField';
export default InputField;