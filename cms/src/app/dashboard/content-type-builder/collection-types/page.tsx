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
  const [fields, setFields] = useState<FieldData[]>([
    { name: '', type: 'string' },
  ]);

  useEffect(() => {
    fetch('/api/collections/types')
      .then((res) => res.json())
      .then(setTypes);
  }, []);

  async function addType(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const sanitizedFields = fields
      .filter((f) => f.name.trim())
      .map((f) => ({ name: f.name.trim(), type: f.type }));
    const res = await fetch('/api/collections/types', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug, fields: sanitizedFields }),
    });
    if (res.ok) {
      const type = await res.json();
      setTypes([...types, type]);
      setName('');
      setSlug('');
      setFields([{ name: '', type: 'string' }]);
    }
  }

  async function deleteType(slugToDelete: string) {
    await fetch(`/api/collections/types/${slugToDelete}`, { method: 'DELETE' });
    setTypes((prev) => prev.filter((t) => t.slug !== slugToDelete));
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Collections</h1>
      <ul className="space-y-2 mb-6">
        {types.map((t) => (
          <li key={t.slug} className="flex items-center space-x-2">
            <Link className="underline flex-1" href={`/dashboard/collections/${t.slug}`}>
              {t.name}
            </Link>
            <button
              type="button"
              className="text-red-500"
              onClick={() => deleteType(t.slug)}
            >
              Delete
            </button>
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
        {fields.map((field, idx) => (
          <div key={idx} className="flex space-x-2">
            <input
              className="border p-2 flex-1"
              placeholder="Field name"
              value={field.name}
              onChange={(e) => {
                const updated = [...fields];
                updated[idx].name = e.target.value;
                setFields(updated);
              }}
              required
            />
            <select
              className="border p-2"
              value={field.type}
              onChange={(e) => {
                const updated = [...fields];
                updated[idx].type = e.target.value;
                setFields(updated);
              }}
            >
              <option value="string">Text</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
            </select>
            {fields.length > 1 && (
              <button
                type="button"
                className="px-2 text-red-500"
                onClick={() => setFields(fields.filter((_, i) => i !== idx))}
              >
                &times;
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="p-2 bg-gray-200 rounded"
          onClick={() => setFields([...fields, { name: '', type: 'string' }])}
        >
          Add Field
        </button>
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Add Collection
        </button>
      </form>
    </div>
  );
}
