'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ContentIndexPage() {
  const [models, setModels] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/models').then(res => res.json()).then(setModels);
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Content</h1>
      <ul className="space-y-2">
        {models.map((m) => (
          <li key={m}>
            <Link className="underline" href={`/admin/content/${m}`}>{m}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
