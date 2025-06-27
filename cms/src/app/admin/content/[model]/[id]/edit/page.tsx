"use client";
import ModelForm from "../../Form";
import { useParams } from 'next/navigation';

export default function EditEntryPage() {
  const params = useParams<{ model: string; id: string }>();
  const model = Array.isArray(params.model) ? params.model[0] : params.model;
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Edit {model}</h1>
      <ModelForm model={model} id={id} />
    </div>
  );
}
