import { useEffect, useState } from 'react';

export interface MediaItem {
  id: string;
  name: string;
}

export default function useMediaList() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  useEffect(() => {
    fetch('/api/media')
      .then((res) => res.json())
      .then((m) => setMedia(m as MediaItem[]))
      .catch(() => setMedia([]));
  }, []);
  return media;
}
