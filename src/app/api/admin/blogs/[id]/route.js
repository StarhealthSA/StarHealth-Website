import { NextResponse } from 'next/server';
import { authenticateRequest, DELETE_ROLES, READ_ROLES, WRITE_ROLES } from '@/lib/firebase/auth';
import { deleteBlog, getBlogById, updateBlog } from '@/lib/content/blogs';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    await authenticateRequest(request, READ_ROLES);
    const { id } = await params;
    const blog = await getBlogById(id);
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function PUT(request, { params }) {
  try {
    await authenticateRequest(request, WRITE_ROLES);
    const { id } = await params;
    const body = await request.json();
    const blog = await updateBlog(id, body);
    return NextResponse.json(blog);
  } catch (error) {
    const status = error.message.includes('not configured') ? 503 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function DELETE(request, { params }) {
  try {
    await authenticateRequest(request, DELETE_ROLES);
    const { id } = await params;
    await deleteBlog(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const status = error.message.includes('permissions') ? 403 : 401;
    return NextResponse.json({ error: error.message }, { status });
  }
}
