import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useOrdenesContext } from "../../context/OrdenesProvider";
import { toast } from "react-toastify";
import client from "../../api/axios";
import io from "socket.io-client";

export const ModalEditarFinalizado = ({ isOpen, closeModal, obtenerId }) => {
  const { setOrdenesMensuales } = useOrdenesContext();

  const [socket, setSocket] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    async function loadData() {
      const res = await client.get(`/ordenes/${obtenerId}`);

      setValue("finalizado", res.data.finalizado);
      setValue("chofer", res.data.chofer);
      setValue("fecha_llegada", res.data.fecha_llegada);
      setValue("orden_firma", res.data.orden_firma);
    }
    loadData();
  }, [obtenerId]);

  const onSubmit = handleSubmit(async (data) => {
    const res = await client.put(`/ordenes/${obtenerId}`, data);

    socket.emit("editar-orden", res);

    toast.success("¡Orden finalizada correctamente!", {
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

    setTimeout(() => {
      closeModal();
    }, 500);
  });

  useEffect(() => {
    const newSocket = io(
      "https://tecnohouseindustrialbackend-production.up.railway.app",
      // "http://localhost:4000",
      {
        withCredentials: true,
      }
    );

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
                  Editar el orden si finalizo
                </div>
                <form
                  onSubmit={onSubmit}
                  className="flex flex-col gap-3 py-3"
                  action=""
                >
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
                      Editar orden estado
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
