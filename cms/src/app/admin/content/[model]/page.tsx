/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import LinkComp from 'next/link';

export default function ModelListPage() {
  const params = useParams<{ model: string }>();
  const model = Array.isArray(params.model) ? params.model[0] : params.model;
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/models/${model}`).then((res) => res.json()).then(setItems);
  }, [model]);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">{model} Entries</h1>
      <LinkComp href={`/admin/content/${model}/new`} className="underline">
        New {model}
      </LinkComp>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item.id} className="border p-2 rounded">
            {JSON.stringify(item)}{' '}
            <LinkComp href={`/admin/content/${model}/${item.id}/edit`} className="underline">
              Edit
            </LinkComp>
          </li>
        ))}
      </ul>
    </div>
  );
}
