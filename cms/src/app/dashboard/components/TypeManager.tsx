'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export interface TypeItem {
  name: string;
  slug: string;
}

export interface FieldData {
  name: string;
  type: string;
}

interface Option {
  value: string;
  label: string;
}

interface TypeManagerProps {
  title: string;
  listUrl: string;
  postUrl: string;
  entryLink?: (slug: string) => string;
  deleteUrl?: (slug: string) => string;
  fieldOptions?: Option[];
  addButtonLabel?: string;
}

const DEFAULT_OPTIONS: Option[] = [
  { value: 'string', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
];

export default function TypeManager({
  title,
  listUrl,
  postUrl,
  entryLink,
  deleteUrl,
  fieldOptions = DEFAULT_OPTIONS,
  addButtonLabel = 'Add Type',
}: TypeManagerProps) {
  const [types, setTypes] = useState<TypeItem[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [fields, setFields] = useState<FieldData[]>([{ name: '', type: 'string' }]);

  useEffect(() => {
    fetch(listUrl)
      .then((res) => res.json())
      .then(setTypes);
  }, [listUrl]);

  async function addType(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const sanitized = fields
      .filter((f) => f.name.trim())
      .map((f) => ({ name: f.name.trim(), type: f.type }));
    const res = await fetch(postUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug, fields: sanitized }),
    });
    if (res.ok) {
      const type = await res.json();
      setTypes([...types, type]);
      setName('');
      setSlug('');
      setFields([{ name: '', type: 'string' }]);
    }
  }

  async function remove(slugToDelete: string) {
    if (!deleteUrl) return;
    await fetch(deleteUrl(slugToDelete), { method: 'DELETE' });
    setTypes((prev) => prev.filter((t) => t.slug !== slugToDelete));
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">{title}</h1>
      <ul className="space-y-2 mb-6">
        {types.map((t) => (
          <li key={t.slug} className={deleteUrl ? 'flex items-center space-x-2' : undefined}>
            {entryLink ? (
              <Link className="underline flex-1" href={entryLink(t.slug)}>
                {t.name}
              </Link>
            ) : (
              <span className="flex-1">{t.name}</span>
            )}
            {deleteUrl && (
              <button type="button" className="text-red-500" onClick={() => remove(t.slug)}>
                Delete
              </button>
            )}
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
              {fieldOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
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
          {addButtonLabel}
        </button>
      </form>
    </div>
  );
}
