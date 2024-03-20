import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { editarTipo, obtenerUnicoTipo } from "../../api/fabrica.api";
import { useForm } from "react-hook-form";
import { useEmpleadosContext } from "../../context/EmpleadosProvider";

export const ModalEditarFabrica = ({
  obtenerId,
  isOpenEdit,
  closeModalEdit,
}) => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { fabricas, setFabricas } = useEmpleadosContext();

  useEffect(() => {
    async function laodData() {
      const res = await obtenerUnicoTipo(obtenerId);

      setValue("tipo", res.data.tipo);
    }
    laodData();
  }, [obtenerId]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await editarTipo(obtenerId, data);
      console.log("Respuesta de editarTipo:", res);

      // Verifica que res.data contenga la información del tipo actualizado
      console.log("Tipo actualizado:", res.data);

      const tipoExistenteIndex = fabricas.findIndex(
        (tipo) => tipo.id === obtenerId
      );

      setFabricas((prevTipos) => {
        const newTipos = [...prevTipos];
        const updatedTipo = JSON.parse(res.config.data); // Convierte el JSON a objeto
        newTipos[tipoExistenteIndex] = {
          id: obtenerId,
          tipo: updatedTipo.tipo, // Actualiza solo el campo 'tipo'
          created_at: newTipos[tipoExistenteIndex].created_at,
          updated_at: newTipos[tipoExistenteIndex].updated_at,
        };
        console.log("Estado después de la actualización:", newTipos);
        return newTipos;
      });

      toast.success("Tipo editado correctamente!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      setTimeout(() => {
        closeModalEdit();
      }, 500);
    } catch (error) {}
  });

  return (
    <Menu as="div" className="z-50">
      <Transition appear show={isOpenEdit} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModalEdit}
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
              <div className="inline-block w-[300px] p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="text-lg text-indigo-500 mb-3 border-b-[1px] uppercase">
                  Editar nombre fabrica
                </div>
                <form
                  onSubmit={onSubmit}
                  action=""
                  className="flex flex-col gap-3"
                >
                  <div className="flex flex-col gap-1">
                    <label htmlFor="" className="text-slate-600">
                      Edita la fabrica
                    </label>
                    <input
                      {...register("tipo", { required: true })}
                      type="text"
                      placeholder="Edita el nombre.."
                      className="py-2 px-4 border-[1px] border-black/10 rounded-lg shadow shadow-black/10 outline-none"
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="bg-indigo-500 py-1 px-4 rounded-lg shadow text-white mt-2"
                    >
                      Editar nombre fabrica
                    </button>
                  </div>
                </form>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 duration-300 cursor-pointer max-md:text-xs"
                    onClick={closeModalEdit}
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
