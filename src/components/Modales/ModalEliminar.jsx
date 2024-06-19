import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { useSalidasContext } from "../../context/SalidasProvider";
import { toast } from "react-toastify";
import { IoIosAlert } from "react-icons/io";
import client from "../../api/axios";
import io from "socket.io-client";

export const ModalEliminar = ({ eliminarModal, closeEliminar, obtenerId }) => {
  const { setSalidas } = useSalidasContext();

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_URL, {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("eliminar-salida", (nuevaSalida) => {
      setSalidas(nuevaSalida);
    });

    return () => newSocket.close();
  }, []);

  const handleEliminarChofer = async (id) => {
    try {
      const res = await client.delete(`/salidas/${id}`);

      if (socket) {
        socket.emit("eliminar-salida", res.data);
      }

      toast.error("¡Eliminado correctamente!", {
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

      closeEliminar();
    } catch (error) {
      console.error("Error al eliminar la salida:", error);
    }
  };

  return (
    <Menu as="div" className="z-50">
      <Transition appear show={eliminarModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeEliminar}
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
              <div className="inline-block w-1/4 max-md:w-full p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-none">
                <div className="flex justify-center flex-col gap-2 items-center">
                  <IoIosAlert className="text-yellow-400 text-9xl py-1" />

                  <p className="text-3xl text-yellow-500">¡Espera! ✋</p>

                  <p className="font-light text-sm mt-2">
                    ¿Estas seguro de eliminar la salida? No podras recuperarla
                    una vez eliminada.
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-5">
                    <button
                      onClick={closeEliminar}
                      className="text-sm font-bold text-gray-400 hover:bg-gray-300 py-2 px-4 rounded-full hover:text-gray-600"
                      type="button"
                    >
                      Cancelar
                    </button>
                    <button
                      className="text-base font-bold text-white bg-orange-500 hover:bg-orange-600 py-2 px-6 rounded-full hover:text-white"
                      type="button"
                      onClick={() => handleEliminarChofer(obtenerId)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Menu>
  );
};
