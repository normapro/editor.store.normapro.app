import { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface ContenidoInformeProps {
  value: any;
  onChange: (newValue: any[]) => void;
}

export function ContenidoInforme({ value, onChange }: ContenidoInformeProps) {
  const [isHtmlMode, setIsHtmlMode] = useState(false);

  const getParsedValue = () => {
    let parsed = [{ title: '', content: '' }];
    try {
      if (typeof value === 'string' && value !== '') {
        parsed = JSON.parse(value);
      } else if (Array.isArray(value) && value.length > 0) {
        parsed = value;
      }
    } catch (e) {
      console.warn("Error parseando JSON en ContenidoInforme:", e);
    }
    return parsed;
  };

  const data = getParsedValue();
  const rawHtml = data[0]?.content || '';
  const displayHtml = isHtmlMode ? rawHtml.replace(/&nbsp;/g, ' ') : rawHtml;

  const handleContentChange = (content: string) => {
    const updatedArray = [{ ...data[0], content: content }];
    onChange(updatedArray);
  };

  return (
    <div className="quill-container overflow-hidden rounded-lg border border-border bg-surface">
      {/* Barra de herramientas personalizada para el modo HTML */}
      <div className="flex justify-end border-b border-border p-2">
        <button
          type="button"
          onClick={() => setIsHtmlMode(!isHtmlMode)}
          className={`flex items-center gap-2 rounded px-3 py-1 text-xs font-medium transition-colors ${isHtmlMode
              ? 'bg-accent text-white'
              : 'bg-accent border border-border text-text-secondary hover:opacity-90'
            }`}
        >
          {isHtmlMode ? 'Ver Editor' : 'Ver HTML'}
        </button>
      </div>

      {isHtmlMode ? (
        <textarea
          className="w-full min-h-[250px] p-4 font-mono text-sm outline-none"
          value={displayHtml}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Escribe tu HTML aquí..."
        />
      ) : (
        <ReactQuill
          theme="snow"
          value={rawHtml}
          onChange={handleContentChange}
          modules={{
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'clean'],
            ],
          }}
        />
      )}

      <style>{`
        .ql-toolbar.ql-snow { border: none; border-bottom: 1px solid var(--border); }
        .ql-container.ql-snow { border: none; min-height: 250px; font-size: 1rem; }
        .ql-editor { min-height: 250px; }
      `}</style>
    </div>
  );
}