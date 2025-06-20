'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Entry {
  id: string;
  [key: string]: unknown;
}

export default function CollectionEntriesPage() {
  const params = useParams<{ slug: string }>();
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    if (!params.slug) return;
    fetch(`/api/collections/${params.slug}`)
      .then((res) => res.json())
      .then(setEntries);
  }, [params.slug]);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Entries: {params.slug}</h1>
      <pre className="bg-gray-100 p-2 rounded">
        {JSON.stringify(entries, null, 2)}
      </pre>
    </div>
  );
}
