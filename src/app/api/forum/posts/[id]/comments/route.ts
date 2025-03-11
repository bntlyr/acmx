import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]/route"
import prisma from "~/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const postId = Number.parseInt(params.id)

  const comments = await prisma.comment.findMany({
    where: { postId, parentId: null },
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
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(comments)
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const postId = Number.parseInt(params.id)
  const json = await request.json()
  const { content, parentId } = json

  const comment = await prisma.comment.create({
    data: {
      content,
      author: { connect: { id: session.user.id } },
      post: { connect: { id: postId } },
      ...(parentId && { parent: { connect: { id: parentId } } }),
    },
    include: {
      author: {
        select: { name: true, image: true, username: true },
      },
    },
  })

  return NextResponse.json(comment)
}

