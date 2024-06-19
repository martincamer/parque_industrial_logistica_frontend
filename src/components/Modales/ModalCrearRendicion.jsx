import { useEffect, useState, Fragment } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { crearRendicion } from "../../api/ingresos";
import { useRendicionesContext } from "../../context/RendicionesProvider";
import { toast } from "react-toastify";
import io from "socket.io-client";

export const ModalCrearRendicion = ({ isOpen: dos, closeModal: tres }) => {
  const { setRendiciones } = useRendicionesContext();

  const [armador, setArmador] = useState("");
  const [detalle, setDetalle] = useState("");
  const [rendicion_final, setRendicion] = useState("");

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_URL, {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("crear-rendicion", (nuevaSalida) => {
      setRendiciones(nuevaSalida);
    });

    return () => newSocket.close();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await crearRendicion({
        armador,
        detalle,
        rendicion_final,
      });

      if (socket) {
        socket.emit("crear-rendicion", res.data);
      }

      toast.success("¡Rendición creada correctamente!", {
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

      tres();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Menu as="div" className="z-50">
      <Transition appear show={dos} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={tres}
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
              <div className="inline-block w-1/3 max-md:w-full p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-none">
                <div className="flex justify-end cursor-pointer">
                  <p
                    onClick={tres}
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
                <div className="text-lg border-blue-500 text-blue-500 mb-3 border-b-2 font-bold uppercase">
                  Crear nueva rendición
                </div>

                <form
                  onSubmit={onSubmit}
                  className="py-5 flex flex-col gap-5 max-md:py-2 max-md:px-2 max-md:border-none max-md:shadow-none"
                >
                  <article className="flex flex-col gap-4">
                    <div>
                      <h3 className="font-bold text-base text-slate-700 max-md:text-sm uppercase">
                        Ingresar datos de la rendición
                      </h3>
                    </div>
                    {/* datos del formulario  */}
                    <div className="flex flex-col gap-6 max-md:gap-6">
                      <div className="w-full">
                        <label className="relative block border border-blue-500 shadow-sm max-md:text-sm">
                          <input
                            onChange={(e) => setArmador(e.target.value)}
                            value={armador}
                            type="text"
                            className="peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-5 font-bold text-sm px-3 text-slate-900 uppercase"
                          />

                          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base uppercase text-blue-500 font-bold">
                            Armador
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col gap-6 max-md:gap-6">
                      <div className="w-full">
                        <label className="relative block border border-blue-500 shadow-sm max-md:text-sm">
                          <textarea
                            onChange={(e) => setDetalle(e.target.value)}
                            value={detalle}
                            type="text"
                            className="peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3 uppercase px-3 text-slate-900 w-full font-bold text-sm"
                          />

                          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base uppercase font-bold text-blue-500">
                            Clientes/Detalles de la rendicion
                          </span>
                        </label>
                      </div>
                    </div>
                  </article>

                  <article className="flex flex-col gap-4">
                    <div>
                      <h3 className="font-bold text-base text-slate-700 max-md:text-sm uppercase">
                        Ingresar $
                      </h3>
                    </div>
                    <div className="flex flex-col gap-3 max-md:w-full max-md:flex-col max-md:items-start">
                      <label className="relative block border border-blue-500 shadow-sm max-md:text-sm">
                        <span className="font-bold text-slate-500 px-3">$</span>
                        <input
                          onChange={(e) => setRendicion(e.target.value)}
                          value={rendicion_final}
                          type="text"
                          className="peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-5 font-bold  px-3 text-slate-900 text-sm uppercase"
                        />

                        <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base uppercase font-bold text-blue-500">
                          Total de la rendición
                        </span>
                      </label>

                      <span className="font-bold text-slate-700">
                        {Number(rendicion_final).toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                          minimumIntegerDigits: 2,
                        })}{" "}
                        VALOR ASIGNADO
                      </span>
                    </div>
                  </article>

                  <div>
                    <button
                      type="submit"
                      className="bg-blue-500 flex gap-2 items-center py-1.5 px-6 font-semibold text-sm text-white rounded-full hover:bg-orange-500 transition-all"
                    >
                      Crear nueva rendicion
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
                          d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                        />
                      </svg>
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
