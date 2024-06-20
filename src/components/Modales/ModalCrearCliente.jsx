import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { toast } from "react-toastify";

export const ModalCrearCliente = ({
  isOpen,
  closeModal,
  setDatosCliente,
  datosCliente,
}) => {
  const [cliente, setCliente] = useState("");
  const [numeroContrato, setNumeroContrato] = useState("");
  const [localidad, setLocalidad] = useState("");

  const handleCliente = () => {
    // Crear un nuevo objeto de cliente
    const nuevoCliente = { cliente, localidad, numeroContrato };
    // Agregar el nuevo cliente a la lista de clientes
    setDatosCliente([...datosCliente, nuevoCliente]);
    // Limpiar los campos del formulario después de agregar el cliente
    setCliente("");
    setNumeroContrato("");
    setLocalidad("");

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

                <div className="text-sm text-slate-700 uppercase font-bold mb-3 max-md:uppercase max-md:text-sm">
                  Crear nuevo cliente
                </div>
                <form className="flex flex-col gap-3" action="">
                  <div className="flex flex-col gap-2 max-md:text-sm uppercase text-sm">
                    <label htmlFor="">Nombre y Apellido</label>
                    <input
                      onChange={(e) => setCliente(e.target.value)}
                      value={cliente}
                      placeholder="@NOMBRE Y APELLIDO DEL CLIENTE"
                      type="text"
                      className="bg-white border border-blue-500 py-2 px-3 font-semibold uppercase outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-2 max-md:text-sm uppercase text-sm">
                    <label htmlFor="">Localidad</label>
                    <input
                      onChange={(e) => setLocalidad(e.target.value)}
                      value={localidad}
                      placeholder="Ej: Venado Tuerto, Santa Fe"
                      type="text"
                      className="bg-white border border-blue-500 py-2 px-3 font-semibold uppercase outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-2 max-md:text-sm uppercase text-sm">
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
