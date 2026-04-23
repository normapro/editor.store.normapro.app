import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface ContenidoInformeProps {
  value: any;
  onChange: (newValue: any[]) => void;
}

export function ContenidoInforme({ value, onChange }: ContenidoInformeProps) {
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
  const currentHtml = data[0]?.content || '';

  return (
    <div className="quill-container overflow-hidden rounded-lg border border-border">
      <ReactQuill
        theme="snow"
        value={currentHtml}
        onChange={(htmlContent) => {
          const updatedArray = [{ ...data[0], content: htmlContent }];
          onChange(updatedArray);
        }}
        modules={{
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'clean'],
          ],
        }}
      />
      <style>{`
        .ql-toolbar.ql-snow { border: none; border-bottom: 1px solid var(--border); }
        .ql-container.ql-snow { border: none; min-height: 250px; font-size: 1rem; }
      `}</style>
    </div>
  );
}