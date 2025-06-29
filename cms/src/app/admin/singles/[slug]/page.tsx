'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface SingleType {
  name: string;
  slug: string;
  fields: { name: string; type: string }[];
}

export default function SingleEntryPage() {
  const params = useParams<{ slug: string }>();
  const [singleType, setSingleType] = useState<SingleType | null>(null);
  const [formState, setFormState] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!params.slug) return;
    fetch('/api/singles/types')
      .then((res) => res.json())
      .then((types: SingleType[]) => {
        const t = types.find((tt) => tt.slug === params.slug);
        setSingleType(t || null);
      });
    fetch(`/api/singles/${params.slug}`)
      .then((res) => res.json())
      .then((entry) => {
        const state: Record<string, string> = {};
        Object.entries(entry || {}).forEach(([k, v]) => {
          state[k] = String(v);
        });
        setFormState(state);
      });
  }, [params.slug]);

  async function saveEntry(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!singleType) return;
    const payload: Record<string, unknown> = {};
    singleType.fields.forEach((f) => {
      const value = formState[f.name];
      if (f.type === 'number') payload[f.name] = Number(value);
      else if (f.type === 'boolean') payload[f.name] = value === 'true';
      else payload[f.name] = value;
    });
    await fetch(`/api/singles/${params.slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  }

  if (!singleType) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">{singleType.name}</h1>
      <form onSubmit={saveEntry} className="flex flex-col space-y-2">
        {singleType.fields.map((f) => {
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
              className="border p-2"
              type={f.type === 'number' ? 'number' : 'text'}
              placeholder={f.name}
              value={formState[f.name] || ''}
              onChange={(e) => setFormState({ ...formState, [f.name]: e.target.value })}
              required
            />
          );
        })}
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Save
        </button>
      </form>
    </div>
  );
}
