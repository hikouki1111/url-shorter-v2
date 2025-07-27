import {NextRequest, NextResponse} from 'next/server'
import {prisma} from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { slug: string[] } }) {
    const slug = params.slug || []

    if (slug.length === 0) {
        return NextResponse.redirect(req.nextUrl.origin)
    }

    const id = slug[0]
    const result = await prisma.urlData.findUnique({ where: { id } })

    return NextResponse.redirect(result ? result.url : req.nextUrl.origin)
}