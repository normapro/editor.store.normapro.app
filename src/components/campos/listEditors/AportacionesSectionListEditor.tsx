import { JsonCollectionEditor } from "./JsonCollectionEditor";
import type { CollectionListEditorProps } from "./types";

export function AportacionesListEditor(props: CollectionListEditorProps) {
  return <JsonCollectionEditor {...props} defaultObjectShape={{ image: "", imageBackground: "", title: "", claim: "", items: [], buttonText: "" }} />;
}
