"use client";
import ModelForm from '../Form';
import { useParams } from 'next/navigation';

export default function NewEntryPage() {
  const params = useParams<{ model: string }>();
  const model = Array.isArray(params.model) ? params.model[0] : params.model;
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">New {model}</h1>
      <ModelForm model={model} />
    </div>
  );
}
