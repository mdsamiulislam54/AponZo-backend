

type Store_Status = "ACTIVE" | "INACTIVE" | "DRAFT" | "SUSPENDED" | "BANDED";
type Stores_Type = "PHYSICAL" | "ONLINE" | "INDIVIDUAL";
export interface IStoresCreate {
    name: string;
    slug?: string;
    description?: string;
    logo?: string;
    banner?: string;
    type?: Stores_Type;
    status?: Store_Status;
    isVerified?: boolean;
    rating?: number;
    totalReviews?: number;
    totalOrders?: number;
    totalProducts?: number;
    totalSoldItems?: number;
    insideDeliveryFee?: number;
    outsideDeliveryFee?: number;
    insideDeliveryDay?: number;
    outsideDeliveryDay?: number;
    totalSales?: number;
}

export interface IStoresUpdate {
    name?: string;
    slug?: string;
    description?: string;
    logo?: string;
    banner?: string;
    type?: Stores_Type;
    status?: Store_Status;
    insideDeliveryFee?: number;
    outsideDeliveryFee?: number;
    insideDeliveryDay?: number;
    outsideDeliveryDay?: number;
}