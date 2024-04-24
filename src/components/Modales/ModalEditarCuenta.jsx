import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import client from "../../api/axios";

export const ModalEditarCuenta = ({ isOpen, closeModal, obtenerId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    async function loadData() {
      const res = await client.get(`/users/${obtenerId}`);

      setValue("id", res.data.id);
      setValue("username", res.data.username);
      setValue("email", res.data.email);
      // setValue("password", res.data.password);
      setValue("localidad", res.data.localidad);
      setValue("sucursal", res.data.sucursal);
    }

    loadData();
  }, [obtenerId]);

  const onSubmit = handleSubmit(async (data) => {
    const res = await client.put(`/users/${obtenerId}`, data);

    toast.success("¡Usuario editado correctamente, espera 5 segundos!", {
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

    closeModal();

    setTimeout(() => {
      location.reload();
    }, 5000);
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
              <div className="inline-block w-1/3 max-md:w-full p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
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

                <div className="text-sm text-slate-700 mb-3 border-b-[1px] uppercase font-bold">
                  Editar el usuario
                </div>
                <form
                  onSubmit={onSubmit}
                  className="flex flex-col gap-3 uppercase text-sm"
                >
                  <div className="flex flex-col gap-2 max-md:text-sm">
                    <label htmlFor="">Username</label>
                    <input
                      {...register("username", { required: true })}
                      type="text"
                      className="bg-white rounded-xl py-2 px-2 border-slate-300 border-[1px] uppercase text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-2 max-md:text-sm">
                    <label htmlFor="">Email</label>
                    <input
                      {...register("email", { required: true })}
                      type="text"
                      className="bg-white rounded-xl py-2 px-2 border-slate-300 border-[1px] uppercase text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-2 max-md:text-sm">
                    <label htmlFor="">Localidad</label>
                    <input
                      {...register("localidad", { required: true })}
                      type="text"
                      className="bg-white rounded-xl py-2 px-2 border-slate-300 border-[1px] uppercase text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-2 max-md:text-sm">
                    <label htmlFor="">Sucursal</label>
                    <input
                      {...register("sucursal", { required: true })}
                      type="text"
                      className="bg-white rounded-xl py-2 px-2 border-slate-300 border-[1px] uppercase text-sm"
                    />
                  </div>

                  {/* <div className="flex flex-col gap-2 max-md:text-sm">
                    <label htmlFor="">Password</label>
                    <input
                      {...register("password", { required: true })}
                      type="text"
                      className="bg-white rounded-xl py-2 px-2 border-slate-300 border-[1px] uppercase text-sm"
                    />
                  </div> */}

                  <div>
                    <button
                      type="submit"
                      className="bg-orange-100 text-orange-700 hover:font-bold hover:shadow-md hover:shadow-gray-300 rounded-xl py-2 px-4 uppercase transition-all ease-linear"
                    >
                      Editar el usuario
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
