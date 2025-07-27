import {NextRequest, NextResponse} from "next/server";
import {parseOrNull, randomID} from "@/utils/utils";
import {prisma} from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const url = formData.get("url") as string || null
  if (!url) {
    return NextResponse.json({ "error": true,  "message": "No url specified"}, { status: 400 })
  }
  const parsed = parseOrNull(url)
  if (!parsed) {
    return NextResponse.json({ "error": true,  "message": "URL is too long or invalid"}, { status: 400 })
  }

  const encoded = encodeURI(parsed)
  try {
    const value = await prisma.urlData.findFirstOrThrow({ where: { url: encoded } })
    return NextResponse.json({ "error": false, "message": `${req.nextUrl.origin}/${value.id}` }, { status: 200 })
  } catch {
    //ignored
  }

  let length = 5
  let id = randomID(length)
  let countAttempted = 0
  while (true) {
    try {
      await prisma.urlData.findUniqueOrThrow({ where: { id } })
    } catch {
      break
    }

    id = randomID(length)

    countAttempted++
    if (countAttempted % 5 == 0)
      length++
  }

  await prisma.urlData.create({
    data: {
      id: id,
      url: encoded,
    },
  }).then(value => {
    return NextResponse.json({ "error": false, "message": `${req.nextUrl.origin}/${value.id}` }, { status: 200 })
  }).catch(() => {
    return NextResponse.json({ "error": true, "message": `Database error` }, { status: 200 })
  })

  return NextResponse.json({ "error": false, "message": `${req.nextUrl.origin}/${id}` }, { status: 200 })
}