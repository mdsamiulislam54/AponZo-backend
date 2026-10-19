import status from "http-status";
import { InventoryQueryDTO} from "../products.validation";
import { prisma } from "../../../lib/prisma";
import { AppError } from "../../../middlewares/appErrors";

import { Prisma } from "../../../generated/client";
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

const getInventory = async (userId: string, query: InventoryQueryDTO) => {
    const { limit, skip, search, sortBy, stockStatus, order } = query
    console.log("service",query)
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

    const validOrder = order === "asc" ? "asc" : "desc"
  const where: Prisma.Products_VariantWhereInput = {
  product: {
    is: {
      storeId,
    },
  },

  ...(stockStatus ? { stockStatus } : {}),

  ...(search
    ? {
        OR: [
          {
            sku: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            color: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            size: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }
    : {}),
};
    const [inventory, total] = await Promise.all([
        prisma.products_Variant.findMany({
            take: limit,
            skip,
            where,
            orderBy: {
                [sortBy || "createdAt"]: validOrder,
            },
        }),

        prisma.products_Variant.count({
            where,
        }),
    ]);

    return {
        data: inventory,
        meta: {
            total,
            limit,
            page: Math.floor(skip / limit) + 1,
            totalPage: Math.ceil(total / limit),
        }
    }


}


export const inventorService = {
    getInventory,
}