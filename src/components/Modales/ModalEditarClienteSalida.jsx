import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import React from "react";

export const ModalEditarClienteSalida = ({
  setDatosCliente,
  datosCliente,
  usuario,
}) => {
  const [cliente, setCliente] = useState("");
  const [numeroContrato, setNumeroContrato] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [metrosCuadrados, setMetrosCudrados] = useState("");

  useEffect(() => {
    // Buscar el cliente seleccionado dentro de datosCliente
    const clienteEncontrado = datosCliente.find(
      (cliente) => cliente.cliente === usuario
    );

    // Si se encuentra el cliente, establecer los valores de los campos del formulario
    if (clienteEncontrado) {
      setCliente(clienteEncontrado.cliente);
      setNumeroContrato(clienteEncontrado.numeroContrato);
      setLocalidad(clienteEncontrado.localidad);
      setMetrosCudrados(clienteEncontrado.metrosCuadrados);
    }
  }, [usuario, datosCliente]);

  const handleCliente = () => {
    // Crear un nuevo objeto de cliente con los datos actualizados
    const clienteActualizado = {
      cliente,
      localidad,
      numeroContrato,
      metrosCuadrados,
    };

    // Actualizar la lista de clientes con los datos actualizados
    const datosClienteActualizados = datosCliente.map((clienteExistente) => {
      if (clienteExistente.cliente === usuario) {
        return clienteActualizado;
      }
      return clienteExistente;
    });

    toast.success("¡Cliente editado correctamente!", {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      style: {
        padding: "12px",
        borderRadius: "15px",
        fontWeight: "bold",
        textTransform: "uppercase",
      },
    });

    // Actualizar el estado con la lista de clientes actualizada
    setDatosCliente(datosClienteActualizados);

    document.getElementById("my_modal_editar_cliente").close();
  };
  return (
    <dialog id="my_modal_editar_cliente" className="modal ">
      <div className="modal-box rounded-md">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg mb-3">Actualizar el cliente</h3>
        <form className="flex flex-col gap-3 text-sm" action="">
          <div className="flex flex-col gap-2 max-md:text-sm">
            <label className="font-bold" htmlFor="">
              Nombre y Apellido
            </label>
            <input
              onChange={(e) => setCliente(e.target.value)}
              value={cliente}
              placeholder="@NOMBRE Y APELLIDO DEL CLIENTE"
              type="text"
              className="border py-2 px-4 rounded-md border-gray-300 font-medium uppercase outline-none"
            />
          </div>

          <div className="flex flex-col gap-2 max-md:text-sm">
            <label className="font-bold" htmlFor="">
              Localidad
            </label>
            <input
              onChange={(e) => setLocalidad(e.target.value)}
              value={localidad}
              placeholder="Ej: Venado Tuerto, Santa Fe"
              type="text"
              className="border py-2 px-4 rounded-md border-gray-300 font-medium uppercase outline-none"
            />
          </div>

          <div className="flex flex-col gap-2 max-md:text-sm">
            <label className="font-bold" htmlFor="">
              Numero de contrato
            </label>
            <input
              onChange={(e) => setNumeroContrato(e.target.value)}
              value={numeroContrato}
              placeholder="123-500"
              type="text"
              className="border py-2 px-4 rounded-md border-gray-300 font-medium uppercase outline-none"
            />
          </div>

          <div className="flex flex-col gap-2 max-md:text-sm text-sm">
            <label className="font-bold" htmlFor="">
              Metros Cuadrados
            </label>
            <input
              onChange={(e) => setMetrosCudrados(e.target.value)}
              value={metrosCuadrados}
              placeholder="300 mts"
              type="text"
              className="border py-2 px-4 rounded-md border-gray-300 font-medium uppercase outline-none"
            />
          </div>

          <div>
            <button
              type="button"
              onClick={() => {
                handleCliente();
                closeModal();
              }}
              className="py-1.5 px-6 bg-primary hover:shadow-md text-white transition-all rounded-md font-semibold text-sm"
            >
              Actualizar el cliente
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
