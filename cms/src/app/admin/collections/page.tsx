'use client';
import TypeManager from '../components/TypeManager';

export default function CollectionsPage() {
  return (
    <TypeManager
      title="Collections"
      listUrl="/api/collections/types"
      postUrl="/api/collections/types"
      deleteUrl={(slug) => `/api/collections/types/${slug}`}
      entryLink={(slug) => `/admin/collections/${slug}`}
      fieldOptions={[
        { value: 'string', label: 'Text' },
        { value: 'number', label: 'Number' },
        { value: 'boolean', label: 'Boolean' },
        { value: 'date', label: 'Date' },
        { value: 'email', label: 'Email' },
        { value: 'url', label: 'URL' },
        { value: 'richtext', label: 'Rich Text' },
        { value: 'media', label: 'Media' },
        { value: 'json', label: 'JSON' },
        { value: 'relation', label: 'Relation' },
        { value: 'component', label: 'Component' },
        { value: 'dynamicZone', label: 'Dynamic Zone' },
      ]}
      addButtonLabel="Add Collection"
    />
  );
}
