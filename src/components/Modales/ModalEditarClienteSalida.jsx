import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const ModalEditarClienteSalida = ({
  isOpen,
  closeModal,
  setDatosCliente,
  datosCliente,
  usuario,
}) => {
  const [cliente, setCliente] = useState("");
  const [numeroContrato, setNumeroContrato] = useState("");
  const [localidad, setLocalidad] = useState("");

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
    }
  }, [usuario, datosCliente]);

  const handleCliente = () => {
    // Crear un nuevo objeto de cliente con los datos actualizados
    const clienteActualizado = { cliente, localidad, numeroContrato };

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

    // Cerrar el modal después de editar el cliente
    closeModal();
  };

  return (
    <Menu as="div" className="z-50">
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-10" />
          </Transition.Child>

          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-[500px] max-md:w-full p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-none">
                <div className="flex justify-end cursor-pointer">
                  <p
                    onClick={closeModal}
                    className="text-red-700 bg-red-100 py-2 px-2 rounded-xl"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </p>
                </div>

                <div className="text-sm text-slate-700 mb-3 uppercase font-bold max-md:uppercase max-md:text-sm">
                  Editar el cliente
                </div>
                <form
                  className="flex flex-col gap-3 uppercase text-sm"
                  action=""
                >
                  <div className="flex flex-col gap-2 max-md:text-sm">
                    <label htmlFor="">Nombre y Apellido</label>
                    <input
                      onChange={(e) => setCliente(e.target.value)}
                      value={cliente}
                      placeholder="@NOMBRE Y APELLIDO DEL CLIENTE"
                      type="text"
                      className="bg-white border border-blue-500 py-2 px-3 font-semibold uppercase outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-2 max-md:text-sm">
                    <label htmlFor="">Localidad</label>
                    <input
                      onChange={(e) => setLocalidad(e.target.value)}
                      value={localidad}
                      placeholder="Ej: Venado Tuerto, Santa Fe"
                      type="text"
                      className="bg-white border border-blue-500 py-2 px-3 font-semibold uppercase outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-2 max-md:text-sm">
                    <label htmlFor="">Numero de contrato</label>
                    <input
                      onChange={(e) => setNumeroContrato(e.target.value)}
                      value={numeroContrato}
                      placeholder="123-500"
                      type="text"
                      className="bg-white border border-blue-500 py-2 px-3 font-semibold uppercase outline-none"
                    />
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        handleCliente();
                        closeModal();
                      }}
                      className="py-1.5 px-6 bg-blue-500 hover:bg-orange-500 text-white transition-all rounded-full font-semibold text-sm"
                    >
                      Actualizar el cliente
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Menu>
  );
};
