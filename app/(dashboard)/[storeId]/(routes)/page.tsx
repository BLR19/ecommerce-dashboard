import getGraphRevenue from "@/actions/get-dashboard-graph"
import { getSalesCount, getStockCount, getTotalRevenue } from "@/actions/get-dashboard-stats"
import Overview from "@/components/overview"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Heading from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import prismadb from "@/lib/prismadb"
import { formatter } from "@/lib/utils"
import { CreditCard, DollarSign, Package } from "lucide-react"

interface DashboardPageProps {
    params: {
        storeId: string
    }
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
    // const store = await prismadb.store.findFirst({
    //     where: {
    //         id: params.storeId,
    //     },
    // })

    const totalRevenue = await getTotalRevenue(params.storeId)
    const salesCount =  await getSalesCount(params.storeId)
    const stockCount = await getStockCount(params.storeId)
    const graphRevenue = await getGraphRevenue(params.storeId)

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Heading title="Dashboard" description="Overview of your store" />
                <Separator />
                <div className="grid gap-4 grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex justify-between w-full">
                                Total Revenue
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatter.format(totalRevenue)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex justify-between w-full">
                                <p>Sales</p>
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+{salesCount}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex justify-between w-full">
                                Products In Stock
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stockCount}</div>
                        </CardContent>
                    </Card>
                </div>
                <Card className="col-span-4">
                        <CardHeader className="flex items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <Overview data={graphRevenue} />
                        </CardContent>
                    </Card>

            </div>
        </div>
    )
}

export default DashboardPage
