import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "./../../auth/[...nextauth]/route"
import prisma from "~/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const search = searchParams.get("search") || undefined
  const tag = searchParams.get("tag") || undefined

  const where = {
    published: true,
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(tag && {
      tags: {
        some: {
          name: tag,
        },
      },
    }),
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        author: {
          select: { name: true, image: true, username: true },
        },
        tags: true,
        _count: {
          select: { comments: true, votes: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.post.count({ where }),
  ])

  return NextResponse.json({
    posts,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const json = await request.json()
  const { title, content, tags } = json

  const post = await prisma.post.create({
    data: {
      title,
      content,
      author: { connect: { id: session.user.id } },
      tags: {
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

