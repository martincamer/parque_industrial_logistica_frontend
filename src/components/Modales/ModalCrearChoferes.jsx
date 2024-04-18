import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useSalidasContext } from "../../context/SalidasProvider";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import client from "../../api/axios";

export const ModalCrearChoferes = ({ isOpen, closeModal }) => {
  const { choferes, setChoferes } = useSalidasContext();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await client.post("/chofer", data);

      // Verificar si el tipo ya existe antes de agregarlo al estado
      const tipoExistente = choferes.find((tipo) => tipo.id === res.data.id);

      if (!tipoExistente) {
        // Actualizar el estado de tipos agregando el nuevo tipo al final
        setChoferes((prevTipos) => [...prevTipos, res.data]);
      }

      toast.success("¡Chofer creado correctamente!", {
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
      }, 1500);
    } catch (error) {
      setError(error.response.data.message);
      setTimeout(() => {
        setError("");
      }, 1500);
    }
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
              <div className="inline-block max-md:w-full w-[500px] p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
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

                <div className="text-sm font-bold text-slate-700 mb-3 border-b-[1px] max-md:text-sm uppercase">
                  Crear nuevo chofer
                </div>

                {error ? (
                  <div
                    className="
                bg-red-100 text-red-800 py-2 px-4 text-sm uppercase text-center rounded-2xl mb-3"
                  >
                    {error}
                  </div>
                ) : (
                  ""
                )}

                <form
                  onSubmit={onSubmit}
                  className="flex flex-col gap-3 uppercase text-sm"
                >
                  <div className="flex flex-col gap-2 max-md:text-sm">
                    <label htmlFor="">Nombre y Apellido</label>
                    <input
                      {...register("chofer", { required: true })}
                      placeholder="NOMBRE Y APELLIDO DEL CHOFER"
                      type="text"
                      className="bg-white rounded-xl py-2 px-2 border-slate-300 border-[1px] uppercase"
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="bg-orange-100 text-orange-700 rounded-xl py-3 px-5 uppercase hover:text-sm hover:font-bold hover:shadow-md transition-all ease-linear hover:shadow-gray-300"
                    >
                      Crear nuevo chofer
                    </button>
                  </div>
                </form>
                {/* <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 duration-300 cursor-pointer max-md:text-xs"
                    onClick={closeModal}
                  >
                    Cerrar Ventana
                  </button>
                </div> */}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Menu>
  );
};
