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
  const [editing, setEditing] = useState<Entry | null>(null);

  useEffect(() => {
    if (!params.slug) return;
    fetch(`/api/collections/types/${params.slug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((type: CollectionType | null) => {
        setCollectionType(type);
      });
    fetch(`/api/collections/${params.slug}`)
      .then((res) => res.json())
      .then(setEntries);
  }, [params.slug]);

  function startEdit(entry: Entry) {
    if (!collectionType) return;
    const state: Record<string, string> = {};
    collectionType.fields.forEach((f) => {
      const value = entry[f.name];
      state[f.name] = value !== undefined ? String(value) : '';
    });
    setEditing(entry);
    setFormState(state);
  }

  async function deleteEntryById(id: string) {
    await fetch(`/api/collections/${params.slug}/${id}`, { method: 'DELETE' });
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  async function saveEntry(e: React.FormEvent<HTMLFormElement>) {
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

    if (editing) {
      const res = await fetch(
        `/api/collections/${params.slug}/${editing.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      if (res.ok) {
        const updated = await res.json();
        setEntries(entries.map((e) => (e.id === updated.id ? updated : e)));
        setEditing(null);
        setFormState({});
      }
    } else {
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
            <button
              type="button"
              className="mt-2 text-blue-500"
              onClick={() => startEdit(entry)}
            >
              Edit
            </button>
            <button
              type="button"
              className="mt-2 ml-2 text-red-500"
              onClick={() => deleteEntryById(entry.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={saveEntry} className="flex flex-col space-y-2">
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
          let inputType = 'text';
          switch (f.type) {
            case 'number':
              inputType = 'number';
              break;
            case 'date':
              inputType = 'date';
              break;
            case 'email':
              inputType = 'email';
              break;
            case 'url':
              inputType = 'url';
              break;
          }
          return (
            <input
              key={f.name}
              type={inputType}
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
        <div className="flex space-x-2">
          {editing && (
            <button
              type="button"
              className="p-2 bg-gray-200 rounded"
              onClick={() => {
                setEditing(null);
                setFormState({});
              }}
            >
              Cancel
            </button>
          )}
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">
            {editing ? 'Update Entry' : 'Add Entry'}
          </button>
        </div>
      </form>
    </div>
  );
}
