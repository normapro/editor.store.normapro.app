import { JsonCollectionEditor } from "./JsonCollectionEditor";
import type { CollectionListEditorProps } from "./types";

export function EstudioDatosListEditor(props: CollectionListEditorProps) {
  return <JsonCollectionEditor {...props} defaultObjectShape={{ label: "", value: "" }} />;
}
