'use client';
import TypeManager from '../../components/TypeManager';

export default function SingleTypesPage() {
  return (
    <TypeManager
      title="Single Types"
      listUrl="/api/singles/types"
      postUrl="/api/singles/types"
      entryLink={(slug) => `/dashboard/singles/${slug}`}
      addButtonLabel="Add Single Type"
    />
  );
}
