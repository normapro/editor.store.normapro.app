import React from 'react';

interface Props {
  value: string[]; // Recibe el array de párrafos
  onChange: (newValue: string[]) => void;
}

export const ParagraphsEditor: React.FC<Props> = ({ value = [], onChange }) => {
  
  const updateParagraph = (index: number, text: string) => {
    const newArray = [...value];
    newArray[index] = text;
    onChange(newArray);
  };

  const addParagraph = () => {
    onChange([...value, ""]); // Añade un párrafo vacío al final
  };

  const removeParagraph = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3 p-3 border border-border rounded-lg">
      {value.map((parrafo, index) => (
        <div key={index} className="flex gap-2 items-start">
          <textarea
            className="flex-1 p-2 border border-border rounded shadow-sm text-sm"
            rows={3}
            value={parrafo}
            onChange={(e) => updateParagraph(index, e.target.value)}
            placeholder={`Párrafo ${index + 1}`}
          />
          <button 
            type="button"
            onClick={() => removeParagraph(index)}
            className="text-red-500 hover:text-red-700 p-1"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addParagraph}
        className="text-xs text-blue-600 px-3 py-1 rounded border border-blue-200 hover:bg-blue-100"
      >
        + Añadir otro párrafo
      </button>
    </div>
  );
};