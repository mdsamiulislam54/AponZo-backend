import status from "http-status";
import { InventoryQueryDTO } from "../products.validation";
import { prisma } from "../../../lib/prisma";
import { AppError } from "../../../middlewares/appErrors";

import { Prisma } from "../../../generated/client";
import { IQueryParams } from "../../../type/QueryParamsType";
import { QueryBuilder } from "../../../utils/QueryBuilder";
// getInventory()	সব প্রোডাক্টের inventory দেখা
// getInventoryByProductId()	নির্দিষ্ট প্রোডাক্টের সব variant-এর stock দেখা
// getVariantStock()	নির্দিষ্ট variant-এর বর্তমান stock দেখা
// adjustStock()	স্টক বাড়ানো বা কমানো
// addStock()	নতুন stock যোগ করা
// removeStock()	ক্ষতি, correction বা অন্য কারণে stock কমানো
// getLowStockProducts()	নির্ধারিত সীমার নিচে থাকা stock খোঁজা
// getOutOfStockProducts()	যেসব variant-এর stock শূন্য, সেগুলো খোঁজা
// getInventorySummary()	মোট variant, in-stock, low-stock ও out-of-stock-এর হিসাব
// getStockMovements()	stock কখন, কত এবং কেন পরিবর্তিত হয়েছে, তা দেখা

const getInventory = async (userId: string, query: IQueryParams) => {
    console.log("service", query)
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            seller: {
                select: {
                    Store: {
                        select: {
                            id: true,
                        },
                    },
                },
            },
        },
    });
    const storeId = user?.seller?.Store?.id;

    if (!storeId) { throw new AppError(status.FORBIDDEN, "User is not a seller or does not have a store"); }

    const builder = new QueryBuilder({}, query)
        .search(["sku", "color", "size"])
        .filter()
        .sort()
        .paginate()


    const [inventory, total] = await Promise.all([
        prisma.products_Variant.findMany({
            take: builder.query.take,
            skip: builder.query.skip,
            where: {
                product: {
                    is: {
                        storeId,
                    }
                },
                ...builder.query.where,
            },
            orderBy: builder.query.orderBy,
        }),

        prisma.products_Variant.count({
            where:{
               ...builder.query.where,
            },
        }),
    ]);

    const meta = await builder.getMeta(prisma.products_Variant)
    return {
        data: inventory,
        meta,
    }


}


export const inventorService = {
    getInventory,
}