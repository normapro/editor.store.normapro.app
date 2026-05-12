import { JsonCollectionEditor } from "./JsonCollectionEditor";
import type { CollectionListEditorProps } from "./types";

export function ClientPerceptionItemsListEditor(props: CollectionListEditorProps) {
  return <JsonCollectionEditor {...props} defaultPrimitive="" />;
}

export function ClientPerceptionListListEditor(props: CollectionListEditorProps) {
  return <JsonCollectionEditor {...props} defaultObjectShape={{ title: "", claim: "" }} />;
}

export function ClientPerceptionTablaListEditor(props: CollectionListEditorProps) {
  return <JsonCollectionEditor {...props} defaultObjectShape={{ icon: "", claim: "" }} />;
}
