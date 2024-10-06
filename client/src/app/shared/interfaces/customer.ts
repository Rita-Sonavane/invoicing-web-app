export interface Customer {
    _id?: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
    building?: string;
    addressLine1: string;
    city: string;
    state: string;
    countryCode: string;
    country: string;
    mobile: string;
    fax?: string;
    postalCode: string;
    userId?: any;
    createdAt?: Date;
}
