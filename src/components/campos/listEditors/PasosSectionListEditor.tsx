import { JsonCollectionEditor } from "./JsonCollectionEditor";
import type { CollectionListEditorProps } from "./types";

export function PasosListEditor(props: CollectionListEditorProps) {
  return <JsonCollectionEditor {...props} defaultObjectShape={{ image: "", title: "", claim: "" }} />;
}
