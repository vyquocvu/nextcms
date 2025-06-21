'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Entry {
  id: string;
  [key: string]: unknown;
}

interface CollectionType {
  name: string;
  slug: string;
  fields: { name: string; type: string }[];
}

export default function CollectionEntriesPage() {
  const params = useParams<{ slug: string }>();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [collectionType, setCollectionType] = useState<CollectionType | null>(null);
  const [formState, setFormState] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!params.slug) return;
    fetch('/api/collections/types')
      .then((res) => res.json())
      .then((types: CollectionType[]) => {
        const type = types.find((t) => t.slug === params.slug);
        setCollectionType(type || null);
      });
    fetch(`/api/collections/${params.slug}`)
      .then((res) => res.json())
      .then(setEntries);
  }, [params.slug]);

  async function addEntry(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!collectionType) return;
    const payload: Record<string, unknown> = {};
    collectionType.fields.forEach((f) => {
      const value = formState[f.name];
      if (f.type === 'number') {
        payload[f.name] = Number(value);
      } else if (f.type === 'boolean') {
        payload[f.name] = value === 'true';
      } else {
        payload[f.name] = value;
      }
    });
    const res = await fetch(`/api/collections/${params.slug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const entry = await res.json();
      setEntries([...entries, entry]);
      setFormState({});
    }
  }

  if (!collectionType) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Entries: {collectionType.name}</h1>
      <ul className="space-y-2 mb-6">
        {entries.map((entry) => (
          <li key={entry.id} className="border p-2 rounded">
            {collectionType.fields.map((f) => (
              <p key={f.name}>
                <strong>{f.name}: </strong>
                {String(entry[f.name] ?? '')}
              </p>
            ))}
          </li>
        ))}
      </ul>
      <form onSubmit={addEntry} className="flex flex-col space-y-2">
        {collectionType.fields.map((f) => {
          if (f.type === 'boolean') {
            return (
              <label key={f.name} className="flex items-center space-x-2">
                <span>{f.name}</span>
                <input
                  type="checkbox"
                  checked={formState[f.name] === 'true'}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      [f.name]: e.target.checked ? 'true' : 'false',
                    })
                  }
                />
              </label>
            );
          }
          return (
            <input
              key={f.name}
              type={f.type === 'number' ? 'number' : 'text'}
              className="border p-2"
              placeholder={f.name}
              value={formState[f.name] || ''}
              onChange={(e) =>
                setFormState({ ...formState, [f.name]: e.target.value })
              }
              required
            />
          );
        })}
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Add Entry
        </button>
      </form>
    </div>
  );
}
