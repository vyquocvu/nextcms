'use client';
import TypeManager from '../components/TypeManager';

export default function CollectionsPage() {
  return (
    <TypeManager
      title="Collections"
      listUrl="/api/collections/types"
      postUrl="/api/collections/types"
      deleteUrl={(slug) => `/api/collections/types/${slug}`}
      entryLink={(slug) => `/dashboard/collections/${slug}`}
      fieldOptions={[
        { value: 'string', label: 'Text' },
        { value: 'number', label: 'Number' },
        { value: 'boolean', label: 'Boolean' },
        { value: 'date', label: 'Date' },
        { value: 'email', label: 'Email' },
        { value: 'url', label: 'URL' },
      ]}
      addButtonLabel="Add Collection"
    />
  );
}
