import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]/route"
import prisma from "~/lib/prisma"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const postId = Number.parseInt(params.id)
  const json = await request.json()
  const { type } = json

  const vote = await prisma.vote.upsert({
    where: {
      userId_postId: {
        userId: session.user.id,
        postId,
      },
    },
    update: { type },
    create: {
      type,
      user: { connect: { id: session.user.id } },
      post: { connect: { id: postId } },
    },
  })

  return NextResponse.json(vote)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const postId = Number.parseInt(params.id)

  await prisma.vote.delete({
    where: {
      userId_postId: {
        userId: session.user.id,
        postId,
      },
    },
  })

  return NextResponse.json({ message: "Vote removed successfully" })
}

