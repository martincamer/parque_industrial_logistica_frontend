import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useEmpleadosContext } from "../../context/EmpleadosProvider";
import { crearTipoNuevo, eliminarTipo } from "../../api/fabrica.api";
import { ModalEditarFabrica } from "./ModalEditarFabrica";

export const ModalCrearFabrica = ({ isOpen, closeModal }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { fabricas, setFabricas } = useEmpleadosContext();

  const [isOpenEdit, setIsOpenEdit] = useState(false);

  const [obtenerId, setObtenerId] = useState(null);

  const handleId = (id) => setObtenerId(id);

  const openModalEdit = () => {
    setIsOpenEdit(true);
  };

  const closeModalEdit = () => {
    setIsOpenEdit(false);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await crearTipoNuevo(data);

      // Verificar si el tipo ya existe antes de agregarlo al estado
      const tipoExistente = fabricas.find((tipo) => tipo.id === res.data.id);

      if (!tipoExistente) {
        // Actualizar el estado de tipos agregando el nuevo tipo al final
        setFabricas((prevTipos) => [...prevTipos, res.data]);
      }

      toast.success("Fabrica creada correctamente!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      // setTimeout(() => {
      //   // closeModal();
      // }, 1000);
    } catch (error) {
      // console.log(error.response.data);
    }
  });

  const eliminar = (id) => {
    eliminarTipo(id);
  };

  const handleEliminar = (id) => {
    const res = eliminar(id);

    const updatedTipos = fabricas.filter((tipo) => tipo.id !== id);
    setFabricas(updatedTipos);

    toast.error("Eliminado correctamente!", {
      position: "top-right",
      autoClose: 500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

    setTimeout(() => {
      closeModalEliminar();
    }, 500);
  };

  return (
    <Menu as="div" className="z-50">
      <ToastContainer />
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
              <div className="inline-block w-[800px] p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="text-lg text-indigo-500 mb-3 border-b-[1px] uppercase">
                  Crear nueva fabrica
                </div>
                <form
                  onSubmit={onSubmit}
                  action=""
                  className="flex flex-col gap-3"
                >
                  <div className="flex justify-center">
                    {errors.tipo && (
                      <p className="text-red-900 border-red-900 border-[1px] py-1 px-10 text-center rounded-xl bg-red-100/30">
                        El nombre es obligatorio
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="" className="text-slate-600">
                      Ingresa el nombre de la fabrica
                    </label>
                    <input
                      {...register("tipo", { required: true })}
                      type="text"
                      placeholder="Ingresa el nombre.."
                      className="py-2 px-4 border-[1px] border-black/10 rounded-lg shadow shadow-black/10 outline-none"
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="bg-indigo-500 py-1 px-4 rounded-lg shadow text-white mt-2"
                    >
                      Crear nueva fabrica
                    </button>
                  </div>
                </form>

                <div className="text-lg text-indigo-500 mb-3 border-b-[1px] uppercase mt-5">
                  Fabricas creadas
                </div>

                <div className="grid grid-cols-3 items-start gap-2">
                  {fabricas.map((f) => (
                    <div className="border-slate-300 border-[1px] py-1 px-3 rounded-xl shadow flex gap-2 justify-center items-center">
                      <p className="text-sm text-slate-600">{f.tipo}</p>
                      <svg
                        onClick={() => handleEliminar(f.id)}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-red-800 cursor-pointer"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                        />
                      </svg>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-indigo-500 cursor-pointer"
                        onClick={() => {
                          handleId(f.id), openModalEdit();
                        }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 duration-300 cursor-pointer max-md:text-xs"
                    onClick={closeModal}
                  >
                    Cerrar Ventana
                  </button>
                </div>

                <ModalEditarFabrica
                  isOpenEdit={isOpenEdit}
                  closeModalEdit={closeModalEdit}
                  obtenerId={obtenerId}
                />
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Menu>
  );
};
