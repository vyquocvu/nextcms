'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ContentType {
  name: string;
  fields: { name: string }[];
}

export default function ContentTypesPage() {
  const [types, setTypes] = useState<ContentType[]>([]);
  const [name, setName] = useState('');
  const [fields, setFields] = useState('');

  useEffect(() => {
    fetch('/api/content-types').then((res) => res.json()).then(setTypes);
  }, []);

  async function addType(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await fetch('/api/content-types', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        fields: fields.split(',').map((f) => ({ name: f.trim() })).filter((f) => f.name),
      }),
    });
    if (res.ok) {
      const type = await res.json();
      setTypes([...types, type]);
      setName('');
      setFields('');
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Content Types</h1>
      <ul className="space-y-2 mb-6">
        {types.map((t) => (
          <li key={t.name}>
            <Link className="underline" href={`/dashboard/content-types/${t.name}`}>{t.name}</Link>
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
          placeholder="Fields (comma separated)"
          value={fields}
          onChange={(e) => setFields(e.target.value)}
          required
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">Add Type</button>
      </form>
    </div>
  );
}
