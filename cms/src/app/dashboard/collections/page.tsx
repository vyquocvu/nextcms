'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface CollectionType {
  name: string;
  slug: string;
}

export default function CollectionsPage() {
  const [types, setTypes] = useState<CollectionType[]>([]);

  useEffect(() => {
    fetch('/api/collections/types')
      .then((res) => res.json())
      .then(setTypes);
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Collections</h1>
      <ul className="space-y-2">
        {types.map((t) => (
          <li key={t.slug}>
            <Link className="underline" href={`/dashboard/collections/${t.slug}`}>
              {t.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
