'use client';
import type { FieldType } from '@/lib/fieldTypes';

export interface Field {
  name: string;
  type: FieldType | string;
}

export interface MediaItem {
  id: string;
  name: string;
}

interface Props {
  field: Field;
  value: string | undefined;
  onChange: (value: string) => void;
  media?: MediaItem[];
}

export default function FieldInput({ field, value, onChange, media = [] }: Props) {
  if (field.type === 'boolean') {
    return (
      <label className="flex items-center space-x-2">
        <span>{field.name}</span>
        <input
          type="checkbox"
          checked={value === 'true'}
          onChange={(e) => onChange(e.target.checked ? 'true' : 'false')}
        />
      </label>
    );
  }

  if (
    field.type === 'richtext' ||
    field.type === 'json' ||
    field.type === 'component' ||
    field.type === 'dynamicZone'
  ) {
    return (
      <textarea
        className="border p-2"
        placeholder={field.name}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (field.type === 'media') {
    return (
      <select
        className="border p-2"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select media</option>
        {media.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === 'relation') {
    return (
      <input
        className="border p-2"
        placeholder={`Related ID for ${field.name}`}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  let inputType = 'text';
  switch (field.type) {
    case 'number':
      inputType = 'number';
      break;
    case 'date':
      inputType = 'date';
      break;
    case 'email':
      inputType = 'email';
      break;
    case 'url':
      inputType = 'url';
      break;
  }
  return (
    <input
      type={inputType}
      className="border p-2"
      placeholder={field.name}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      required
    />
  );
}
