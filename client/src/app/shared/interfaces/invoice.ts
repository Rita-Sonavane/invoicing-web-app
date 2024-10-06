export interface Invoice {
    _id?: string;
    dueDate: Date;
    items: any;
    rates: string;
    taxRate?: number;
    vat?: number;
    total: number;
    subTotal: number;
    notes?: string;
    status?: string;
    invoiceNumber: number;
    type?: string;
    creator: any;
    totalAmountReceived: number;
    client: any;
    paymentRecords?: any;
    createdAt?: Date;
}

