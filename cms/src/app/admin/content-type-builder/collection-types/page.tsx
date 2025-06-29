'use client';
import TypeManager from '../../components/TypeManager';

export default function CollectionsPage() {
  return (
    <TypeManager
      title="Collections"
      listUrl="/api/collections/types"
      postUrl="/api/collections/types"
      deleteUrl={(slug) => `/api/collections/types/${slug}`}
      entryLink={(slug) => `/admin/collections/${slug}`}
      addButtonLabel="Add Collection"
    />
  );
}
