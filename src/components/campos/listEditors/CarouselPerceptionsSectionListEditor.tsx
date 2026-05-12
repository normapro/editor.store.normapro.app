import { JsonCollectionEditor } from "./JsonCollectionEditor";
import type { CollectionListEditorProps } from "./types";

export function CarouselPerceptionsListIdsEditor(props: CollectionListEditorProps) {
  return <JsonCollectionEditor {...props} defaultPrimitive={0} />;
}
