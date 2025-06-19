import { addPost, getPosts } from '@/lib/posts';
import { NextResponse } from 'next/server';

export async function GET() {
  const posts = await getPosts();
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.title || !body.content) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const post = await addPost({ title: body.title, content: body.content });
  return NextResponse.json(post, { status: 201 });
}
