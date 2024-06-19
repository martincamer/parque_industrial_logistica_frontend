import { Dialog, Menu, Transition } from "@headlessui/react";
import { useEffect, useState, Fragment } from "react";

import client from "../../api/axios";

export const ModalVerClienteLocalidad = ({ isOpen, closeOpen, obtenerId }) => {
  const [salida, setSalida] = useState([]);

  useEffect(() => {
    async function loadData() {
      const res = await client.get(`/salidas/${obtenerId}`);
      setSalida(res.data);
    }
    loadData();
  }, [obtenerId]);

  return (
    <Menu as="div" className="z-50">
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeOpen}
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
            <div className="fixed inset-0 bg-black bg-opacity-10" />
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
              <div className="inline-block w-1/2 max-md:w-full p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-none max-md:hidden">
                <div className="text-sm font-bold text-blue-500 mb-3 border-b-2 border-blue-500 uppercase">
                  Cliente y localidad obtenida
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-sm uppercase font-bold text-slate-600 flex gap-2 items-center">
                    Chofer de viaje
                    <span className="font-medium">{salida.chofer}</span>
                  </p>
                  <p className="text-sm uppercase font-bold text-slate-600 flex gap-2 items-center">
                    Armador
                    <span className="font-medium">{salida.armadores}</span>
                  </p>
                  <p className="text-sm uppercase font-bold text-slate-600 flex gap-2 items-center">
                    Salida
                    <span className="font-medium">{salida.salida}</span>
                  </p>
                </div>

                <div className="mt-2">
                  <div className="flex">
                    <p className="uppercase text-base border-b-2 border-orange-500 mb-3 font-bold text-orange-500">
                      Clientes
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {salida?.datos_cliente?.datosCliente?.map((s) => (
                    <div
                      key={s.id}
                      className="border-blue-500 border transition-all py-2 px-3"
                    >
                      <p className="text-sm uppercase font-bold text-slate-600 flex gap-2 items-center">
                        Cliente <span className="font-medium">{s.cliente}</span>
                      </p>
                      <p className="text-sm uppercase font-bold text-slate-600 flex gap-2 items-center">
                        Numero de contrato{" "}
                        <span className="font-medium">{s.numeroContrato}</span>
                      </p>
                      <p className="text-sm uppercase font-bold text-slate-600 flex gap-2 items-center">
                        Localidad{" "}
                        <span className="font-medium">{s.localidad}</span>
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-2">
                  <p className="text-sm uppercase font-bold text-slate-600 flex gap-2 items-center">
                    Total Control{" "}
                    <span className="font-medium">
                      {Number(salida.total_control).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        minimumIntegerDigits: 2,
                      })}
                    </span>
                  </p>
                  <p className="text-sm uppercase font-bold text-slate-600 flex gap-2 items-center">
                    Total Fletes{" "}
                    <span className="font-medium">
                      {Number(salida.total_flete).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        minimumIntegerDigits: 2,
                      })}
                    </span>
                  </p>
                  <p className="text-sm uppercase font-bold text-slate-600 flex gap-2 items-center">
                    Total Viaticos{" "}
                    <span className="font-medium">
                      {Number(salida.total_viaticos).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        minimumIntegerDigits: 2,
                      })}
                    </span>
                  </p>
                  <p className="text-sm uppercase font-bold text-slate-600 flex gap-2 items-center">
                    Total Final{" "}
                    <span className="font-normal">
                      {Number(
                        parseFloat(salida.total_control) +
                          parseFloat(salida.total_flete) +
                          parseFloat(salida.total_viaticos)
                      ).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        minimumIntegerDigits: 2,
                      })}
                    </span>
                  </p>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 duration-300 cursor-pointer max-md:text-xs"
                    onClick={closeOpen}
                  >
                    Cerrar Ventana
                  </button>
                </div>
              </div>
            </Transition.Child>
            {/* MOBILE APP */}
            <div className="bg-white h-full fixed left-0 top-0 w-full py-16 px-3 max-md:w-full overflow-hidden text-left align-middle transform md:hidden flex flex-col gap-2 transition-all ease-linear z-[101]">
              <div className="absolute top-0 right-0 p-4">
                <p
                  onClick={closeOpen}
                  className="text-red-700 bg-red-100 py-2 px-2 rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </p>
              </div>
              <div className="text-sm font-bold text-slate-700 mb-3 border-b-[1px] uppercase">
                Cliente y localidad obtenida
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-sm uppercase font-bold text-slate-600 flex gap-2 items-center">
                  Chofer de viaje{" "}
                  <span className="font-normal underline">{salida.chofer}</span>
                </p>
                <p className="text-sm uppercase font-bold text-slate-600 flex gap-2 items-center">
                  Armador{" "}
                  <span className="font-normal underline">
                    {salida.armadores}
                  </span>
                </p>
                <p className="text-sm uppercase font-bold text-slate-600 flex gap-2 items-center">
                  Salida{" "}
                  <span className="font-normal underline">{salida.salida}</span>
                </p>
              </div>

              <div className="mt-2">
                <p className="uppercase text-sm mb-1 font-bold text-orange-500 underline px-3">
                  Clientes
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {salida?.datos_cliente?.datosCliente?.map((s) => (
                  <div
                    key={s.id}
                    className="border-slate-300 border-[1px] hover:shadow-md transition-all py-2 px-3 rounded-xl"
                  >
                    <p className="text-sm uppercase font-bold text-slate-600 flex gap-2 items-center">
                      Cliente{" "}
                      <span className="font-normal underline">{s.cliente}</span>
                    </p>
                    <p className="text-sm uppercase font-bold text-slate-600 flex gap-2 items-center">
                      Numero de contrato{" "}
                      <span className="font-normal underline">
                        {s.numeroContrato}
                      </span>
                    </p>
                    <p className="text-sm uppercase font-bold text-slate-600 flex gap-2 items-center">
                      Localidad{" "}
                      <span className="font-normal underline">
                        {s.localidad}
                      </span>
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-2">
                <p className="text-sm uppercase font-bold text-slate-600 flex gap-2 items-center">
                  Total Control{" "}
                  <span className="font-normal">
                    {Number(salida.total_control).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      minimumIntegerDigits: 2,
                    })}
                  </span>
                </p>
                <p className="text-sm uppercase font-bold text-slate-600 flex gap-2 items-center">
                  Total Fletes{" "}
                  <span className="font-normal">
                    {Number(salida.total_flete).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      minimumIntegerDigits: 2,
                    })}
                  </span>
                </p>
                <p className="text-sm uppercase font-bold text-slate-600 flex gap-2 items-center">
                  Total Viaticos{" "}
                  <span className="font-normal">
                    {Number(salida.total_viaticos).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      minimumIntegerDigits: 2,
                    })}
                  </span>
                </p>
                <p className="text-sm uppercase font-bold text-slate-600 flex gap-2 items-center">
                  Total Final{" "}
                  <span className="font-normal">
                    {Number(
                      parseFloat(salida.total_control) +
                        parseFloat(salida.total_flete) +
                        parseFloat(salida.total_viaticos)
                    ).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      minimumIntegerDigits: 2,
                    })}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </Menu>
  );
};
