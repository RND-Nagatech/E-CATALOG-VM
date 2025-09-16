import React from 'react';

interface CheckboxGroupProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  options,
  selected,
  onChange
}) => {
  const handleToggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label}
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option} className="flex items-center group cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => handleToggle(option)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
            />
            <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
              {option}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};