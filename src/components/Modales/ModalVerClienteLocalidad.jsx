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
              <div className="inline-block w-1/2 max-md:w-full p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-md">
                <div className="text-lg font-bold text-gray-900 mb-3">
                  Cliente y localidad obtenida.
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-sm capitalize font-bold text-slate-600 flex gap-2 items-center">
                    Chofer de viaje
                    <span className="font-medium">{salida.chofer}</span>
                  </p>
                  <p className="text-sm capitalize font-bold text-slate-600 flex gap-2 items-center">
                    Armador
                    <span className="font-medium">{salida.armadores}</span>
                  </p>
                  <p className="text-sm capitalize font-bold text-slate-600 flex gap-2 items-center">
                    Salida
                    <span className="font-medium">{salida.salida}</span>
                  </p>
                </div>

                <div className="mt-2">
                  <div className="flex">
                    <p className="text-lg font-bold text-primary mb-2">
                      Clientes.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 max-md:grid-cols-1">
                  {salida?.datos_cliente?.datosCliente?.map((s) => (
                    <div
                      key={s.id}
                      className="border-gray-300 border rounded-md transition-all py-2 px-3"
                    >
                      <p className="text-sm capitalize font-bold text-slate-600 flex gap-2 items-center">
                        Cliente <span className="font-medium">{s.cliente}</span>
                      </p>
                      <p className="text-sm capitalize font-bold text-slate-600 flex gap-2 items-center">
                        Numero de contrato{" "}
                        <span className="font-medium">{s.numeroContrato}</span>
                      </p>
                      <p className="text-sm capitalize font-bold text-slate-600 flex gap-2 items-center">
                        Localidad{" "}
                        <span className="font-medium">{s.localidad}</span>
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-2">
                  <p className="text-sm capitalize font-bold text-slate-600 flex gap-2 items-center">
                    Total Control{" "}
                    <span className="font-medium">
                      {Number(salida.total_control).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        minimumIntegerDigits: 2,
                      })}
                    </span>
                  </p>
                  <p className="text-sm capitalize font-bold text-slate-600 flex gap-2 items-center">
                    Total Fletes{" "}
                    <span className="font-medium">
                      {Number(salida.total_flete).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        minimumIntegerDigits: 2,
                      })}
                    </span>
                  </p>
                  <p className="text-sm capitalize font-bold text-slate-600 flex gap-2 items-center">
                    Total Viaticos{" "}
                    <span className="font-medium">
                      {Number(salida.total_viaticos).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        minimumIntegerDigits: 2,
                      })}
                    </span>
                  </p>
                  <p className="text-sm capitalize font-bold text-slate-600 flex gap-2 items-center">
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
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Menu>
  );
};
