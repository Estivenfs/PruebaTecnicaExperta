import { useEffect, useState } from "react"
import { SelectCustomer } from "./SelectCustomer"
import { CustomerModel } from "../interfaces/CustomerModel"
import { InvoiceItems } from "./InvoiceItems";
import { InvoiceItemModel } from "../interfaces/InvoiceItemModel";
import { AddInvoiceItem } from "./AddInvoiceItem";


export const InvoiceHome = () => {
  const initCustomer = [{
    customerId: 0,
    firstName: "",
    lastName: "",
    address: ""
  }];
  const [customers, setCustomers] = useState<CustomerModel[]>(initCustomer);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("0");
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItemModel[]>([]);

  const getCustomers = async () => {
    const res = await fetch("https://localhost:5001/api/customers");
    const data = await res.json();
    setCustomers(data);
  }

 

  useEffect(() => {
    getCustomers();
  }, [])
  const sendInvoice = async () => {
    if (!selectedCustomer || selectedCustomer==="0") {
      alert("Seleccione un cliente");
      return;
    }
    if (invoiceItems.length === 0) {
      alert("Agregue items a la factura");
      return;
    }
    try {
      const res = await fetch("https://localhost:5001/api/invoice/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: parseInt(selectedCustomer),
          invoiceItem: invoiceItems,
        }),
      });
      const data = await res.json();
      console.log(data);
      setInvoiceItems([]);
      setSelectedCustomer("0");

    } catch (error) {
      console.log(error);
      
    }
    
  }

  return (
    <div className="container text-center mt-5 pt-3">
      <SelectCustomer
        title="Seleccione Cliente"
        options={customers}
        setSelected={setSelectedCustomer}
        getCustomers={getCustomers}
        selected={selectedCustomer}
      />
      <div className="row" style={{ margin: "20px" }}>
        <InvoiceItems
          setInvoiceItems={setInvoiceItems}
          invoiceItems={invoiceItems}
        />
        <AddInvoiceItem
          setInvoiceItems={setInvoiceItems}
          invoiceItems={invoiceItems}
        />
      </div>
      <div className="row">
        <div className="col">
          <div className="card-post">
            <div className="card-body">
              <button
                type="button"
                className="btn btn-primary"
                onClick={sendInvoice}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
