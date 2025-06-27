'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface ContentType {
  name: string;
  fields: { name: string }[];
}

export default function ContentTypePage() {
  const params = useParams();
  const type = Array.isArray(params.type) ? params.type[0] : (params.type as string);
  const [contentType, setContentType] = useState<ContentType | null>(null);
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [formState, setFormState] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch(`/api/content-types/${type}`)
      .then((res) => res.json())
      .then(setContentType);
    fetch(`/api/content-types/${type}/items`)
      .then((res) => res.json())
      .then(setItems);
  }, [type]);

  async function addItem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await fetch(`/api/content-types/${type}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formState),
    });
    if (res.ok) {
      const item = await res.json();
      setItems([...items, item]);
      setFormState({});
    }
  }

  if (!contentType) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">{contentType.name} Items</h1>
      <ul className="space-y-2 mb-6">
        {items.map((item) => (
          <li key={String(item.id)} className="border p-2 rounded">
            {contentType.fields.map((f) => (
              <p key={f.name}>
                <strong>{f.name}: </strong>
                {String(item[f.name] ?? '')}
              </p>
            ))}
          </li>
        ))}
      </ul>
      <form onSubmit={addItem} className="flex flex-col space-y-2">
        {contentType.fields.map((f) => (
          <input
            key={f.name}
            className="border p-2"
            placeholder={f.name}
            value={formState[f.name] || ''}
            onChange={(e) => setFormState({ ...formState, [f.name]: e.target.value })}
            required
          />
        ))}
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">Add Item</button>
      </form>
    </div>
  );
}
