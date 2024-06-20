import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { toast } from "react-toastify";

export const ModalCrearClienteRemuneracion = ({
  isOpen,
  closeModal,
  setDatosCliente,
  datosCliente,
}) => {
  const [cliente, setCliente] = useState("");
  const [numeroContrato, setNumeroContrato] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [metrosCuadrados, setMetrosCuadrados] = useState("");
  const [totalFlete, setTotalFlete] = useState("");
  const [error, setError] = useState("");

  const handleCliente = () => {
    // Verificar si metrosCuadrados y totalFlete son numéricos
    if (isNaN(Number(metrosCuadrados)) || isNaN(Number(totalFlete))) {
      setError(
        "Los campos 'Metros Cuadrados' y 'Total de Flete' deben ser numéricos."
      );
      return;
    }

    // Crear un nuevo objeto de cliente
    const nuevoCliente = {
      cliente,
      localidad,
      numeroContrato,
      metrosCuadrados: Number(metrosCuadrados), // Convertir a número
      totalFlete: Number(totalFlete), // Convertir a número
    };

    // Agregar el nuevo cliente a la lista de clientes
    setDatosCliente([...datosCliente, nuevoCliente]);
    setCliente("");
    setNumeroContrato("");
    setLocalidad("");
    setMetrosCuadrados("");
    setTotalFlete("");
    setError(""); // Limpiar el mensaje de error si se ha agregado el cliente correctamente

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

                <div className="text-sm text-slate-700 mb-3 uppercase font-bold">
                  Crear nuevo cliente
                </div>
                {error && (
                  <p
                    className="
                bg-red-100 px-2 py-2 rounded-xl mb-3 uppercase text-sm font-bold text-red-800 text-center"
                  >
                    {error}
                  </p>
                )}
                <form className="flex flex-col gap-3 uppercase text-sm">
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

                  <div className="flex flex-col gap-2 max-md:text-sm">
                    <label htmlFor="">Metros Cuadrados</label>
                    <input
                      onChange={(e) => setMetrosCuadrados(e.target.value)}
                      value={metrosCuadrados}
                      placeholder="30"
                      type="text"
                      className="bg-white border border-blue-500 py-2 px-3 font-semibold uppercase outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-2 max-md:text-sm">
                    <label htmlFor="">Total del flete</label>
                    <input
                      onChange={(e) => setTotalFlete(e.target.value)}
                      value={totalFlete}
                      placeholder="$ 7000000"
                      type="text"
                      className="bg-white border border-blue-500 py-2 px-3 font-semibold uppercase outline-none"
                    />
                    <div className="flex">
                      <p className="bg-blue-500 text-white py-2 px-3 text-sm font-bold ">
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
                        // closeModal();
                      }}
                      className="py-1.5 px-6 bg-blue-500 hover:bg-orange-500 text-white transition-all rounded-full font-semibold text-sm"
                    >
                      Crear nuevo cliente
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
