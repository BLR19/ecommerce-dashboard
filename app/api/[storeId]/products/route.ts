import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import prismadb from "@/lib/prismadb"

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { userId } = auth()
        const body = await req.json()

        const { name, price, categoryId, colorId, sizeId, images, isFeatured, isArchived } = body

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }
        if (!name) {
            return new NextResponse("Missing name", { status: 400 })
        }
        if (!price) {
            return new NextResponse("Missing price", { status: 400 })
        }
        if (!params.storeId) {
            return new NextResponse("Missing storeId", { status: 400 })
        }
        if (!categoryId) {
            return new NextResponse("Missing category ID", { status: 400 })
        }
        if (!sizeId) {
            return new NextResponse("Missing size ID", { status: 400 })
        }
        if (!colorId) {
            return new NextResponse("Missing color ID", { status: 400 })
        }

        if (!images || images.length === 0) {
            return new NextResponse("Images are required", { status: 400 })
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            },
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const product = await prismadb.product.create({
            data: {
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                images: {
                    createMany: {
                        data: [...images.map((image: { url: string }) => image)],
                    },
                },
                isFeatured,
                isArchived,
                storeId: params.storeId,
            },
        })

        return NextResponse.json(product)
    } catch (error) {
        console.log("[PRODUCTS_POST]", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {

        const { searchParams } = new URL(req.url)
        const categoryId = searchParams.get("categoryId") || undefined
        const colorId = searchParams.get("colorId") || undefined
        const sizeId = searchParams.get("sizeId") || undefined
        const isFeatured = searchParams.get("isFeatured") || undefined

        if (!params.storeId) {
            return new NextResponse("Missing storeId", { status: 400 })
        }

        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false,
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true,
            },
        })

        return NextResponse.json(products)
    } catch (error) {
        console.log("[PRODUCTS_GET]", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}