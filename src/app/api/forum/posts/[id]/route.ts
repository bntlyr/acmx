import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]/route"
import prisma from "~/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: { name: true, image: true, username: true },
      },
      tags: true,
      comments: {
        include: {
          author: {
            select: { name: true, image: true, username: true },
          },
          replies: {
            include: {
              author: {
                select: { name: true, image: true, username: true },
              },
            },
          },
        },
      },
      _count: {
        select: { votes: true },
      },
    },
  })

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  return NextResponse.json(post)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const id = Number.parseInt(params.id)
  const json = await request.json()
  const { title, content, tags } = json

  const post = await prisma.post.update({
    where: { id },
    data: {
      title,
      content,
      tags: {
        set: [],
        connectOrCreate: tags.map((tag: string) => ({
          where: { name: tag },
          create: { name: tag },
        })),
      },
    },
    include: {
      author: {
        select: { name: true, image: true, username: true },
      },
      tags: true,
    },
  })

  return NextResponse.json(post)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const id = Number.parseInt(params.id)

  await prisma.post.delete({ where: { id } })

  return NextResponse.json({ message: "Post deleted successfully" })
}

