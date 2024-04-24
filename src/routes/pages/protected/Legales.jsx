import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthProvider";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { useLegalesContext } from "../../../context/LegalesProvider";
import { ModalEliminarLegales } from "../../../components/Modales/ModalEliminarLegales";
import { ModalCrearLegales } from "../../../components/Modales/ModalCrearLegales";
import { ModalEditarLegales } from "../../../components/Modales/ModalEditarLegales";
import { ModalVerClienteRemuneracion } from "../../../components/Modales/ModalVerClienteRemuneracion";
import { FaHouseChimneyUser } from "react-icons/fa6";

export const Legales = () => {
  const { legales, legalesMensualesAdmin } = useLegalesContext();

  const { user } = useAuth();

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

  const totalRecaudación = legales.reduce(
    (total, item) => total + parseFloat(item.recaudacion),

    0
  );
  // Obtener la fecha en formato de cadena (YYYY-MM-DD)
  const fechaActualString = fechaActual.toISOString().slice(0, 10);

  // Filtrar los objetos de 'data' que tienen la misma fecha que la fecha actual
  const ventasDelDia = legales?.filter(
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

  const sortedRemuneracionesMensuales = legales
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

  const totalDatos = legales.reduce((total, salida) => {
    return (
      total +
      (salida.datos_cliente.datosCliente
        ? salida.datos_cliente.datosCliente.length
        : 0)
    );
  }, 0);

  const totalDatosMetrosCuadrados = legales?.reduce((total, salida) => {
    return (
      total +
      (salida?.datos_cliente?.datosCliente?.reduce((subtotal, cliente) => {
        return subtotal + Number(cliente.metrosCuadrados);
      }, 0) || 0)
    );
  }, 0);

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

  const [isOpenVerCliente, setIsOpenVerCliente] = useState(false);

  const openVerCliente = () => {
    setIsOpenVerCliente(true);
  };

  const closeVerCliente = () => {
    setIsOpenVerCliente(false);
  };

  const esNegativo = Number(totalRecaudación) > 0;

  // Clases para el indicador visual
  const indicadorColor = esNegativo
    ? "bg-red-100 text-red-600"
    : "bg-red-100 text-red-600";
  const porcentajeColor = esNegativo ? "text-red-600" : "text-red-600";

  /////////////////ADMIN////////////////////////
  const itemsPerPageAdmin = 10; // Cantidad de elementos por página para administración
  const [currentPageAdmin, setCurrentPageAdmin] = useState(1);

  const sortedRemuneracionesMensualesAdmin = legalesMensualesAdmin
    .slice()
    .sort((a, b) => b.id - a.id);

  // Calcular el índice del último y primer elemento de la página actual
  const indexOfLastItemAdmin = currentPageAdmin * itemsPerPageAdmin;
  const indexOfFirstItemAdmin = indexOfLastItemAdmin - itemsPerPageAdmin;

  // Obtener los resultados de la página actual
  const currentResultsAdmin = sortedRemuneracionesMensualesAdmin.slice(
    indexOfFirstItemAdmin,
    indexOfLastItemAdmin
  );

  // Calcular el número total de páginas
  const totalPagesAdmin = Math.ceil(
    sortedRemuneracionesMensualesAdmin.length / itemsPerPageAdmin
  );

  const handlePageChangeAdmin = (newPageAdmin) => {
    setCurrentPageAdmin(newPageAdmin);
  };

  const rangeSizeAdmin = 5;

  const startPageAdmin = Math.max(
    1,
    currentPageAdmin - Math.floor(rangeSizeAdmin / 2)
  );
  const endPageAdmin = Math.min(
    totalPagesAdmin,
    startPageAdmin + rangeSizeAdmin - 1
  );

  const [searchTermClienteAdmin, setSearchTermClienteAdmin] = useState("");
  const [selectedUserAdmin, setSelectedUserAdmin] = useState("");

  // Obtener lista de usuarios únicos
  const uniqueUsersAdmin = Array.from(
    new Set(
      sortedRemuneracionesMensualesAdmin.map((remuneracion) =>
        remuneracion.usuario.toLowerCase()
      )
    )
  );

  const [selectedLocalidad, setSelectedLocalidad] = useState("");

  const uniqueLocalidad = Array.from(
    new Set(
      legalesMensualesAdmin.map((salida) => salida.localidad.toLowerCase())
    )
  );

  const filteredResultsAdmin = currentResultsAdmin.filter(
    (salida) =>
      salida.datos_cliente.datosCliente.some((d) =>
        d.cliente.toLowerCase().includes(searchTermClienteAdmin.toLowerCase())
      ) &&
      (selectedUserAdmin === "" ||
        salida.usuario.toLowerCase() === selectedUserAdmin) &&
      (selectedLocalidad === "" ||
        salida.localidad.toLowerCase() === selectedLocalidad.toLowerCase())
  );

  // Filtrar por cliente y usuario
  // const filteredResultsAdmin = currentResultsAdmin.filter((salida) =>
  //   salida.datos_cliente.datosCliente.some(
  //     (d) =>
  //       d.cliente
  //         .toLowerCase()
  //         .includes(searchTermClienteAdmin.toLowerCase()) &&
  //       (selectedUserAdmin === "" ||
  //         salida.usuario.toLowerCase() === selectedUserAdmin)
  //   )
  // );

  const totalDatosAdmin = filteredResultsAdmin.reduce((total, salida) => {
    return (
      total +
      (salida.datos_cliente.datosCliente
        ? salida.datos_cliente.datosCliente.length
        : 0)
    );
  }, 0);

  const totalDatosMetrosCuadradosAdmin = filteredResultsAdmin?.reduce(
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

  const totalRecaudaciónAdmin = filteredResultsAdmin.reduce(
    (total, item) => total + parseFloat(item.recaudacion),

    0
  );

  return user.localidad === "admin" ? (
    <section className="w-full h-full px-12 max-md:px-4 flex flex-col gap-10 max-md:gap-5 py-16 max-h-full min-h-full">
      <ToastContainer />
      <div className="uppercase grid grid-cols-4 gap-3 mb-6 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-0 max-md:px-0">
        <article
          className={`flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer`}
        >
          <div
            className={`inline-flex gap-2 self-end rounded ${indicadorColor} p-1`}
          >
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
                d={
                  esNegativo
                    ? "M11 17l-8-8m0 0v8m0-8h8m13 0h-8m0 0v8"
                    : "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                }
              />
            </svg>
            <span className="text-xs font-medium">
              {Number(totalRecaudaciónAdmin / 10000).toFixed(2)} %
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-slate-500 max-md:text-xs">
              Total en legales
            </strong>

            <p>
              <span
                className={`text-2xl font-medium ${porcentajeColor} max-md:text-base`}
              >
                {Number(totalRecaudaciónAdmin).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>
            </p>
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer">
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

            <span className="text-xs font-medium">
              {" "}
              {Number(totalDatosAdmin / 100).toFixed(2)} %{" "}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Total legales/viviendas
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900 max-md:text-base">
                {totalDatosAdmin}
              </span>

              <span className="text-xs text-gray-500">
                {" "}
                Total viviendas entregadas {totalDatosAdmin}{" "}
              </span>
            </p>
          </div>
        </article>

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

            <span className="text-xs font-medium">
              {" "}
              {Number(totalDatosMetrosCuadradosAdmin / 10000).toFixed(2)} %{" "}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Total en metros cuadradados
            </strong>

            <p>
              <span className="text-3xl font-medium text-gray-900 max-md:text-base">
                {Number(totalDatosMetrosCuadradosAdmin).toFixed(2)}
              </span>

              <span className="text-xs text-gray-500">
                {" "}
                Total en el mes{" "}
                {Number(totalDatosMetrosCuadradosAdmin).toFixed(2)} mts{" "}
              </span>
            </p>
          </div>
        </article>
      </div>
      <div className="flex">
        <Link
          to={"/legales-registrados"}
          className="bg-white border-slate-300 border-[1px] py-2 px-3 rounded-xl text-blacks flex gap-2 items-center text-sm justify-between uppercase"
        >
          Ver legales/filtrar por mes
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
      <div className="flex gap-2 items-center w-1/2 max-md:flex-col max-md:w-full">
        <div className="py-2 px-4 border-slate-300 border-[1px] shadow rounded-xl w-full">
          <input
            value={searchTermClienteAdmin}
            onChange={(e) => setSearchTermClienteAdmin(e.target.value)}
            type="text"
            className="outline-none text-slate-600 w-full max-md:text-sm uppercase"
            placeholder="Buscar por cliente"
          />
          {/* Icono de búsqueda para cliente */}
        </div>
        <div className="py-2 px-4 max-md:text-sm border-slate-300 border-[1px] shadow rounded-xl w-full bg-white">
          <select
            value={selectedLocalidad}
            onChange={(e) => setSelectedLocalidad(e.target.value)}
            className="outline-none text-slate-600 bg-white w-full uppercase"
          >
            <option className="uppercase" value="">
              Seleccionar localidad...
            </option>
            {uniqueLocalidad.map((user) => (
              <option className="uppercase" key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
        </div>
        <div className="py-2 px-4 border-slate-300 border-[1px] shadow rounded-xl w-full bg-white">
          <select
            value={selectedUserAdmin}
            onChange={(e) => setSelectedUserAdmin(e.target.value)}
            className="outline-none text-slate-600 bg-white w-full max-md:text-sm uppercase"
          >
            <option value="">Seleccionar usuario</option>
            {uniqueUsersAdmin.map((user) => (
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
        <div className="grid grid-cols-1 gap-2">
          {filteredResultsAdmin.map((datos) => (
            <div className="border-slate-300 shadow border-[1px] py-3 px-3 rounded-xl flex justify-between items-center gap-2">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-bold uppercase">
                  Numero: {datos.id}
                </p>
                <p className="text-xs font-bold uppercase">
                  Creador:{" "}
                  <span className="font-normal text-slate-700">
                    {datos.usuario}
                  </span>
                </p>
                <div className="flex flex-col gap-1 font-bold text-xs">
                  <p className="uppercase">Clientes:</p>
                  <div className="font-normal uppercase text-slate-700">
                    {datos.datos_cliente.datosCliente.map((c) => (
                      <div>
                        {c.cliente} ({c.numeroContrato})
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-1 items-start">
                  <p className="font-bold text-xs items-start uppercase">
                    Recaudacion
                  </p>
                  <p
                    className={`font-bold text-xs text-${
                      datos.recaudacion >= 0 ? "green" : "red"
                    }-500 uppercase`}
                  >
                    {Number(datos.recaudacion).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      minimumIntegerDigits: 2,
                    })}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full items-end h-[80px] overflow-y-scroll">
                <button
                  onClick={() => {
                    handleId(datos.id), openEliminar();
                  }}
                  type="button"
                  className="bg-red-100 py-2 px-2 text-center rounded-xl text-red-800 flex items-center gap-1"
                >
                  <span className="text-xs">ELIMINAR</span>
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
                  className="bg-green-500 py-2 px-2 text-center rounded-xl text-white flex items-center gap-1"
                >
                  <span className="text-xs">EDITAR</span>
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
                  to={`/legales  /${datos.id}`}
                  className="bg-black py-2 px-2 text-center rounded-xl text-white flex items-center gap-1"
                >
                  <span className="text-xs">VER LEGALES</span>
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
      <div className="rounded-2xl border-[1px] border-slate-300 hover:shadow max-md:hidden">
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
                Fabrica/Sucursal
              </th>
              <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                Localidad
              </th>
              <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                Clientes
              </th>
              <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                Fecha de creación
              </th>
              <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                Mes de creación
              </th>
              <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                Total Final
              </th>
              <th className="px-1 py-4  text-slate-800 font-bold uppercase text-center">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 uppercase">
            {filteredResultsAdmin.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-3 font-medium text-gray-900 uppercase">
                  {s.id}
                </td>
                <td className="px-4 py-3 font-bold text-gray-900 uppercase">
                  {s.usuario}
                </td>
                <td className="px-4 py-3 font-bold text-gray-900 uppercase">
                  {s.sucursal}
                </td>
                <td className="px-4 py-3 font-bold text-gray-900 uppercase">
                  {s.localidad}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 upppercase">
                  <button
                    onClick={() => {
                      handleID(s.id), openVerCliente();
                    }}
                    type="button"
                    className="bg-orange-100 py-2 px-3 rounded-2xl text-orange-700  hover:shadow-md transition-all ease-linear flex gap-2 items-center"
                  >
                    VER CLIENTE/LOCALIDAD{" "}
                    <FaHouseChimneyUser className="text-2xl" />
                  </button>
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 uppercase">
                  {s.created_at.split("T")[0]}
                </td>
                <td className="px-4 py-3 font-bold text-gray-900 uppercase">
                  {new Date(s.created_at).toLocaleString("default", {
                    month: "long",
                  })}
                </td>
                <td
                  className={`px-4 py-3 font-bold text-${
                    s.recaudacion >= 0 ? "green" : "red"
                  }-600 uppercase`}
                >
                  {Number(s.recaudacion).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  })}
                </td>
                <td className="px-1 py-3 font-medium text-gray-900 uppercase w-[150px] cursor-pointer">
                  <div className="flex">
                    <Link
                      to={`/legales/${s.id}`}
                      className="flex gap-2 items-center bg-black border-[1px] border-black py-1 hover:border-slate-300 hover:bg-white hover:text-slate-700 hover:border-[1px] hover:shadaw transition-all ease-linear px-5 text-center rounded-xl text-white"
                    >
                      {/* Ver Recaudación */}

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
                          d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPagesAdmin > 1 && (
        <div className="flex flex-wrap justify-center mt-4 mb-4 gap-1">
          <button
            className="mx-1 px-3 py-1 rounded bg-gray-100 shadow shadow-black/20 text-sm flex gap-1 items-center hover:bg-orange-500 transiton-all ease-in duration-100 hover:text-white"
            onClick={() => handlePageChangeAdmin(currentPageAdmin - 1)}
            disabled={currentPageAdmin === 1}
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
          {Array.from({ length: endPageAdmin - startPageAdmin + 1 }).map(
            (_, index) => (
              <button
                key={index}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPageAdmin === startPageAdmin + index
                    ? "bg-orange-500 hover:bg-white hover:text-black transition-all ease-in-out text-white shadow shadow-black/20 text-sm"
                    : "bg-gray-100 shadow shadow-black/20 text-sm"
                }`}
                onClick={() => handlePageChangeAdmin(startPageAdmin + index)}
              >
                {startPageAdmin + index}
              </button>
            )
          )}
          <button
            className="mx-1 px-3 py-1 rounded bg-gray-100 shadow shadow-black/20 text-sm flex gap-1 items-center hover:bg-orange-500 transiton-all ease-in duration-100 hover:text-white"
            onClick={() => handlePageChangeAdmin(currentPageAdmin + 1)}
            disabled={currentPageAdmin === totalPagesAdmin}
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
      )}

      <ModalVerClienteRemuneracion
        isOpen={isOpenVerCliente}
        closeOpen={closeVerCliente}
        obtenerId={obtenerID}
      />
    </section>
  ) : (
    <section className="w-full h-full px-12 max-md:px-4 flex flex-col gap-10 max-md:gap-5 py-16 max-h-full min-h-full">
      <ToastContainer />
      <div className="uppercase grid grid-cols-4 gap-3 mb-6 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-0 max-md:px-0">
        <article
          className={`flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer`}
        >
          <div
            className={`inline-flex gap-2 self-end rounded ${indicadorColor} p-1`}
          >
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
                d={
                  esNegativo
                    ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    : "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                }
              />
            </svg>
            <span className="text-xs font-medium">
              {Number(totalRecaudación / 10000).toFixed(2)} %
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-slate-500 max-md:text-xs">
              Total en legales
            </strong>

            <p>
              <span
                className={`text-2xl font-medium ${porcentajeColor} max-md:text-base`}
              >
                -{" "}
                {Number(totalRecaudación).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>

              <span className="text-xs text-gray-500">
                {" "}
                ultimo legal del día, el total es de{" "}
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

        <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer">
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

            <span className="text-xs font-medium">
              {" "}
              {Number(totalDatos / 100).toFixed(2)} %{" "}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Total legales/viviendas
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
      <div className="gap-5 max-md:hidden md:flex">
        <Link
          onClick={() => openModal()}
          className="bg-black uppercase text-sm py-3 px-6 rounded-xl text-white flex gap-2 items-center max-md:text-sm max-md:py-2 max-md:px-2"
        >
          Crear nuevo legal
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
          to={"/legales-registrados"}
          className="bg-white uppercase text-sm py-3 px-6 rounded-xl text-slate-700 border-[1px] border-slate-300 flex gap-2 items-center max-md:text-sm max-md:py-2 max-md:px-2"
        >
          Ver legales registrados
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
      <div className="max-md:flex gap-1  md:hidden">
        <Link
          to={"/crear-legal"}
          className="bg-black py-1 px-2 text-sm rounded-xl text-white flex gap-2 items-center w-full justify-between"
        >
          Crear Legal
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
          to={"/legales-registrados"}
          className="bg-white border-slate-300 border-[1px] py-2 px-3 rounded-xl text-blacks flex gap-2 items-center text-sm w-full justify-between"
        >
          Ver legales
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
      <div className="flex gap-2 items-center w-1/2 max-md:flex-col max-md:w-full">
        <div className="py-2 px-4 border-slate-300 border-[1px] shadow rounded-xl w-full">
          <input
            value={searchTermCliente}
            onChange={(e) => setSearchTermCliente(e.target.value)}
            type="text"
            className="outline-none text-slate-600 w-full max-md:text-sm uppercase"
            placeholder="Buscar por cliente"
          />
          {/* Icono de búsqueda para cliente */}
        </div>
        <div className="py-2 px-4 border-slate-300 border-[1px] shadow rounded-xl w-full bg-white">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="outline-none text-slate-600 bg-white w-full max-md:text-sm uppercase"
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
        <div className="grid grid-cols-1 gap-2">
          {filteredResults.map((datos) => (
            <div className="border-slate-300 shadow border-[1px] py-3 px-3 rounded-xl flex justify-between items-center gap-2">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-bold uppercase">
                  Numero: {datos.id}
                </p>
                <p className="text-xs font-bold uppercase">
                  Creador:{" "}
                  <span className="font-normal text-slate-700">
                    {datos.usuario}
                  </span>
                </p>
                <div className="flex flex-col gap-1 font-bold text-xs">
                  <p className="uppercase">Clientes:</p>
                  <div className="font-normal uppercase text-slate-700">
                    {datos.datos_cliente.datosCliente.map((c) => (
                      <div>
                        {c.cliente} ({c.numeroContrato})
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-1 items-start">
                  <p className="font-bold text-xs items-start uppercase">
                    Recaudacion
                  </p>
                  <p
                    className={`font-bold text-xs text-${
                      datos.recaudacion >= 0 ? "green" : "red"
                    }-500 uppercase`}
                  >
                    {Number(datos.recaudacion).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      minimumIntegerDigits: 2,
                    })}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full items-end h-[80px] overflow-y-scroll">
                <button
                  onClick={() => {
                    handleId(datos.id), openEliminar();
                  }}
                  type="button"
                  className="bg-red-100 py-2 px-2 text-center rounded-xl text-red-800 flex items-center gap-1"
                >
                  <span className="text-xs">ELIMINAR</span>
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
                  className="bg-green-500 py-2 px-2 text-center rounded-xl text-white flex items-center gap-1"
                >
                  <span className="text-xs">EDITAR</span>
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
                  to={`/legales  /${datos.id}`}
                  className="bg-black py-2 px-2 text-center rounded-xl text-white flex items-center gap-1"
                >
                  <span className="text-xs">VER LEGALES</span>
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
      <div className="rounded-2xl border-[1px] border-slate-300 hover:shadow max-md:hidden">
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
                Fabrica/Sucursal
              </th>
              <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                Localidad/Creadors
              </th>
              <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                Clientes
              </th>
              <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                Fecha de creación
              </th>
              <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                Mes de creación
              </th>
              <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                Total Final
              </th>
              <th className="px-1 py-4  text-slate-800 font-bold uppercase text-center">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 uppercase">
            {filteredResults.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-3 font-medium text-gray-900 uppercase">
                  {s.id}
                </td>
                <td className="px-4 py-3 font-bold text-gray-900 uppercase">
                  {s.usuario}
                </td>
                <td className="px-4 py-3 font-bold text-gray-900 uppercase">
                  {s.sucursal}
                </td>
                <td className="px-4 py-3 font-bold text-gray-900 uppercase">
                  {s.localidad}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 upppercase">
                  <button
                    onClick={() => {
                      handleID(s.id), openVerCliente();
                    }}
                    type="button"
                    className="bg-orange-100 py-2 px-3 rounded-2xl text-orange-700  hover:shadow-md transition-all ease-linear flex gap-2 items-center"
                  >
                    VER CLIENTE/LOCALIDAD{" "}
                    <FaHouseChimneyUser className="text-2xl" />
                  </button>
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 uppercase">
                  {s.created_at.split("T")[0]}
                </td>
                <td className="px-4 py-3 font-bold text-gray-900 uppercase">
                  {new Date(s.created_at).toLocaleString("default", {
                    month: "long",
                  })}
                </td>
                <td
                  className={`px-4 py-3 font-bold text-${
                    s.recaudacion >= 0 ? "red" : "red"
                  }-600 uppercase`}
                >
                  {Number(s.recaudacion).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  })}
                </td>
                <td className="px-1 py-3 font-medium text-gray-900 uppercase w-[150px] cursor-pointer space-x-2 flex">
                  <button
                    onClick={() => {
                      handleId(s.id), openEliminar();
                    }}
                    type="button"
                    className="bg-red-100 py-1 px-2 text-center rounded-xl uppercase text-red-800"
                  >
                    {/* Eliminar */}
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
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleID(s.id), openModalDos();
                    }}
                    className="bg-green-100 py-1 uppercase px-2 text-center rounded-xl text-green-700"
                  >
                    {/* Editar */}
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
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                  </button>
                  <div className="flex">
                    <Link
                      to={`/legales/${s.id}`}
                      className="flex gap-2 items-center bg-black border-[1px] border-black py-1 hover:border-slate-300 hover:bg-white hover:text-slate-700 hover:border-[1px] hover:shadaw transition-all ease-linear px-5 text-center rounded-xl text-white"
                    >
                      {/* Ver Recaudación */}

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
                          d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                        />
                      </svg>
                    </Link>
                  </div>
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
          </button>
          {Array.from({ length: endPage - startPage + 1 }).map((_, index) => (
            <button
              key={index}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === startPage + index
                  ? "bg-orange-500 hover:bg-white hover:text-black transition-all ease-in-out text-white shadow shadow-black/20 text-sm"
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
      <ModalCrearLegales isOpen={isOpenModal} closeModal={closeModal} />
      <ModalEliminarLegales
        closeEliminar={closeEliminar}
        eliminarModal={eliminarModal}
        obtenerId={obtenerId}
      />
      <ModalEditarLegales
        obtenerID={obtenerID}
        isOpen={isOpenModalEditar}
        closeModal={closeModalDos}
      />
      <ModalVerClienteRemuneracion
        isOpen={isOpenVerCliente}
        closeOpen={closeVerCliente}
        obtenerId={obtenerID}
      />
    </section>
  );
};
