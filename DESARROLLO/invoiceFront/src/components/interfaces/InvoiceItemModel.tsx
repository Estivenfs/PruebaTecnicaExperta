export interface InvoiceItemModel {
    invoiceItemId?: number;
    invoiceId?: number;
    productCode: string;
}

export interface AddInvoiceItemsProps {
  invoiceItems: InvoiceItemModel[];
  setInvoiceItems: (value: InvoiceItemModel[]) => void;
}