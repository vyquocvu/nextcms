/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Field {
  name: string;
  type: string;
  relationModel?: string;
}

interface Schema {
  name: string;
  fields: Field[];
}

export default function ModelForm({ model, id }: { model: string; id?: string }) {
  const router = useRouter();
  const [schema, setSchema] = useState<Schema | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [relations, setRelations] = useState<Record<string, any[]>>({});

  useEffect(() => {
    fetch(`/api/models/${model}/schema`).then(res => res.json()).then(async (s) => {
      setSchema(s);
      for (const f of s.fields) {
        if (f.relationModel) {
          const res = await fetch(`/api/models/${f.relationModel}`);
          const items = await res.json();
          setRelations(r => ({ ...r, [f.name]: items }));
        }
      }
    });
    if (id) {
      fetch(`/api/models/${model}/${id}`).then(res => res.json()).then(data => setFormData(data));
    }
  }, [model, id]);

  function updateField(name: string, value: any) {
    setFormData({ ...formData, [name]: value });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await fetch(`/api/models/${model}${id ? '/' + id : ''}`, {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) router.push(`/admin/content/${model}`);
  }

  if (!schema) return <p>Loading...</p>;

  return (
    <form onSubmit={onSubmit} className="flex flex-col space-y-4">
      {schema.fields.map((field) => {
        const value = formData[field.name] ?? '';
        if (field.relationModel) {
          const opts = relations[field.name] || [];
          return (
            <select
              key={field.name}
              value={value}
              onChange={(e) => updateField(field.name, e.target.value)}
              className="border p-2"
            >
              <option value="">Select {field.name}</option>
              {opts.map((o) => (
                <option key={o.id} value={o.id}>{o.id}</option>
              ))}
            </select>
          );
        }
        switch (field.type) {
          case 'Int':
            return (
              <input
                key={field.name}
                type="number"
                className="border p-2"
                value={value}
                onChange={(e) => updateField(field.name, Number(e.target.value))}
              />
            );
          case 'Boolean':
            return (
              <label key={field.name} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={Boolean(value)}
                  onChange={(e) => updateField(field.name, e.target.checked)}
                />
                <span>{field.name}</span>
              </label>
            );
          case 'DateTime':
            return (
              <input
                key={field.name}
                type="datetime-local"
                className="border p-2"
                value={value}
                onChange={(e) => updateField(field.name, e.target.value)}
              />
            );
          case 'Json':
            return (
              <textarea
                key={field.name}
                className="border p-2"
                value={value}
                onChange={(e) => updateField(field.name, e.target.value)}
              />
            );
          default:
            // treat as string
            return (
              <input
                key={field.name}
                type="text"
                className="border p-2"
                value={value}
                onChange={(e) => updateField(field.name, e.target.value)}
              />
            );
        }
      })}
      <button type="submit" className="p-2 bg-blue-500 text-white rounded">
        {id ? 'Update' : 'Create'}
      </button>
    </form>
  );
}
