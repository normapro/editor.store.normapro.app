import { JsonCollectionEditor } from "./JsonCollectionEditor";
import type { CollectionListEditorProps } from "./types";

export function Aportaciones2ListEditor(props: CollectionListEditorProps) {
  return <JsonCollectionEditor {...props} defaultObjectShape={{ image: "", imageBackground: "", title: "", claim: "", items: [], buttonText: "" }} />;
}
