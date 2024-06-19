import { Dialog, Menu, Transition } from "@headlessui/react";
import { useEffect, useState, Fragment } from "react";

import client from "../../api/axios";
import { useLocation } from "react-router-dom";

export const ModalVerClienteRemuneracion = ({
  isOpen,
  closeOpen,
  obtenerId,
}) => {
  const [remuneracion, setRemuneracion] = useState([]);

  const location = useLocation();

  console.log(location.pathname);

  useEffect(() => {
    async function loadData() {
      const res = await client.get(`${location.pathname}/${obtenerId}`);
      setRemuneracion(res.data);
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
              <div className="inline-block w-1/2 max-md:w-full p-8 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-none">
                <div className="text-sm font-bold text-blue-500 mb-3 border-b-2 border-blue-500 uppercase">
                  Cliente y localidad obtenida
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-sm uppercase font-bold text-slate-600 flex gap-2 items-center">
                    Chofer de viaje{" "}
                    <span className="font-medium">{remuneracion.chofer}</span>
                  </p>
                  <p className="text-sm uppercase font-bold text-slate-600 flex gap-2 items-center">
                    Armador{" "}
                    <span className="font-medium">{remuneracion.armador}</span>
                  </p>
                </div>

                <div className="mt-2 flex mb-2">
                  <p className="uppercase text-sm mb-1 font-bold text-orange-500 border-b-2 border-orange-500">
                    Clientes
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {remuneracion?.datos_cliente?.datosCliente?.map((s) => (
                    <div
                      key={s.id}
                      className="border border-blue-500 py-2 px-2"
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
                      <p className="text-sm uppercase font-bold text-slate-600 flex gap-2 items-center">
                        Total del flete{" "}
                        <span className="font-medium">
                          {Number(s.totalFlete).toLocaleString("es-AR", {
                            style: "currency",
                            currency: "ARS",
                            minimumIntegerDigits: 2,
                          })}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-2">
                  <p className="text-sm uppercase font-bold text-slate-600 flex gap-2 items-center">
                    Total Final Remunerado{" "}
                    <span
                      className={
                        remuneracion.recaudacion < 0
                          ? "font-semibold bg-red-600 py-1 px-2 text-white"
                          : "font-semibold bg-blue-500 py-1 px-2 text-white"
                      }
                    >
                      {Number(remuneracion.recaudacion).toLocaleString(
                        "es-AR",
                        {
                          style: "currency",
                          currency: "ARS",
                          minimumIntegerDigits: 2,
                        }
                      )}
                    </span>
                  </p>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 duration-300 cursor-pointer max-md:text-xs font-bold"
                    onClick={closeOpen}
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
