import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useSalidasContext } from "../../context/SalidasProvider";
import { useForm } from "react-hook-form";
import { useOrdenesContext } from "../../context/OrdenesProvider";
import { toast } from "react-toastify";
import client from "../../api/axios";
import io from "socket.io-client";

export const ModalCrearOrden = ({ isOpen, closeModal }) => {
  const { choferes, setChoferes } = useSalidasContext();
  const { ordenesMensuales, setOrdenesMensuales } = useOrdenesContext();

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_URL, {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("nueva-orden", (nuevaSalida) => {
      setOrdenesMensuales((prevTipos) => [...prevTipos, nuevaSalida]);
    });

    return () => newSocket.close();
  }, []);

  //obtenerChoferes
  useEffect(() => {
    async function loadData() {
      const res = await client.get("/chofer");

      setChoferes(res.data);
    }

    loadData();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    const res = await client.post("/crear-orden", data);
    // Verificar si el tipo ya existe antes de agregarlo al estado
    const tipoExistente = ordenesMensuales.find(
      (tipo) => tipo.id === res.data.id
    );
    if (!tipoExistente) {
      // Actualizar el estado de tipos agregando el nuevo tipo al final
      setOrdenesMensuales((prevTipos) => [...prevTipos, res.data]);
    }

    if (socket) {
      socket.emit("nueva-orden", res.data);
    }

    toast.success("¡Orden creada correctamente!", {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    setTimeout(() => {
      closeModal();
    }, 500);
  });

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
                <div className="text-lg text-slate-700 mb-3 border-b-[1px] uppercase">
                  Crear nueva orden de llegada
                </div>
                <form
                  onSubmit={onSubmit}
                  className="flex flex-col gap-3 py-3"
                  action=""
                >
                  <div className="flex flex-col gap-2">
                    <label htmlFor="">Seleccionar Chofer o Transportista</label>
                    <select
                      {...register("chofer", { required: true })}
                      // placeholder="@NOMBRE Y APELLIDO DEL CHOFER"
                      // type="text"
                      className="bg-white rounded-xl py-3 px-4 border-slate-300 border-[1px]"
                    >
                      <option value="">Seleccionar</option>
                      {choferes.map((c) => (
                        <option key={c.id}>{c.chofer}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="">Fecha de llegada</label>
                    <input
                      {...register("fecha_llegada", { required: true })}
                      // placeholder="@NOMBRE Y APELLIDO DEL CHOFER"
                      type="date"
                      className="bg-white rounded-xl py-3 px-4 border-slate-300 border-[1px]"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="">Turno de la firma</label>
                    <input
                      {...register("orden_firma", { required: true })}
                      type="date"
                      className="bg-white rounded-xl py-3 px-4 border-slate-300 border-[1px]"
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="bg-black/90 text-white rounded-xl py-2 px-4 shadow uppercase mt-2"
                    >
                      Crear nueva orden
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
