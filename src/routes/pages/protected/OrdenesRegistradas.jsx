import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { SyncLoader } from "react-spinners";
import { FaCheck } from "react-icons/fa";
import client from "../../../api/axios";
import * as XLSX from "xlsx";

export const OrdenesRegistradas = () => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [datos, setDatos] = useState([]);

  const [loading, setLoading] = useState(false);

  const obtenerIngresoRangoFechas = async (fechaInicio, fechaFin) => {
    try {
      // Setea el estado de loading a true para mostrar el spinner
      setLoading(true);

      // Validación de fechas
      if (!fechaInicio || !fechaFin) {
        console.error("Fechas no proporcionadas");
        return;
      }

      // Verifica y formatea las fechas
      fechaInicio = new Date(fechaInicio).toISOString().split("T")[0];
      fechaFin = new Date(fechaFin).toISOString().split("T")[0];

      const response = await client.post("/ordenes-rango-fechas", {
        fechaInicio,
        fechaFin,
      });

      setDatos(response.data); // Maneja la respuesta según tus necesidades
    } catch (error) {
      console.error("Error al obtener salidas:", error);
      // Maneja el error según tus necesidades
    } finally {
      // Independientemente de si la solicitud es exitosa o falla, establece el estado de loading a false
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const buscarIngresosPorFecha = () => {
    obtenerIngresoRangoFechas(fechaInicio, fechaFin);
  };

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

  // const totalCobroCliente = salidasMensuales.reduce(
  //   (total, item) => total + parseFloat(item.cobro_cliente),
  //   0
  // );

  // Obtener la fecha en formato de cadena (YYYY-MM-DD)
  const fechaActualString = fechaActual.toISOString().slice(0, 10);

  const itemsPerPage = 10; // Cantidad de elementos por página
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResults = datos?.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(datos?.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const rangeSize = 5;

  const startPage = Math.max(1, currentPage - Math.floor(rangeSize / 2));
  const endPage = Math.min(totalPages, startPage + rangeSize - 1);

  const totalFinalizados = currentResults.reduce((count, orden) => {
    // Incrementa el contador si la propiedad 'finalizado' es '1'
    return orden.finalizado === "1" ? count + 1 : count;
  }, 0);

  console.log("Total de órdenes finalizadas:", totalFinalizados);

  const totalPendientes = currentResults.reduce((count, orden) => {
    // Incrementa el contador si la propiedad 'finalizado' es '1'
    return orden.finalizado === "2" ? count + 1 : count;
  }, 0);

  console.log(datos);

  const downloadDataAsExcel = (datos) => {
    if (datos && datos.length > 0) {
      // Convert all data to an array of objects
      const dataArray = datos.map((data) => ({
        NUMERO: data.id,
        CHOFER: data.chofer.toUpperCase(),
        "FECHA DE LLEGADA": formatDate(data.fecha_llegada),
        "FECHA DE TURNO/FIRMA": formatDate(data.orden_firma),
        "ESTADO DE LA ORDEN":
          data.finalizado === "1" ? "FINALIZADO" : "PENDIENTE",
      }));

      // Define the worksheet columns
      const columns = [
        "NUMERO",
        "CHOFER",
        "FECHA DE LLEGADA",
        "FECHA DE TURNO/FIRMA",
        "ESTADO DE LA ORDEN",
        // Add more columns as needed
      ];

      // Create the worksheet
      const ws = XLSX.utils.json_to_sheet(dataArray, { header: columns });

      // Create a workbook and add the worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Datos");

      // Save the file
      XLSX.writeFile(wb, `all_datos.xlsx`);
    }
  };

  return (
    <section className="w-full h-full px-12 max-md:px-4 flex flex-col gap-8 py-24">
      <ToastContainer />
      <div className=" py-10 px-10 rounded-xl bg-white border-slate-300 border-[1px] shadow grid grid-cols-4 gap-3 mb-1 max-md:grid-cols-1 max-md:py-0 max-md:px-0 max-md:shadow-none max-md:border-none">
        <article className="flex flex-col gap-4 rounded-xl border border-slate-200 shadow bg-white p-6 max-mb:pb-3">
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
            <strong className="block text-sm font-medium text-gray-50 max-mb:text-xs">
              Total ordenes finalizadas
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900 max-mb:text-base">
                {Number(totalFinalizados)}
              </span>
            </p>
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-xl border border-slate-200 shadow bg-white p-6 max-mb:pb-3">
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
            <strong className="block text-sm font-medium text-gray-500">
              Total ordenes pendientes
            </strong>

            <p>
              <span className="text-2xl font-medium text-orange-500">
                {Number(totalPendientes)}
              </span>

              <span className="text-xs text-gray-500"> </span>
            </p>
          </div>
        </article>
      </div>

      <div>
        <button
          className="bg-green-500 py-2 px-6 text-white rounded-xl shadow max-md:text-sm"
          onClick={() => downloadDataAsExcel(datos)}
        >
          Descargar todo en formato excel
        </button>
      </div>

      <div className="mt-1">
        <div className="flex gap-6 items-center max-md:flex-col max-md:items-start">
          <div className="flex gap-2 items-center">
            <label className="text-base text-slate-700">Fecha de inicio</label>
            <input
              className="text-sm bg-white py-2 px-3 rounded-lg shadow border-slate-300 border-[1px] cursor-pointer text-slate-700 outline-none"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-base text-slate-700">Fecha fin</label>
            <input
              className="text-sm bg-white py-2 px-3 rounded-lg shadow border-slate-300 border-[1px] cursor-pointer text-slate-700 outline-none"
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />

            <button
              onClick={buscarIngresosPorFecha}
              className="bg-white border-slate-300 border-[1px] rounded-xl px-4 py-2 shadow flex gap-3 text-slate-700 hover:shadow-md transtion-all ease-in-out duration-200 max-md:py-1"
            >
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
            </button>
          </div>
        </div>
      </div>

      {/* tabla de datos  */}
      <div className="rounded-xl border-[1px] border-slate-300 shadow overflow-x-scroll">
        {loading ? (
          // Muestra el spinner mientras se cargan los datos
          <div className="flex justify-center items-center h-40">
            <SyncLoader color="#4A90E2" size={6} margin={6} />
            <p className="animate-blink text-slate-700 text-sm">
              Buscando los datos...
            </p>
          </div>
        ) : (
          <table className="w-full divide-y-2 divide-gray-200 text-sm">
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
                {/* <th className="px-4 py-4 text-slate-700 max-md:text-xs font-bold uppercase">
                  ACCIONES
                </th> */}
                <th className="px-4 py-4 text-slate-700 max-md:text-xs font-bold uppercase">
                  ESTADO
                </th>
              </tr>
            </thead>

            <tbody className="divide-y-[1px] divide-gray-300 w-full">
              {currentResults?.map((o) => (
                <tr key={o?.id}>
                  <td className="px-4 py-4 font-medium text-gray-900 max-md:text-xs capitalize text-center">
                    {o.id}
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-900 max-md:text-xs capitalize text-center">
                    {o.chofer}
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-900 max-md:text-xs capitalize text-center">
                    {formatDate(o.fecha_llegada)}
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-900 max-md:text-xs capitalize text-center">
                    {formatDate(o.orden_firma)}
                  </td>
                  <td className="text-center">
                    <button
                      className={`action-button ${
                        o.finalizado === "1"
                          ? "text-white-500 bg-green-500 text-white py-2 px-2 shadow rounded-xl font-semibold text-base"
                          : "text-sm bg-orange-500 rounded-xl py-2 px-3 text-white shadow"
                      } mr-2 text-center`}
                    >
                      {o.finalizado === "1" ? (
                        <FaCheck />
                      ) : (
                        <span className="flex gap-2 items-center">
                          PENDIENTE{" "}
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
        )}

        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center mt-4 mb-4 gap-1">
            <button
              className="mx-1 px-3 py-1 rounded bg-gray-100 shadow shadow-black/20 text-sm flex gap-1 items-center hover:bg-orange-500 transiton-all ease-in duration-100 hover:text-white"
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
              Anterior
            </button>
            {Array.from({ length: endPage - startPage + 1 }).map((_, index) => (
              <button
                key={index}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === startPage + index
                    ? "bg-orange-500 hover:bg-white transition-all ease-in-out text-white shadow shadow-black/20 text-sm"
                    : "bg-gray-100 shadow shadow-black/20 text-sm"
                }`}
                onClick={() => handlePageChange(startPage + index)}
              >
                {startPage + index}
              </button>
            ))}
            <button
              className="mx-1 px-3 py-1 rounded bg-gray-100 shadow shadow-black/20 text-sm flex gap-1 items-center hover:bg-orange-500 transiton-all ease-in duration-100 hover:text-white"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente{" "}
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
        )}
      </div>
    </section>
  );
};
