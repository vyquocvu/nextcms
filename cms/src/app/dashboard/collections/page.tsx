'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface CollectionType {
  name: string;
  slug: string;
}

interface FieldData {
  name: string;
  type: string;
}

export default function CollectionsPage() {
  const [types, setTypes] = useState<CollectionType[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [fields, setFields] = useState('');

  useEffect(() => {
    fetch('/api/collections/types')
      .then((res) => res.json())
      .then(setTypes);
  }, []);

  async function addType(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await fetch('/api/collections/types', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        slug,
        fields: fields
          .split(',')
          .map((f) => f.trim())
          .filter(Boolean)
          .map((f) => ({ name: f, type: 'string' } as FieldData)),
      }),
    });
    if (res.ok) {
      const type = await res.json();
      setTypes([...types, type]);
      setName('');
      setSlug('');
      setFields('');
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Collections</h1>
      <ul className="space-y-2 mb-6">
        {types.map((t) => (
          <li key={t.slug}>
            <Link className="underline" href={`/dashboard/collections/${t.slug}`}>
              {t.name}
            </Link>
          </li>
        ))}
      </ul>
      <form onSubmit={addType} className="flex flex-col space-y-2">
        <input
          className="border p-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="border p-2"
          placeholder="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />
        <input
          className="border p-2"
          placeholder="Fields (comma separated)"
          value={fields}
          onChange={(e) => setFields(e.target.value)}
          required
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Add Collection
        </button>
      </form>
    </div>
  );
}
