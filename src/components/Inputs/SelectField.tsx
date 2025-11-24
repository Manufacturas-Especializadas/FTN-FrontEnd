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
            <div className="relative mb-4 font-sans">
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>

                <select
                    ref={ref}
                    id={selectId}
                    required
                    className={`
                        peer
                        block w-full appearance-none border bg-white 
                        px-3 pt-5 pb-1.5 text-sm rounded-md
                        
                        focus:outline-none focus:ring-1
                        transition-colors duration-200 ease-in-out
                        
                        text-gray-900 focus:text-gray-900 
                        invalid:text-transparent 

                        ${error
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-blue-600 focus:ring-blue-600'
                        }
                        ${className}
                    `}
                    {...props}
                >
                    <option value="" disabled selected className="hidden"></option>

                    {options.map((option) => (
                        <option key={option.value} value={option.value} className="text-gray-900">
                            {option.label}
                        </option>
                    ))}
                </select>

                <label
                    htmlFor={selectId}
                    className={`
                        absolute left-3 duration-200 transform 
                        origin-[0] pointer-events-none select-none
                        uppercase tracking-wide font-bold

                        top-0.5 
                        text-[10px] 
                        scale-100 
                        -translate-y-0
                        
                        peer-invalid:top-1/2 
                        peer-invalid:-translate-y-1/2 
                        peer-invalid:text-sm
                        peer-invalid:font-normal
                        peer-invalid:text-gray-400

                        peer-focus:top-0.5 
                        peer-focus:-translate-y-0 
                        peer-focus:text-[10px]
                        peer-focus:font-bold

                        ${error
                            ? 'text-red-500 peer-focus:text-red-500'
                            : 'text-gray-500 peer-focus:text-blue-600'
                        }
                    `}
                >
                    {label} {props.required && <span className={error ? 'text-red-500' : 'peer-focus:text-red-500'}>*</span>}
                </label>

                {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
            </div>
        );
    }
);

SelectField.displayName = 'SelectField';
export default SelectField;