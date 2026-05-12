import { JsonCollectionEditor } from "./JsonCollectionEditor";
import type { CollectionListEditorProps } from "./types";

export function ListHistoriaListEditor(props: CollectionListEditorProps) {
  return <JsonCollectionEditor {...props} defaultObjectShape={{ title: "", claim: "" }} />;
}
