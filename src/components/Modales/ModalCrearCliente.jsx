import { useState } from "react";
import { toast } from "react-toastify";

export const ModalCrearCliente = ({ setDatosCliente, datosCliente }) => {
  const [cliente, setCliente] = useState("");
  const [numeroContrato, setNumeroContrato] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [metrosCuadrados, setMetrosCudrados] = useState("");

  const handleCliente = () => {
    // Crear un nuevo objeto de cliente
    const nuevoCliente = {
      cliente,
      localidad,
      numeroContrato,
      metrosCuadrados,
    };
    // Agregar el nuevo cliente a la lista de clientes
    setDatosCliente([...datosCliente, nuevoCliente]);
    // Limpiar los campos del formulario después de agregar el cliente
    setCliente("");
    setNumeroContrato("");
    setLocalidad("");
    setMetrosCudrados("");

    toast.success("¡Cliente creado correctamente!", {
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

    document.getElementById("my_modal_crear_cliente").close();
  };
  return (
    <dialog id="my_modal_crear_cliente" className="modal">
      <div className="modal-box rounded-md">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg mb-3">Crear nuevo cliente</h3>
        <form className="flex flex-col gap-3" action="">
          <div className="flex flex-col gap-2 max-md:text-sm text-sm">
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
          <div className="flex flex-col gap-2 max-md:text-sm text-sm">
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
          <div className="flex flex-col gap-2 max-md:text-sm text-sm">
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
          </div>{" "}
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
              Crear nuevo cliente
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
