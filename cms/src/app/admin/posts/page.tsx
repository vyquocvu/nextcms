'use client';
import { useEffect, useState } from 'react';

interface Post {
  id: string;
  title: string;
  content: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then(setPosts);
  }, []);

  async function addPost(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    if (res.ok) {
      const post = await res.json();
      setPosts([...posts, post]);
      setTitle('');
      setContent('');
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Posts</h1>
      <ul className="space-y-2 mb-6">
        {posts.map((post) => (
          <li key={post.id}>
            <h2 className="font-semibold">{post.title}</h2>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
      <form onSubmit={addPost} className="flex flex-col space-y-2">
        <input
          className="border p-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="border p-2"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Add Post
        </button>
      </form>
    </div>
  );
}
