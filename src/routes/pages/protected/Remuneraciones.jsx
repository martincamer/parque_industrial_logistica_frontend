import { Link } from "react-router-dom";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { useRemuneracionContext } from "../../../context/RemuneracionesProvider";
import { ModalEliminarRecaudacion } from "../../../components/Modales/ModalEliminarRecaudacion";
import { ModalCrearRemuneracion } from "../../../components/Modales/ModalCrearRemuneracion";
import { ModalEditarRemuneracion } from "../../../components/Modales/ModalEditarRemuneracion";

export const Remuneraciones = () => {
  const { remuneracionesMensuales } = useRemuneracionContext();

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

  const totalRecaudación = remuneracionesMensuales.reduce(
    (total, item) => total + parseFloat(item.recaudacion),

    0
  );
  // Obtener la fecha en formato de cadena (YYYY-MM-DD)
  const fechaActualString = fechaActual.toISOString().slice(0, 10);

  // Filtrar los objetos de 'data' que tienen la misma fecha que la fecha actual
  const ventasDelDia = remuneracionesMensuales?.filter(
    (item) => item?.created_at.slice(0, 10) === fechaActualString
  );

  // Encontrar la venta más reciente del día
  const ultimaVentaDelDia = ventasDelDia?.reduce((ultimaVenta, venta) => {
    // Convertir las fechas de cadena a objetos Date para compararlas
    const fechaUltimaVenta = new Date(ultimaVenta?.created_at);
    const fechaVenta = new Date(venta?.created_at);

    // Retornar la venta con la hora más reciente
    return fechaVenta > fechaUltimaVenta ? venta : ultimaVenta;
  }, ventasDelDia[0]);

  const itemsPerPage = 10; // Cantidad de elementos por página
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Ordenar el arreglo de remuneracionesMensuales por ID de mayor a menor
  const sortedRemuneracionesMensuales = remuneracionesMensuales
    .slice()
    .sort((a, b) => b.id - a.id);

  // Calcular el índice del último y primer elemento de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Obtener los resultados de la página actual
  const currentResults = sortedRemuneracionesMensuales.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Calcular el número total de páginas
  const totalPages = Math.ceil(
    sortedRemuneracionesMensuales.length / itemsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const rangeSize = 5;

  const startPage = Math.max(1, currentPage - Math.floor(rangeSize / 2));
  const endPage = Math.min(totalPages, startPage + rangeSize - 1);

  const [searchTermCliente, setSearchTermCliente] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  // Obtener lista de usuarios únicos
  const uniqueUsers = Array.from(
    new Set(
      sortedRemuneracionesMensuales.map((remuneracion) =>
        remuneracion.usuario.toLowerCase()
      )
    )
  );

  // Filtrar por cliente y usuario
  const filteredResults = currentResults.filter((salida) =>
    salida.datos_cliente.datosCliente.some(
      (d) =>
        d.cliente.toLowerCase().includes(searchTermCliente.toLowerCase()) &&
        (selectedUser === "" || salida.usuario.toLowerCase() === selectedUser)
    )
  );

  const [eliminarModal, setEliminarModal] = useState(false);
  const [obtenerId, setObtenerId] = useState(null);

  const openEliminar = () => {
    setEliminarModal(true);
  };

  const closeEliminar = () => {
    setEliminarModal(false);
  };

  const handleId = (id) => setObtenerId(id);

  const totalDatos = remuneracionesMensuales.reduce((total, salida) => {
    return (
      total +
      (salida.datos_cliente.datosCliente
        ? salida.datos_cliente.datosCliente.length
        : 0)
    );
  }, 0);

  const totalDatosMetrosCuadrados = remuneracionesMensuales?.reduce(
    (total, salida) => {
      return (
        total +
        (salida?.datos_cliente?.datosCliente?.reduce((subtotal, cliente) => {
          return subtotal + Number(cliente.metrosCuadrados);
        }, 0) || 0)
      );
    },
    0
  );

  const [obtenerID, setObtenerID] = useState(null);

  const handleID = (id) => setObtenerID(id);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModalEditar, setIsOpenModalEditar] = useState(false);

  const openModal = () => {
    setIsOpenModal(true);
  };

  const closeModal = () => {
    setIsOpenModal(false);
  };

  const openModalDos = () => {
    setIsOpenModalEditar(true);
  };

  const closeModalDos = () => {
    setIsOpenModalEditar(false);
  };

  return (
    <section className="w-full h-full px-12 max-md:px-4 flex flex-col gap-10 py-16 max-h-full min-h-full max-md:gap-5">
      <ToastContainer />
      <div className=" py-10 px-10 rounded-xl bg-white border-slate-200 border-[1px] shadow grid grid-cols-4 gap-3 mb-6 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-0 max-md:px-0">
        <article className="flex flex-col gap-4 rounded-xl border border-slate-200 shadow bg-white p-6 max-md:p-3">
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
              {Number(totalRecaudación / 10000).toFixed(2)} %{" "}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Total remuneraciones
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900 max-md:text-base">
                {Number(totalRecaudación).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>

              <span className="text-xs text-gray-500">
                {" "}
                ultima remuneracion del día, el total es de{" "}
                {Number(ultimaVentaDelDia?.recaudacion || 0).toLocaleString(
                  "es-AR",
                  {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  }
                )}{" "}
              </span>
            </p>
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-xl border border-slate-200 shadow bg-white p-6 max-md:p-3">
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

            <span className="text-xs font-medium">MARZO</span>
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

        <article className="flex flex-col gap-4 rounded-xl border border-slate-200 shadow bg-white p-6 max-md:p-3">
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
              {Number(totalDatos / 100).toFixed(2)} %{" "}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Total salidas/viviendas
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900 max-md:text-base">
                {totalDatos}
              </span>

              <span className="text-xs text-gray-500">
                {" "}
                Total viviendas entregadas {totalDatos}{" "}
              </span>
            </p>
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-xl border border-slate-200 shadow bg-white p-6 max-md:p-3">
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
              {Number(totalDatosMetrosCuadrados / 10000).toFixed(2)} %{" "}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Total en metros cuadradados
            </strong>

            <p>
              <span className="text-3xl font-medium text-gray-900 max-md:text-base">
                {Number(totalDatosMetrosCuadrados).toFixed(2)}
              </span>

              <span className="text-xs text-gray-500">
                {" "}
                Total en el mes {Number(totalDatosMetrosCuadrados).toFixed(
                  2
                )}{" "}
                mts{" "}
              </span>
            </p>
          </div>
        </article>
      </div>

      <div className="flex gap-5 max-md:gap-2">
        <Link
          onClick={() => openModal()}
          className="bg-black py-3 px-6 rounded-xl text-white flex gap-2 items-center max-md:text-sm max-md:py-2 max-md:px-2"
        >
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

        <Link
          to={"/remuneraciones-registradas"}
          className="bg-white border-slate-300 border-[1px] py-3 px-6 rounded-xl text-blacks flex gap-2 items-center max-md:text-sm max-md:py-2 max-md:px-2"
        >
          Ver remuneraciones
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

      <div className="flex gap-2 items-center w-1/2 max-md:w-full">
        <div className="py-2 px-4 border-slate-300 border-[1px] shadow rounded-xl w-full max-md:text-sm">
          <input
            value={searchTermCliente}
            onChange={(e) => setSearchTermCliente(e.target.value)}
            type="text"
            className="outline-none text-slate-600 w-full"
            placeholder="Buscar por cliente"
          />
          {/* Icono de búsqueda para cliente */}
        </div>
        <div className="py-2 px-4 border-slate-300 border-[1px] shadow rounded-xl w-full bg-white max-md:text-sm">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="outline-none text-slate-600 bg-white w-full"
          >
            <option value="">Seleccionar usuario...</option>
            {uniqueUsers.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="max-md:block md:hidden">
        <div className="font-bold text-base text-slate-600 uppercase underline pb-3">
          Datos Registrados
        </div>
        <div className="grid grid-cols-2 gap-2">
          {filteredResults
            // .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Ordena por created_at en orden descendente
            .map((datos) => (
              <div className="border-slate-300 shadow border-[1px] py-3 px-3 rounded-xl flex flex-col gap-2">
                <p className="text-xs font-bold capitalize">
                  Numero: {datos.id}
                </p>
                <p className="text-xs font-bold capitalize">
                  Creador:{" "}
                  <span className="font-normal text-slate-700">
                    {datos.usuario}
                  </span>
                </p>
                <div className="flex flex-col gap-1 font-bold text-xs">
                  <p>Clientes:</p>
                  <div className="font-normal capitalize text-slate-700">
                    {datos.datos_cliente.datosCliente.map((c) => (
                      <div>
                        {c.cliente} ({c.numeroContrato})
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-start">
                  <p className="font-bold text-xs">Recaudacion</p>
                  <p
                    className={`px-4 py-2 font-bold text-xs text-${
                      datos.recaudacion >= 0 ? "green" : "red"
                    }-500 capitalize`}
                  >
                    {Number(datos.recaudacion).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      minimumIntegerDigits: 2,
                    })}
                  </p>
                </div>
                <div className="flex gap-2 w-full justify-center">
                  <button
                    onClick={() => {
                      handleId(datos.id), openEliminar();
                    }}
                    type="button"
                    className="bg-red-100 py-2 px-2 text-center rounded-xl text-red-800"
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
                        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </button>
                  <Link
                    onClick={() => {
                      handleID(datos.id), openModalDos();
                    }}
                    className="bg-green-500 py-2 px-2 text-center rounded-xl text-white"
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
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                  </Link>

                  <Link
                    to={`/recaudacion/${datos.id}`}
                    className="bg-black py-2 px-2 text-center rounded-xl text-white"
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
                        d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                      />
                    </svg>
                  </Link>
                </div>{" "}
              </div>
            ))}
        </div>
      </div>

      {/* tabla de datos  */}
      <div className="rounded-xl border-[1px] border-slate-300 shadow max-md:hidden">
        <table className="w-full divide-y-2 divide-gray-200 text-sm">
          <thead className="text-left">
            <tr>
              <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                Numero
              </th>
              <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                Creador
              </th>
              <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                Clientes
              </th>
              <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                Fecha de carga
              </th>
              <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                Fecha de entrega
              </th>
              <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                Recaudación Final
              </th>
              <th className="px-1 py-4  text-slate-800 font-bold uppercase">
                Eliminar
              </th>
              <th className="px-1 py-4  text-slate-800 font-bold uppercase">
                Editar
              </th>
              <th className="px-1 py-4  text-slate-800 font-bold uppercase">
                Ver los datos/resumen
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredResults.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-2 font-medium text-gray-900 capitalize">
                  {s.id}
                </td>
                <td className="px-4 py-2 font-medium text-gray-900 capitalize">
                  {s.usuario}
                </td>
                <td className="px-4 py-2 font-medium text-gray-900 capitalize">
                  {s.datos_cliente.datosCliente.map((c) => (
                    <div>
                      {c.cliente}({c.numeroContrato})
                    </div>
                  ))}
                </td>
                <td className="px-4 py-2 font-medium text-gray-900 capitalize">
                  {s.fecha_carga.split("T")[0]}
                </td>
                <td className="px-4 py-2 font-medium text-gray-900 capitalize">
                  {s.fecha_entrega.split("T")[0]}
                </td>
                <td
                  className={`px-4 py-2 font-bold text-${
                    s.recaudacion >= 0 ? "green" : "red"
                  }-500 capitalize`}
                >
                  {Number(s.recaudacion).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  })}
                </td>
                <td className="px-1 py-2 font-medium text-gray-900 capitalize w-[150px] cursor-pointer">
                  <button
                    onClick={() => {
                      handleId(s.id), openEliminar();
                    }}
                    type="button"
                    className="bg-red-100 py-2 px-5 text-center rounded-xl text-red-800"
                  >
                    Eliminar
                  </button>
                </td>
                <td className="px-1 py-2 font-medium text-gray-900 capitalize w-[150px] cursor-pointer">
                  <Link
                    onClick={() => {
                      handleID(s.id), openModalDos();
                    }}
                    className="bg-green-500 py-2 px-5 text-center rounded-xl text-white"
                  >
                    Editar
                  </Link>
                </td>
                <td className="px-1 py-2 font-medium text-gray-900 capitalize cursor-pointer">
                  <Link
                    to={`/recaudacion/${s.id}`}
                    className="bg-black py-2 px-5 text-center rounded-xl text-white"
                  >
                    Ver Recaudación
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

      <ModalCrearRemuneracion isOpen={isOpenModal} closeModal={closeModal} />

      <ModalEliminarRecaudacion
        closeEliminar={closeEliminar}
        eliminarModal={eliminarModal}
        obtenerId={obtenerId}
      />

      <ModalEditarRemuneracion
        obtenerID={obtenerID}
        isOpen={isOpenModalEditar}
        closeModal={closeModalDos}
      />
    </section>
  );
};
