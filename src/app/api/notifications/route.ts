import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "20");
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    const where = {
      receiverId: session.user.id,
      ...(unreadOnly && { isRead: false }),
    };

    const notifications = await prisma.notification.findMany({
      where,
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const unreadCount = await prisma.notification.count({
      where: {
        receiverId: session.user.id,
        isRead: false,
      },
    });

    return NextResponse.json({
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        hasMore: notifications.length === limit,
      },
    });
  } catch (error) {
    // console.error("Get notifications error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { receiverId, type, title, content, outreachId } = body;

    const notification = await prisma.notification.create({
      data: {
        senderId: session.user.id,
        receiverId,
        type,
        title,
        content,
        outreachId,
      },
    });

    return NextResponse.json(notification);
  } catch (error) {
    // console.error("[NOTIFICATIONS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
