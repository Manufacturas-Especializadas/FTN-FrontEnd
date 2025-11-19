import React from 'react';

export interface Option {
    value: string | number;
    label: string;
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: Option[];
    error?: string;
}

const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
    ({ label, id, options, error, className = '', ...props }, ref) => {
        const selectId = id || label.replace(/\s+/g, '-').toLowerCase();

        return (
            <div className="mb-4">
                <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
                <select
                    ref={ref}
                    id={selectId}
                    className={`w-full px-4 py-2.5 rounded-lg border ${error
                        ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        } focus:outline-none focus:ring-2 transition-all bg-white shadow-sm appearance-none ${className}`}
                    {...props}
                >
                    <option value="">Selecciona una opción</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
        );
    }
);

SelectField.displayName = 'SelectField';
export default SelectField;