import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'posts.json');

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

async function readPosts(): Promise<Post[]> {
  try {
    const data = await readFile(DATA_PATH, 'utf8');
    return JSON.parse(data) as Post[];
  } catch {
    return [];
  }
}

async function writePosts(posts: Post[]) {
  await writeFile(DATA_PATH, JSON.stringify(posts, null, 2));
}

export async function getPosts() {
  return readPosts();
}

export async function addPost(post: Omit<Post, 'id' | 'createdAt'>) {
  const posts = await readPosts();
  const newPost: Post = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    ...post,
  };
  posts.push(newPost);
  await writePosts(posts);
  return newPost;
}
