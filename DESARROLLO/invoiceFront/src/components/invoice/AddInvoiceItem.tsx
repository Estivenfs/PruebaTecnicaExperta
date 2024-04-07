import React, { useState } from 'react'
import { AddInvoiceItemsProps } from '../interfaces/InvoiceItemModel'

export const AddInvoiceItem : React.FC<AddInvoiceItemsProps> = ({
  invoiceItems,
  setInvoiceItems,
}) => {

    const [item, setItem] = useState<string>("");
    const handleAddItem = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
       
        if (!item) return;
        const itemExist = invoiceItems.find((i) => i.productCode === item);
        
        if (itemExist) {
            const modal = new bootstrap.Modal(document.getElementById('exampleModal1') as HTMLElement);
            modal.show();
        } else {
            setInvoiceItems([...invoiceItems, { productCode: item }]);
            setItem("");
        }
    }
  return (
    <>
      <div className="col">
        <div className="card" style={{ width: "18rem" }}>
          <div className="card-body">
            <h5 className="card-title">Agregar</h5>
            <form className="d-flex" role="search" onSubmit={handleAddItem}>
              <input
                className="form-control me-2"
                type="search"
                placeholder="Agregar"
                aria-label="Search"
                id="addInput"
                name="addInput"
                value={item}
                onChange={(e) => setItem(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                Agregar
              </button>
            </form>
            <div
              className="modal fade"
              id="exampleModal1"
              tabIndex={-1}
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">EL PRODUCTO YA FUE AGREGADO</div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
