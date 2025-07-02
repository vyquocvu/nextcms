'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import FieldInput from '@/components/FieldInput';
import useMediaList from '@/hooks/useMediaList';

interface SingleType {
  name: string;
  slug: string;
  fields: { name: string; type: string }[];
}

export default function SingleEntryPage() {
  const params = useParams<{ slug: string }>();
  const [singleType, setSingleType] = useState<SingleType | null>(null);
  const [formState, setFormState] = useState<Record<string, string>>({});
  const media = useMediaList();

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
        {singleType.fields.map((f) => (
          <FieldInput
            key={f.name}
            field={f}
            value={formState[f.name]}
            onChange={(val) => setFormState({ ...formState, [f.name]: val })}
            media={media}
          />
        ))}
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Save
        </button>
      </form>
    </div>
  );
}
