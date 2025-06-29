'use client';
import TypeManager from '../../components/TypeManager';

export default function SingleTypesPage() {
  return (
    <TypeManager
      title="Single Types"
      listUrl="/api/singles/types"
      postUrl="/api/singles/types"
      deleteUrl={(slug) => `/api/singles/types/${slug}`}
      entryLink={(slug) => `/admin/singles/${slug}`}
      addButtonLabel="Add Single Type"
    />
  );
}
