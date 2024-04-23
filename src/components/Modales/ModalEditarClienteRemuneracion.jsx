import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const ModalEditarClienteRemuneracion = ({
  isOpen,
  closeModal,
  setDatosCliente,
  datosCliente,
  usuario,
}) => {
  const [cliente, setCliente] = useState("");
  const [numeroContrato, setNumeroContrato] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [metrosCuadrados, setMetrosCuadrados] = useState("");
  const [totalFlete, setTotalFlete] = useState("");

  useEffect(() => {
    // Buscar el cliente seleccionado dentro de datosCliente
    const clienteEncontrado = datosCliente.find(
      (cliente) => cliente.cliente === usuario
    );

    // Si se encuentra el cliente, establecer los valores de los campos del formulario
    if (clienteEncontrado) {
      setCliente(clienteEncontrado.cliente);
      setNumeroContrato(clienteEncontrado.numeroContrato);
      setMetrosCuadrados(clienteEncontrado.metrosCuadrados);
      setTotalFlete(clienteEncontrado.totalFlete);
      setLocalidad(clienteEncontrado.localidad);
    }
  }, [usuario, datosCliente]);

  const handleCliente = () => {
    // Crear un nuevo objeto de cliente con los datos actualizados
    const clienteActualizado = {
      cliente,
      localidad,
      numeroContrato,
      metrosCuadrados,
      totalFlete,
      localidad,
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
            <div className="fixed inset-0 bg-black bg-opacity-25" />
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
              <div className="inline-block w-[500px] max-md:w-full p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="text-lg text-slate-700 mb-3 border-b-[1px] capitalize max-md:text-sm max-md:uppercase">
                  Editar el cliente
                </div>
                <form className="flex flex-col gap-3" action="">
                  <div className="flex flex-col gap-2 max-md:text-sm">
                    <label htmlFor="">Nombre y Apellido</label>
                    <input
                      onChange={(e) => setCliente(e.target.value)}
                      value={cliente}
                      placeholder="@NOMBRE Y APELLIDO DEL CLIENTE"
                      type="text"
                      className="bg-white rounded-xl py-2 px-2 border-slate-300 border-[1px]"
                    />
                  </div>

                  <div className="flex flex-col gap-2 max-md:text-sm">
                    <label htmlFor="">Localidad</label>
                    <input
                      onChange={(e) => setLocalidad(e.target.value)}
                      value={localidad}
                      placeholder="Ej: Venado Tuerto, Santa Fe"
                      type="text"
                      className="bg-white rounded-xl py-2 px-2 border-slate-300 border-[1px]"
                    />
                  </div>

                  <div className="flex flex-col gap-2 max-md:text-sm">
                    <label htmlFor="">Numero de contrato</label>
                    <input
                      onChange={(e) => setNumeroContrato(e.target.value)}
                      value={numeroContrato}
                      placeholder="123-500"
                      type="text"
                      className="bg-white rounded-xl py-2 px-2 border-slate-300 border-[1px]"
                    />
                  </div>

                  <div className="flex flex-col gap-2 max-md:text-sm">
                    <label htmlFor="">Metros Cuadrados</label>
                    <input
                      onChange={(e) => setMetrosCuadrados(e.target.value)}
                      value={metrosCuadrados}
                      placeholder="30"
                      type="text"
                      className="bg-white rounded-xl py-2 px-2 border-slate-300 border-[1px]"
                    />
                  </div>

                  <div className="flex flex-col gap-2 max-md:text-sm">
                    <label htmlFor="">Total del flete</label>
                    <input
                      onChange={(e) => setTotalFlete(e.target.value)}
                      value={totalFlete}
                      placeholder="$ 7000000"
                      type="text"
                      className="bg-white rounded-xl py-2 px-2 border-slate-300 border-[1px]"
                    />
                    <div className="flex">
                      <p className="bg-slate-200/50 rounded-xl py-2 px-3 text-sm font-bold ">
                        {Number(totalFlete).toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                          minimumIntegerDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        handleCliente();
                        closeModal();
                      }}
                      className="bg-orange-500 text-white rounded-xl py-2 px-4 shadow uppercase max-md:text-sm"
                    >
                      Editar el cliente
                    </button>
                  </div>
                </form>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 duration-300 cursor-pointer max-md:text-xs"
                    onClick={closeModal}
                  >
                    Cerrar Ventana
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Menu>
  );
};
