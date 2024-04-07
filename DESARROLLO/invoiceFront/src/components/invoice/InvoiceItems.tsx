import React, { useEffect } from "react";
import { AddInvoiceItemsProps } from "../interfaces/InvoiceItemModel";




export const InvoiceItems: React.FC<AddInvoiceItemsProps> = ({
  invoiceItems,
  setInvoiceItems,
}) => {

    // useEffect(() => {
        
    //     setInvoiceItems([
    //         {
    //             productCode: "1234"
    //         },
    //         {
    //             productCode: "5678"
    //         },
    //         {
    //             productCode: "91011"
    //         }
    //     ]);
    // }, [])


  const handleDeleteItem = (index: number) => {
    const updatedItems = invoiceItems.filter((_, i) => i !== index);
    setInvoiceItems(updatedItems);
  };

    

  return (
    <>
      
        <div className="col">
          <div className="card" style={{ width: "40rem" }}>
            <div className="card-body">
              {invoiceItems.length === 0 ? (
                <p>No hay items agregados</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Código</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceItems.map((item, index) => (
                      <tr key={index}>
                        <th scope="row">{item.productCode}</th>
                        <td>
                          <div className="btn-group">
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDeleteItem(index)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      
    </>
  );
};
