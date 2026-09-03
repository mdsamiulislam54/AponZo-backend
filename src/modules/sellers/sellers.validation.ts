type BUSINESS_TYPE = "INDIVIDUAL" | "COMPANY" | "PARTNERSHIP";
type SELLER_ADDRESS_TYPE = "PICKUP" | "RETURN" 

export interface ISellerProfileUpdate {
    businessName?: string;
    businessType?: BUSINESS_TYPE;
    
}

export interface ISellerAddress {
    name: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    country: string;
    zipCode: string;
    type: SELLER_ADDRESS_TYPE;
    isDefault?: boolean;
}
