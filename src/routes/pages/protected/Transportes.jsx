import { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ModalCrearOrden } from "../../../components/Modales/ModalCrearOrden";
import { useOrdenesContext } from "../../../context/OrdenesProvider";
import { FaEdit, FaCheck, FaTrash, FaAd } from "react-icons/fa";
import { ModalEditarFinalizado } from "../../../components/Modales/ModalEditarFinalizado";
import { ModalEditarOrden } from "../../../components/Modales/ModalEditarOrden";
import { ModalEliminarOrden } from "../../../components/Modales/ModalEliminarOrden";

export const Transportes = () => {
  const { ordenesMensuales } = useOrdenesContext();

  const fechaActual = new Date();
  const numeroDiaActual = fechaActual.getDay(); // Obtener el día del mes actual

  const nombresDias = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  const numeroMesActual = fechaActual.getMonth() + 1; // Obtener el mes actual
  const nombresMeses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const nombreMesActual = nombresMeses[numeroMesActual - 1]; // Obtener el nombre del mes actual

  const nombreDiaActual = nombresDias[numeroDiaActual]; // Obtener el nombre del día actual

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDos, setIsOpenDos] = useState(false);
  const [isOpenTres, setIsOpenTres] = useState(false);
  const [isEliminar, setCloseEliminar] = useState(false);
  const [obtenerId, setObtenerId] = useState(null);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const openModalDos = () => setIsOpenDos(true);
  const closeModalDos = () => setIsOpenDos(false);

  const openModalTres = () => setIsOpenTres(true);
  const closeModalTres = () => setIsOpenTres(false);

  const closeEliminar = () => setCloseEliminar(false);
  const openEliminar = () => setCloseEliminar(true);

  const handleID = (id) => setObtenerId(id);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const itemsPerPage = 10; // Cantidad de elementos por página
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResults = ordenesMensuales?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(ordenesMensuales?.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const rangeSize = 5;

  const startPage = Math.max(1, currentPage - Math.floor(rangeSize / 2));
  const endPage = Math.min(totalPages, startPage + rangeSize - 1);

  const totalFinalizados = ordenesMensuales.reduce((count, orden) => {
    // Incrementa el contador si la propiedad 'finalizado' es '1'
    return orden.finalizado === "1" ? count + 1 : count;
  }, 0);

  console.log("Total de órdenes finalizadas:", totalFinalizados);

  const totalPendientes = ordenesMensuales.reduce((count, orden) => {
    // Incrementa el contador si la propiedad 'finalizado' es '1'
    return orden.finalizado === "2" ? count + 1 : count;
  }, 0);

  const [filtroChofer, setFiltroChofer] = useState("");

  return (
    <section className="w-full h-full px-12 max-md:px-4 flex flex-col gap-10 py-16 max-md:gap-6">
      <ToastContainer />
      <div className="py-10 px-10 rounded-xl bg-white border-slate-200 border-[1px] shadow grid grid-cols-3 gap-3 mb-8 max-md:grid-cols-1 max-md:border-none max-md:py-0 max-md:px-0 max-md:shadow-none">
        <article className="flex flex-col gap-4 rounded-xl border border-slate-200 shadow bg-white p-6 max-md:pb-1">
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

            <span className="text-xs font-medium">
              {" "}
              {Number(totalFinalizados)}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Total ordenes finalizadas
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900 max-md:text-sm">
                {Number(totalFinalizados)}
              </span>
            </p>
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-xl border border-slate-200 shadow bg-white p-6 max-md:pb-1">
          <div className="inline-flex gap-2 self-end rounded bg-green-100 p-1 text-green-600">
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
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
              />
            </svg>

            <span className="text-xs font-medium">{nombreMesActual}</span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Fecha Actual
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900 max-md:text-base">
                {nombreMesActual}
              </span>

              <span className="text-xs text-gray-500">
                {" "}
                Dia {nombreDiaActual}
              </span>
            </p>
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-lg border border-slate-200 shadow bg-white p-6 max-md:pb-1">
          <div className="inline-flex gap-2 self-end rounded bg-orange-100 p-1 text-orange-600">
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

            <span className="text-xs font-medium">
              {" "}
              {Number(totalPendientes)}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Total ordenes pendientes
            </strong>

            <p>
              <span className="text-2xl font-medium text-orange-500 max-md:text-base">
                {Number(totalPendientes)}
              </span>

              <span className="text-xs text-gray-500"> </span>
            </p>
          </div>
        </article>
      </div>
      <div className="flex gap-5 max-md:flex-col max-md:text-sm">
        <Link
          onClick={() => openModal()}
          className="bg-black py-3 px-6 rounded-xl text-white flex gap-2 items-center"
        >
          Crear un nuevo orden de llegada de Transportes
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
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </Link>

        <Link
          to={"/ordenes-registradas"}
          className="bg-white border-slate-300 border-[1px] py-3 px-6 rounded-xl text-blacks flex gap-2 items-center"
        >
          Ver registros de orden de llegadas
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
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </Link>
      </div>
      <div className="border border-slate-300 shadow rounded-xl px-4 py-2 w-1/5 flex justify-between items-center max-md:text-sm max-md:w-full">
        <input
          type="text"
          placeholder="Filtrar por chofer"
          value={filtroChofer}
          onChange={(e) => setFiltroChofer(e.target.value)}
          className=" outline-none uppercase"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-slate-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </div>
      <div className="rounded-xl border-[1px] border-slate-300 shadow max-md:overflow-x-scroll">
        <table className="divide-y-2 divide-gray-200 text-sm w-full">
          <thead>
            <tr>
              <th className="px-4 py-4 text-slate-700 max-md:text-xs font-bold uppercase">
                NUMERO
              </th>
              <th className="px-4 py-4 text-slate-700 max-md:text-xs font-bold uppercase">
                TRANSPORTISTA
              </th>
              <th className="px-4 py-4 text-slate-700 max-md:text-xs font-bold uppercase">
                FECHA DE LLEGADA
              </th>
              <th className="px-4 py-4 text-slate-700 max-md:text-xs font-bold uppercase">
                FECHA DE TURNO/FIRMA
              </th>
              <th className="px-4 py-4 text-slate-700 max-md:text-xs font-bold uppercase">
                ACCIONES
              </th>
              <th className="px-4 py-4 text-slate-700 max-md:text-xs font-bold uppercase">
                ORDEN
              </th>
            </tr>
          </thead>

          <tbody className="divide-y-[1px] divide-gray-300 w-full">
            {currentResults
              ?.filter((o) =>
                o.chofer.toLowerCase().includes(filtroChofer.toLowerCase())
              )
              .sort((a, b) => {
                // Ordena primero por órdenes pendientes (finalizado === "2")
                if (a.finalizado === "2" && b.finalizado === "1") return -1;
                if (a.finalizado === "1" && b.finalizado === "2") return 1;
                // Si ambas órdenes tienen el mismo estado, mantén el orden actual
                return 0;
              })
              .map((o) => (
                <tr key={o?.id}>
                  <td className="px-4 py-4 font-medium text-gray-900 text-center max-md:text-xs uppercase">
                    {o.id}
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-900 text-center max-md:text-xs uppercase">
                    {o.chofer}
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-900 text-center max-md:text-xs uppercase">
                    {formatDate(o.fecha_llegada)}
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-900 text-center max-md:text-xs uppercase">
                    {formatDate(o.orden_firma)}
                  </td>
                  <td className="flex justify-center items-center py-5">
                    <button
                      onClick={() => {
                        handleID(o.id), openModalTres();
                      }}
                      className="action-button text-blue-500 font-semibold text-xl mr-2 text-center max-md:text-base"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => {
                        handleID(o.id), openEliminar();
                      }}
                      className="action-button text-red-700 font-semibold text-xl text-center max-md:text-base"
                    >
                      <FaTrash />
                    </button>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => {
                        handleID(o.id), openModalDos();
                      }}
                      className={`action-button ${
                        o.finalizado === "1"
                          ? "text-white-500 bg-green-500 text-white py-2 px-2 shadow rounded-xl font-semibold text-base"
                          : "text-sm bg-orange-500 rounded-xl py-2 px-3 text-white shadow"
                      } mr-2 text-center max-md:text-xs`}
                    >
                      {o.finalizado === "1" ? (
                        <FaCheck />
                      ) : (
                        <span className="flex gap-2 items-center">
                          PENDIENTE{" "}
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
                              d="m19.5 8.25-7.5 7.5-7.5-7.5"
                            />
                          </svg>
                        </span>
                      )}{" "}
                      {/* Usa FaOtherIcon para el otro icono */}
                    </button>
                    {/* Otros botones de acción */}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center mt-1 mb-4 gap-1">
          <button
            className="mx-1 px-3 py-1 rounded bg-gray-100 hover:text-white shadow shadow-black/20 text-sm flex gap-1 items-center hover:bg-orange-500 transiton-all ease-in duration-100 hov4r:text-slate-700 cursor-pointer"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          {Array.from({ length: endPage - startPage + 1 }).map((_, index) => (
            <button
              key={index}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === startPage + index
                  ? "bg-orange-500 hover:bg-white hover:text-black transition-all ease-in-out text-white shadow shadow-black/20 text-sm"
                  : "bg-gray-100  shadow shadow-black/20 text-sm cursor-pointer"
              }`}
              onClick={() => handlePageChange(startPage + index)}
            >
              {startPage + index}
            </button>
          ))}
          <button
            className="mx-1 px-3 py-1 rounded bg-gray-100 shadow shadow-black/20 text-sm flex gap-1 items-center hover:bg-orange-500 transiton-all ease-in duration-100 hover:text-white cursor-pointer"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      )}{" "}
      <ModalEliminarOrden
        closeEliminar={closeEliminar}
        eliminarModal={isEliminar}
        obtenerId={obtenerId}
      />
      {/* <EditableTable /> */}
      <ModalCrearOrden closeModal={closeModal} isOpen={isOpen} />
      <ModalEditarFinalizado
        obtenerId={obtenerId}
        isOpen={isOpenDos}
        closeModal={closeModalDos}
      />
      <ModalEditarOrden
        obtenerId={obtenerId}
        isOpen={isOpenTres}
        closeModal={closeModalTres}
      />
    </section>
  );
};
