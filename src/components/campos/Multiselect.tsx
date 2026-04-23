import React from 'react';

interface Props {
  value: string | string[];
  options: string[];
  onChange: (newValue: string[]) => void;
}

export const Multiselect: React.FC<Props> = ({ value, options, onChange }) => {
  const selectedItems: string[] = React.useMemo(() => {
    if (Array.isArray(value)) return value;
    try {
      return JSON.parse(value || '[]');
    } catch {
      return [];
    }
  }, [value]);

  const toggleOption = (option: string) => {
    if (selectedItems.includes(option)) {
      onChange(selectedItems.filter(item => item !== option));
    } else {
      onChange([...selectedItems, option]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 p-3 border border-border rounded-lg">
      {options.map((option) => {
        const isSelected = selectedItems.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => toggleOption(option)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors border border-border ${
              isSelected
                ? 'bg-blue-600 text-white'
                : 'hover:bg-blue-400'
            }`}
          >
            {isSelected ? '✓ ' : '+ '}
            {option}
          </button>
        );
      })}
    </div>
  );
};