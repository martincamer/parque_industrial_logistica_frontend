import { useEffect, useState, Fragment } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { crearRendicion } from "../../api/ingresos";
import { useRendicionesContext } from "../../context/RendicionesProvider";
import { useSalidasContext } from "../../context/SalidasProvider";
import { toast } from "react-toastify";
import client from "../../api/axios";
import io from "socket.io-client";

export const ModalCrearRendicion = ({ isOpen: dos, closeModal: tres }) => {
  const fechaActual = new Date();

  const { setRendicionesMensuales } = useRendicionesContext();

  const nombresMeses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const nombresDias = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  const numeroDiaActual = fechaActual.getDay(); // Obtener el día del mes actual

  const numeroMesActual = fechaActual.getMonth() + 1; // Obtener el mes actual

  const nombreMesActual = nombresMeses[numeroMesActual - 1]; // Obtener el nombre del mes actual

  const nombreDiaActual = nombresDias[numeroDiaActual]; // Obtener el nombre del día actual

  //useContext
  const { choferes, setChoferes } = useSalidasContext();

  //obtenerChoferes
  useEffect(() => {
    async function loadData() {
      const res = await client.get("/chofer");

      setChoferes(res.data);
    }

    loadData();
  }, []);

  //daots del cliente
  const [datosCliente, setDatosCliente] = useState([]);
  //eliminar cliente
  const eliminarCliente = (nombreClienteAEliminar) => {
    // Filtrar la lista de clientes para obtener una nueva lista sin el cliente a eliminar
    const nuevaListaClientes = datosCliente.filter(
      (cliente) => cliente.cliente !== nombreClienteAEliminar
    );
    // Actualizar el estado con la nueva lista de clientes
    setDatosCliente(nuevaListaClientes);
  };

  //estados del formulario
  const [armador, setArmador] = useState("");
  const [detalle, setDetalle] = useState("");
  const [rendicion_final, setRendicion] = useState("");

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(
      "https://tecnohouseindustrialbackend-production.up.railway.app",
      // "http://localhost:4000",
      {
        withCredentials: true,
      }
    );

    setSocket(newSocket);

    newSocket.on("crear-rendicion", (nuevaSalida) => {
      setRendicionesMensuales((prevTipos) => [...prevTipos, nuevaSalida]);
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

      toast.success("¡Rendicion creada correctamente!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
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
              <div className="inline-block w-1/4 max-md:w-full p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="text-lg text-slate-700 mb-3 border-b-[1px] uppercase">
                  Crear nueva rendición
                </div>

                <form
                  onSubmit={onSubmit}
                  className=" border-slate-300 border-[1px] py-12 px-10 rounded-lg shadow flex flex-col gap-5 max-md:py-2 max-md:px-2 max-md:border-none max-md:shadow-none"
                >
                  <article className="flex flex-col gap-4">
                    <div>
                      <h3 className="font-bold text-base text-slate-700 max-md:text-sm uppercase">
                        Ingresar datos
                      </h3>
                    </div>
                    {/* datos del formulario  */}
                    <div className="flex flex-col gap-6 max-md:gap-6">
                      <div className="w-full">
                        <label className="relative block rounded-xl border border-slate-300 shadow-sm max-md:text-sm">
                          <input
                            onChange={(e) => setArmador(e.target.value)}
                            value={armador}
                            type="text"
                            className="peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-2 px-3 text-slate-900"
                          />

                          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base uppercase">
                            Armador
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col gap-6 max-md:gap-6">
                      <div className="w-full">
                        <label className="relative block rounded-xl border border-slate-300 shadow-sm max-md:text-sm">
                          <textarea
                            onChange={(e) => setDetalle(e.target.value)}
                            value={detalle}
                            type="text"
                            className="peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-2 px-3 text-slate-900 w-full"
                          />

                          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base uppercase">
                            Clientes/Detlle de la rendicion
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
                      <label className="relative block rounded-xl border border-slate-300 bg-white shadow-sm max-md:w-full">
                        <span className="font-bold text-slate-500 px-3">$</span>
                        <input
                          onChange={(e) => setRendicion(e.target.value)}
                          value={rendicion_final}
                          type="text"
                          className="peer border-none bg-white/10 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 py-3  px-3 text-slate-900"
                        />

                        <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-base text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-base">
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
                      className="bg-black text-white rounded-xl shadow py-2 px-6 max-md:text-sm"
                    >
                      Crear nueva rendicion
                    </button>
                  </div>
                </form>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 duration-300 cursor-pointer max-md:text-xs"
                    onClick={tres}
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
