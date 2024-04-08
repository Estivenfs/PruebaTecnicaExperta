import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { CustomerModel } from "../interfaces/CustomerModel";

interface SelectCustomerProps {
  title?: string;
  options: CustomerModel[];
  setSelected: (value: string) => void;
  getCustomers: () => void;
  selected: string;
}

export const SelectCustomer: React.FC<SelectCustomerProps> = ({
  title = "Seleccione",
  options,
  setSelected,
  getCustomers,
  selected,
}) => {

  useEffect(() => {
    if (selected === "0") {
      // selectCustomer a opcion con valor 0
      const selectCustomer = document.getElementById("selectCustomer") as HTMLSelectElement;
      selectCustomer.selectedIndex = 0;
    }
  }, [selected]);



  const {
    register,
    handleSubmit,
    formState: { errors }, // Accedemos a los errores del formulario
    reset,
  } = useForm<CustomerModel>();


  const onSubmit: SubmitHandler<CustomerModel> = async (data) => {
    try {
      const response = await fetch("https://localhost:5001/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      if (res) {
        getCustomers();
        reset(); // Limpiar formulario
        const modal = document.getElementById("customerModal");
        const modalInstance = bootstrap.Modal.getInstance(modal!);
        modalInstance.hide();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="col" style={{ margin: "20px" }}>
        <div className="card" style={{ width: "18rem", margin: "15px" }}>
          <div className="card-body row">
            <div className="col-9">
              <h5 className="card-title">{title}</h5>
              <select
                className="form-select"
                aria-label="Default select example"
                onChange={(e) => setSelected(e.target.value)}
                id="selectCustomer"
              >
                <option value="0">Seleccionar</option>
                {options.length>0 && options.map((option) => (
                  <option key={option.customerId} value={option.customerId}>
                    {option.lastName + ", " + option.firstName}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-3 mt-4 p-2">
              <button
                type="button"
                className="btn btn-primary align-self-end"
                data-bs-toggle="modal"
                data-bs-target="#customerModal"
                data-bs-whatever="@mdo"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <div
        className="modal fade"
        id="customerModal"
        tabIndex={-1}
        aria-labelledby="customerModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="customerModalLabel">
                Nuevo Cliente
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label htmlFor="client-name" className="col-form-label">
                    Nombre
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="client-name"
                    {...register("firstName", { required: "Campo requerido" })}
                  />
                  {errors.firstName && (
                    <span className="text-danger">
                      {errors.firstName.message}
                    </span>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="client-lastname" className="col-form-label">
                    Apellido
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="client-lastname"
                    {...register("lastName", { required: "Campo requerido" })}
                  />
                  {errors.lastName && (
                    <span className="text-danger">
                      {errors.lastName.message}
                    </span>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="client-adress" className="col-form-label">
                    Domicilio
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="client-adress"
                    {...register("address", { required: "Campo requerido" })}
                  />
                  {errors.address && (
                    <span className="text-danger">
                      {errors.address.message}
                    </span>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cerrar
                  </button>
                  <input
                    type="submit"
                    className="btn btn-primary"
                    value="Agregar"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
