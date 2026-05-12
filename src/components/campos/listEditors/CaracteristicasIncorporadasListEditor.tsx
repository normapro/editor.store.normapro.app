import { JsonCollectionEditor } from "./JsonCollectionEditor";
import type { CollectionListEditorProps } from "./types";

export function CaracteristicasIncorporadasDataListEditor(props: CollectionListEditorProps) {
  return (
    <JsonCollectionEditor
      {...props}
      defaultObjectShape={{
        id_data: 1,
        title: "",
        icon: "",
        mainTitle: "",
        subtitle: "",
        description: "",
        img: "",
      }}
    />
  );
}
