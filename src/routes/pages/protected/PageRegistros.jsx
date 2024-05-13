import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Tab, Transition } from "@headlessui/react";
import { CiCreditCard1 } from "react-icons/ci";
import { useSalidasContext } from "../../../context/SalidasProvider";
import { FaHouseChimneyUser } from "react-icons/fa6";

export const PageRegistros = () => {
  const { salidasMensuales, salidasMensualesAdmin } = useSalidasContext();

  const tabStyle = (isSelected) => `
  py-2 px-5 font-semibold capitalize rounded-full  flex gap-2 items-center
  ${
    isSelected
      ? "bg-orange-500 text-white border-orange-500 border-[1px]"
      : "bg-white text-gray-700 border-[1px] border-gray-300"
  } transition  ease-linear outline-none
`;

  return (
    <section className="min-h-screen max-h-full w-full h-full px-12 max-md:px-4 flex flex-col gap-10 py-24 max-md:gap-5">
      <ToastContainer />
      <div>
        <p className="font-bold text-2xl text-slate-600 max-md:text-lg max-md:text-center text-justify">
          Bienvenido{" "}
          <span className="capitalize text-green-500/90 underline">
            {/* {user.username} */}
          </span>{" "}
          a la parte de registros mensuales 🖐️.
        </p>
      </div>
      <div className="uppercase grid grid-cols-4 gap-3 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-0 max-md:px-0">
        <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer">
          <div className="inline-flex gap-2 self-end rounded bg-green-100 p-1 text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>

            <span className="text-xs font-medium"> </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Total remuneraciones
            </strong>

            <p>
              <span className="text-2xl font-medium text-green-600 max-md:text-base"></span>

              <span className="text-xs text-gray-500">
                {" "}
                ultima remuneracion del día, el total es de{" "}
              </span>
            </p>
          </div>
        </article>
      </div>

      <div className="flex gap-5 max-md:gap-2">
        <Link className="bg-black uppercase text-sm py-3 px-6 rounded-xl text-white flex gap-2 items-center max-md:text-sm max-md:py-2 max-md:px-2">
          Crear remuneracion
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
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
            />
          </svg>
        </Link>
      </div>

      <Tab.Group>
        <Tab.List className={"gap-3 flex mt-8"}>
          <Tab className={({ selected }) => tabStyle(selected)}>
            Ver Salidas <CiCreditCard1 className="font-bold text-2xl" />
          </Tab>
          <Tab className={({ selected }) => tabStyle(selected)}>
            Ver Remuneraciones <CiCreditCard1 className="font-bold text-2xl" />
          </Tab>
          <Tab className={({ selected }) => tabStyle(selected)}>
            Ver Legales <CiCreditCard1 className="font-bold text-2xl" />
          </Tab>
          <Tab className={({ selected }) => tabStyle(selected)}>
            Ver Rendiciones <CiCreditCard1 className="font-bold text-2xl" />
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <div className="transition-all ease-linear rounded-2xl">
              <table className="min-w-full table bg-white text-sm rounded-2xl">
                <thead>
                  <tr>
                    <th className="text-slate-800 font-bold text-sm uppercase">
                      Numero
                    </th>
                    <th className="text-slate-800 font-bold text-sm uppercase">
                      Creador
                    </th>
                    <th className="text-slate-800 font-bold text-sm uppercase">
                      Localidad/Creador
                    </th>
                    <th className="text-slate-800 font-bold text-sm uppercase">
                      Fabrica/Sucursal
                    </th>
                    <th className="text-slate-800 font-bold text-sm uppercase">
                      Total
                    </th>
                    <th className="text-slate-800 font-bold text-sm uppercase">
                      Clientes/Localidad/Ver
                    </th>
                    <th className="text-slate-800 font-bold text-sm uppercase">
                      Fabrica de salida
                    </th>
                    <th className="text-slate-800 font-bold text-sm uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 uppercase">
                  {salidasMensuales.map((s) => (
                    <tr key={s.id}>
                      <td className="px-4 py-3 font-medium text-gray-900 uppercase">
                        {s.id}
                      </td>
                      <td className="px-4 py-3 font-bold text-gray-900 upppercase">
                        {s.usuario}
                      </td>
                      <td className="px-4 py-3 font-bold text-gray-900 upppercase">
                        {s.localidad}
                      </td>
                      <td className="px-4 py-3 font-bold text-gray-900 upppercase">
                        {s.sucursal}
                      </td>
                      <td className="px-4 py-3 font-bold text-red-600 upppercase">
                        {Number(
                          parseFloat(s.total_flete) +
                            parseFloat(s.total_control) +
                            parseFloat(s.total_viaticos) +
                            parseFloat(s.espera)
                        ).toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                          minimumIntegerDigits: 2,
                        })}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 upppercase">
                        <button
                          onClick={() => {
                            // handleID(s.id), openVerCliente();
                          }}
                          type="button"
                          className="bg-orange-100 py-2 px-3 rounded-2xl text-orange-700  hover:shadow-md transition-all ease-linear flex gap-2 items-center"
                        >
                          VER CLIENTE/LOCALIDAD{" "}
                          <FaHouseChimneyUser className="text-2xl" />
                        </button>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 upppercase">
                        {s.fabrica}
                      </td>
                      <td className="px-1 py-3 font-medium text-gray-900 uppercase w-[150px] cursor-pointer space-x-2 flex">
                        <div className="dropdown dropdown-left">
                          <div
                            tabIndex={0}
                            role="button"
                            className="btn bg-white border-none shadow-none hover:bg-orange-100 hover:rounded-xl m-1"
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
                                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                              />
                            </svg>
                          </div>
                          <ul
                            tabIndex={0}
                            className="dropdown-content z-[1] menu p-2 shadow-md border-[1px] border-slate-200 bg-base-100 rounded-box w-52"
                          >
                            <li>
                              <button
                                type="button"
                                onClick={() => {
                                  handleID(s.id), openModalDos();
                                }}
                              >
                                Editar
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() => {
                                  handleId(s.id), openEliminar();
                                }}
                                type="button"
                              >
                                Eliminar
                              </button>
                            </li>
                            <li>
                              <Link
                                className="capitalize"
                                to={`/resumen/${s.id}`}
                              >
                                Ver la salida
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="transition-all ease-linear rounded-2xl">
              <table className="min-w-full table bg-white text-sm rounded-2xl">
                <thead>
                  <tr>
                    <th className="text-left px-4 py-4 font-bold text-sky-700 uppercase text-sm">
                      Proveedor
                    </th>
                    <th className="text-left px-4 py-4 font-bold text-sky-700 uppercase text-sm">
                      Factura
                    </th>
                    <th className="text-left px-4 py-4 font-bold text-sky-700 uppercase text-sm">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200"></tbody>
              </table>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </section>
  );
};
