type BUSINESS_TYPE = "INDIVIDUAL" | "COMPANY" | "PARTNERSHIP";
type SELLER_ADDRESS_TYPE = "PICKUP" | "RETURN" 

export interface ISellerProfileUpdate {
    businessName?: string;
    businessType?: BUSINESS_TYPE;
    
}


