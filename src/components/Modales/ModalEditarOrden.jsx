import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useSalidasContext } from "../../context/SalidasProvider";
import { useForm } from "react-hook-form";
import { useOrdenesContext } from "../../context/OrdenesProvider";
import { toast } from "react-toastify";
import client from "../../api/axios";
import io from "socket.io-client";

export const ModalEditarOrden = ({ isOpen, closeModal, obtenerId }) => {
  const { choferes, setChoferes } = useSalidasContext();
  const { setOrdenesMensuales } = useOrdenesContext();

  const [socket, setSocket] = useState(null);

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
    setValue,
  } = useForm();

  useEffect(() => {
    async function loadData() {
      const res = await client.get(`/ordenes/${obtenerId}`);

      const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      setValue("finalizado", res.data.finalizado);
      setValue("chofer", res.data.chofer);
      setValue("fecha_llegada", formatDate(res.data.fecha_llegada));
      setValue("orden_firma", formatDate(res.data.orden_firma));
    }
    loadData();
  }, [obtenerId]);

  const onSubmit = handleSubmit(async (data) => {
    const res = await client.put(`/ordenes/${obtenerId}`, data);

    socket.emit("editar-orden", res);

    toast.success("¡Orden editada correctamente!", {
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

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_URL, {
      withCredentials: true,
    });

    setSocket(newSocket);

    const handleEditarSalida = (editarSalida) => {
      const updateSalida = JSON.parse(editarSalida?.config?.data);

      setOrdenesMensuales((prevSalidas) => {
        const nuevosSalidas = [...prevSalidas];
        const index = nuevosSalidas.findIndex(
          (salida) => salida.id === salida.id
        );
        if (index !== -1) {
          nuevosSalidas[index] = {
            id: nuevosSalidas[index].id,
            chofer: updateSalida.chofer,
            fecha_llegada: updateSalida.fecha_llegada,
            orden_firma: updateSalida.orden_firma,
            finalizado: updateSalida.finalizado,
            created_at: nuevosSalidas[index].created_at,
            updated_at: nuevosSalidas[index].updated_at,
          };
        }
        return nuevosSalidas;
      });
    };

    newSocket.on("editar-orden", handleEditarSalida);

    return () => {
      newSocket.off("editar-orden", handleEditarSalida);
      newSocket.close();
    };
  }, []);

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

                  <div className="flex flex-col gap-2">
                    <label htmlFor="">Seleccionar Chofer o Transportista</label>
                    <select
                      {...register("finalizado", { required: true })}
                      // placeholder="@NOMBRE Y APELLIDO DEL CHOFER"
                      // type="text"
                      className="bg-white rounded-xl py-3 px-4 border-slate-300 border-[1px]"
                    >
                      <option value="">Seleccionar</option>
                      <option value={1}>Finalizado</option>
                      <option value={2}>Pendiente</option>
                    </select>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="bg-black/90 text-white rounded-xl py-2 px-4 shadow uppercase mt-2"
                    >
                      Editar la orden
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
