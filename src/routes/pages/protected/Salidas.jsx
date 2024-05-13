import { Link } from "react-router-dom";
import { useSalidasContext } from "../../../context/SalidasProvider";
import { useEffect, useRef, useState } from "react";
import { ModalEliminar } from "../../../components/Modales/ModalEliminar";
import { ToastContainer } from "react-toastify";
import { ModalEditarSalida } from "../../../components/Modales/ModalEditarSalida";
import { ModalCrearSalida } from "../../../components/Modales/ModalCrearSalida";
import { FaHouseChimneyUser } from "react-icons/fa6";
import { ModalVerClienteLocalidad } from "../../../components/Modales/ModalVerClienteLocalidad";
import { useAuth } from "../../../context/AuthProvider";
import { AiOutlineSearch } from "react-icons/ai";
import { Tab } from "@headlessui/react";
import clsx from "clsx"; // Para concatenar clases de manera condicional

export const Salidas = () => {
  const { salidasMensuales, salidasMensualesAdmin } = useSalidasContext();
  const { user } = useAuth();

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

  const totalGastosCliente = salidasMensuales.reduce(
    (total, item) =>
      total +
      parseFloat(item.total_flete) +
      parseFloat(item.total_control) +
      parseFloat(item.total_viaticos) +
      parseFloat(item.espera),
    0
  );

  // Obtener la fecha en formato de cadena (YYYY-MM-DD)
  const fechaActualString = fechaActual.toISOString().slice(0, 10);

  // Filtrar los objetos de 'data' que tienen la misma fecha que la fecha actual
  const ventasDelDia = salidasMensuales?.filter(
    (item) => item?.created_at?.slice(0, 10) === fechaActualString
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

  // Ordenar el arreglo de salidasMensuales por ID de mayor a menor
  const sortedSalidasMensuales = salidasMensuales
    .slice()
    .sort((a, s) => s.id - a.id);

  // Calcular el índice del último y primer elemento de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Obtener los resultados de la página actual
  const currentResults = sortedSalidasMensuales.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Calcular el número total de páginas
  const totalPages = Math.ceil(sortedSalidasMensuales.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const rangeSize = 5;

  const startPage = Math.max(1, currentPage - Math.floor(rangeSize / 2));
  const endPage = Math.min(totalPages, startPage + rangeSize - 1);

  // Estados para términos de búsqueda por cliente y usuario
  const [searchTermCliente, setSearchTermCliente] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedLocalidad, setSelectedLocalidad] = useState("");

  // Obtener lista de usuarios únicos
  const uniqueUsers = Array.from(
    new Set(salidasMensuales.map((salida) => salida.usuario.toLowerCase()))
  );

  const uniqueLocalidad = Array.from(
    new Set(
      salidasMensualesAdmin.map((salida) => salida.localidad.toLowerCase())
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

  const totalDatos = salidasMensuales.reduce((total, salida) => {
    return (
      total +
      (salida.datos_cliente.datosCliente
        ? salida.datos_cliente.datosCliente.length
        : 0)
    );
  }, 0);

  const [isOpenVerCliente, setIsOpenVerCliente] = useState(false);

  const openVerCliente = () => {
    setIsOpenVerCliente(true);
  };

  const closeVerCliente = () => {
    setIsOpenVerCliente(false);
  };

  //ADMIN
  const itemsPerPageAdmin = 10; // Cantidad de elementos por página
  const [currentPageAdmin, setCurrentPageAdmin] = useState(1);

  // Ordenar el arreglo de salidasMensuales por ID de mayor a menor
  const sortedSalidasMensualesAdmin = salidasMensualesAdmin
    .slice() // Clona el arreglo para evitar mutaciones
    .sort((a, b) => b.id - a.id); // Ordena por ID de mayor a menor

  // Calcular el índice del último y primer elemento de la página actual
  const indexOfLastItemAdmin = currentPageAdmin * itemsPerPageAdmin;
  const indexOfFirstItemAdmin = indexOfLastItemAdmin - itemsPerPageAdmin;

  // Obtener los resultados de la página actual
  const currentResultsAdmin = sortedSalidasMensualesAdmin.slice(
    indexOfFirstItemAdmin,
    indexOfLastItemAdmin
  );

  // Calcular el número total de páginas
  const totalPagesAdmin = Math.ceil(
    sortedSalidasMensualesAdmin.length / itemsPerPageAdmin
  );

  const handlePageChangeAdmin = (newPage) => {
    // Evita que la página sea menor que 1 o mayor que el total de páginas
    const clampedPage = Math.max(1, Math.min(newPage, totalPagesAdmin));
    setCurrentPageAdmin(clampedPage);
  };

  const rangeSizeAdmin = 5; // Rango de paginación visible

  // Calcular el rango de la paginación para mostrar 5 elementos como máximo
  const startPageAdmin = Math.max(
    1,
    currentPageAdmin - Math.floor(rangeSizeAdmin / 2)
  );
  const endPageAdmin = Math.min(
    totalPagesAdmin,
    startPageAdmin + rangeSizeAdmin - 1
  );

  // Obtener lista de usuarios únicos
  const uniqueUsersAdmin = Array.from(
    new Set(sortedSalidasMensualesAdmin.map((salida) => salida.usuario))
  );

  const filteredResultsAdmin = currentResultsAdmin.filter(
    (salida) =>
      salida.datos_cliente.datosCliente.some((d) =>
        d.cliente.toLowerCase().includes(searchTermCliente.toLowerCase())
      ) &&
      (selectedUser === "" || salida.usuario.toLowerCase() === selectedUser) &&
      (selectedLocalidad === "" ||
        salida.localidad.toLowerCase() === selectedLocalidad.toLowerCase())
  );

  const filteredResultsAdminMobile = salidasMensualesAdmin.filter(
    (salida) =>
      salida.datos_cliente.datosCliente.some((d) =>
        d.cliente.toLowerCase().includes(searchTermCliente.toLowerCase())
      ) &&
      (selectedUser === "" || salida.usuario.toLowerCase() === selectedUser) &&
      (selectedLocalidad === "" ||
        salida.localidad.toLowerCase() === selectedLocalidad.toLowerCase())
  );

  const sortedResultsAdmin = filteredResultsAdminMobile.sort(
    (a, b) => b.id - a.id
  );

  const totalGastosClienteAdmin = filteredResultsAdmin.reduce(
    (total, item) =>
      total +
      parseFloat(item.total_flete) +
      parseFloat(item.total_control) +
      parseFloat(item.total_viaticos) +
      parseFloat(item.espera),
    0
  );

  const totalSalidasViviendas = filteredResultsAdmin.reduce((total, salida) => {
    return (
      total +
      (salida.datos_cliente.datosCliente
        ? salida.datos_cliente.datosCliente.length
        : 0)
    );
  }, 0);

  //SEARCH MOBILE
  const [handleIsOpen, setHandleOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0 significa la primera pestaña

  const handleToggle = () => {
    setHandleOpen(!handleIsOpen); // Alternar el estado de apertura/cierre
  };
  const inputRef = useRef(null); // Para referenciar el campo de búsqueda

  // Cierra el campo de búsqueda si se hace clic fuera del componente
  const handleClickOutside = (event) => {
    if (
      handleIsOpen &&
      inputRef.current &&
      !inputRef.current.contains(event.target)
    ) {
      setHandleOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside); // Agrega el event listener global
    return () => {
      document.removeEventListener("click", handleClickOutside); // Limpia el listener para evitar fugas de memoria
    };
  }, [handleIsOpen]); // Solo agrega el listener si el campo de búsqueda está abierto

  return user.localidad === "admin" ? (
    <>
      <section className="max-md:hidden bg-gray-100/50 w-full h-full px-12 max-md:px-4 flex flex-col gap-10 py-24 max-md:py-16 max-md:gap-5">
        <ToastContainer />
        <div>
          <p className="font-bold text-2xl text-slate-600">
            Bienvenido{" "}
            <span className="capitalize text-green-500/90 underline">
              {user.username}
            </span>{" "}
            a la parte de Salidas del mes 🖐️.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-8 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-0 max-md:px-0 uppercase">
          <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer">
            <div
              className={`inline-flex gap-2 self-end p-3 rounded-xl ${
                totalGastosClienteAdmin >= 0
                  ? "bg-green-500/90 p-1 text-white"
                  : "bg-red-100 p-1 text-red-600"
              }`}
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
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                />
              </svg>

              <span className="text-xs font-bold max-md:text-xs">
                {" "}
                {Number(totalGastosClienteAdmin % 100).toFixed(2)} %{""}
              </span>
            </div>

            <div>
              <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
                Total en Viaticos del mes/Flete/Etc
              </strong>

              <p className="mt-4">
                <span
                  className={`text-2xl font-bold ${
                    totalGastosClienteAdmin >= 0
                      ? "bg-green-500/90 p-1 text-white"
                      : "bg-red-500/90 p-1 text-white"
                  } rounded-full py-2 px-5`}
                >
                  {Number(totalGastosClienteAdmin).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  })}
                </span>
              </p>
            </div>
          </article>

          <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer">
            <div className="inline-flex gap-2 self-end rounded-2xl bg-green-500/90 p-2.5 text-white">
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

              <span className="text-xs font-bold">{nombreMesActual}</span>
            </div>

            <div>
              <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
                Fecha Actual del mes
              </strong>

              <p className="flex items-center gap-3">
                <span className="text-2xl max-md:text-base font-bold text-gray-600">
                  {nombreMesActual}
                </span>

                <span className="text-xs text-gray-500">
                  Día {nombreDiaActual}
                </span>
              </p>
            </div>
          </article>

          <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer">
            <div className="inline-flex gap-2 self-end rounded-xl bg-green-500/90 p-3 text-white">
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

              <span className="text-xs font-bold">
                {" "}
                {Number(totalSalidasViviendas / 100).toFixed(2)} %{" "}
              </span>
            </div>

            <div>
              <strong className="block text-sm font-medium text-gray-500 max-md:text-sm">
                Total salidas en el mes/viviendas/contratos
              </strong>

              <p className="flex gap-2 items-center mt-2">
                <span className="text-2xl font-bold text-white bg-green-500/90 py-1.5 px-4 rounded-2xl max-md:text-base">
                  {totalSalidasViviendas}
                </span>

                <span className="text-xs text-gray-500">
                  {" "}
                  Total viviendas entregadas{" "}
                  <span className="font-bold">
                    {totalSalidasViviendas}
                  </span>{" "}
                </span>
              </p>
            </div>
          </article>
        </div>

        <div className="flex max-md:flex-col max-md:gap-2 max-md:items-start gap-5">
          <Link
            to={"/salidas-registradas"}
            className="bg-white uppercase text-sm border-slate-300 border-[1px] py-3 max-md:py-2 px-6 max-md:px-4 max-md:text-sm rounded-xl text-blacks flex gap-2 items-center"
          >
            Ver salidas registradas
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 max-md:h-4 max-md:w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>

        <div className="flex gap-2 items-center w-2/3 max-md:w-full max-md:flex-col">
          <div className="py-2 max-md:py-2 px-4 max-md:px-5 bg-white border-slate-300 border-[1px] shadow rounded-xl w-full">
            <input
              value={searchTermCliente}
              onChange={(e) => setSearchTermCliente(e.target.value)}
              type="text"
              className="outline-none text-slate-600 w-full max-md:text-sm uppercase bg-white"
              placeholder="Buscar por cliente"
            />
          </div>
          <div className="py-2 px-4 max-md:text-sm border-slate-300 border-[1px] shadow rounded-xl w-full bg-white">
            <select
              value={selectedLocalidad}
              onChange={(e) => setSelectedLocalidad(e.target.value)}
              className="outline-none text-slate-600 bg-white w-full uppercase"
            >
              <option className="uppercase" value="">
                Seleccionar localidad/usuario...
              </option>
              {uniqueLocalidad.map((user) => (
                <option className="uppercase" key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>
          </div>

          <div className="py-2 px-4 max-md:text-sm border-slate-300 border-[1px] shadow rounded-xl w-full bg-white">
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="outline-none text-slate-600 bg-white w-full uppercase"
            >
              <option className="uppercase" value="">
                Seleccionar usuario...
              </option>
              {uniqueUsersAdmin.map((user) => (
                <option className="uppercase" key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="font-bold text-base text-slate-600 uppercase underline pb-3">
            Datos Registrados
          </div>
          <div className="bg-white rounded-2xl border-[1px] border-slate-300 hover:shadow-md transition-all ease-linear cursor-pointer max-md:hidden">
            <table className="w-full divide-y-2 divide-gray-200 text-sm">
              <thead className="text-left">
                <tr>
                  <th className="px-4 py-3 text-slate-800 font-bold uppercase">
                    Numero
                  </th>
                  <th className="px-4 py-3 text-slate-800 font-bold uppercase">
                    Creador
                  </th>
                  <th className="px-4 py-3 text-slate-800 font-bold uppercase">
                    Localidad/Usuario
                  </th>
                  <th className="px-4 py-3 text-slate-800 font-bold uppercase">
                    Usuario/Fabrica/Sucursal
                  </th>
                  <th className="px-4 py-3 text-slate-800 font-bold uppercase">
                    Fecha de creación
                  </th>
                  <th className="px-4 py-3 text-slate-800 font-bold uppercase">
                    Mes de creación
                  </th>
                  <th className="px-4 py-3 text-slate-800 font-bold uppercase">
                    Clientes/Localidad/Ver
                  </th>
                  <th className="px-4 py-3 text-slate-800 font-bold uppercase">
                    Fabrica de salida
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 uppercase">
                {filteredResultsAdmin.map((s) => (
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
                    <td className="px-4 py-3 font-medium text-gray-900 uppercase">
                      {s.created_at.split("T")[0]}
                    </td>{" "}
                    <td className="px-4 py-3 font-bold text-gray-900 uppercase">
                      {new Date(s.created_at).toLocaleString("default", {
                        month: "long",
                      })}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 upppercase">
                      <button
                        onClick={() => {
                          handleID(s.id), openVerCliente();
                        }}
                        type="button"
                        className="bg-orange-400 py-2 px-5 rounded-full text-white  hover:shadow-md transition-all ease-linear flex gap-2 items-center"
                      >
                        VER CLIENTE/LOCALIDAD{" "}
                        <FaHouseChimneyUser className="text-2xl" />
                      </button>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 upppercase">
                      {s.fabrica}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {totalPagesAdmin > 1 && (
          <div className="flex flex-wrap justify-center mt-4 mb-4 gap-1">
            <button
              className="mx-1 px-3 py-2 rounded-xl shadow text-sm flex gap-1 border-slate-300 border-[1px] cursor-pointer"
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
                      ? "bg-black py-1 px-4 rounded-xl text-white"
                      : "bg-white border-[1px] border-slate-300 py-1 px-4 rounded-xl text-black"
                  }`}
                  onClick={() => handlePageChangeAdmin(startPageAdmin + index)}
                >
                  {startPageAdmin + index}
                </button>
              )
            )}
            <button
              className="mx-1 px-3 py-2 rounded-xl shadow text-sm flex gap-1 border-slate-300 border-[1px]"
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
        <ModalVerClienteLocalidad
          isOpen={isOpenVerCliente}
          closeOpen={closeVerCliente}
          obtenerId={obtenerID}
        />
      </section>

      {/* MOBILE */}
      <div className="py-12 w-full md:hidden bg-gray-100/50 min-h-screen max-h-full h-full">
        <div>
          <p className="text-slate-500 mb-4 text-center font-semibold">
            Salidas del mes 👋
          </p>
        </div>
        <Tab.Group
          selectedIndex={activeTab} // Controla la pestaña activa
          onChange={(index) => setActiveTab(index)} // Cambia el estado cuando el usuario cambia de pestaña
        >
          <Tab.List className="flex gap-2 bg-gray-200 py-2 px-2 w-full justify-center">
            <Tab
              className={clsx(
                "py-2 px-3 rounded-xl text-sm transition-colors duration-300 outline-none font-semibold",
                {
                  "bg-slate-600 text-white": activeTab === 0, // Aplica color azul para la pestaña activa
                  "bg-white text-gray-700": activeTab !== 0, // Color blanco para las no activas
                }
              )}
            >
              Estadística salidas
            </Tab>

            <Tab
              className={clsx(
                "py-2 px-3 rounded-xl text-sm transition-colors duration-300 outline-none font-semibold",
                {
                  "bg-slate-600 text-white": activeTab === 1, // Segunda pestaña activa
                  "bg-white text-gray-700": activeTab !== 1, // Color blanco si no está activa
                }
              )}
            >
              Ver salidas
            </Tab>
          </Tab.List>
          <Tab.Panels
            className="transition-transform duration-300" // Transición suave entre paneles
          >
            <Tab.Panel key="1" className={"py-5 px-5"}>
              <div className="grid grid-cols-1 gap-5">
                <article className="flex flex-col gap-4 rounded-2xl shadow-lg bg-white p-4">
                  <div
                    className={`inline-flex gap-2 self-end p-2 rounded-xl ${
                      totalGastosClienteAdmin >= 0
                        ? "bg-green-500/90 p-1 text-white"
                        : "bg-red-100 p-1 text-red-600"
                    }`}
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
                        d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                      />
                    </svg>

                    <span className="text-xs font-bold max-md:text-xs">
                      {" "}
                      {Number(totalGastosClienteAdmin % 100).toFixed(2)} %{""}
                    </span>
                  </div>

                  <div>
                    <strong className="block text-sm font-bold text-gray-500 max-md:text-xs">
                      Total en Viaticos del mes/Flete/Etc
                    </strong>

                    <p className="mt-4">
                      <span
                        className={`text-base font-bold ${
                          totalGastosClienteAdmin >= 0
                            ? "bg-green-500/90 p-1 text-white"
                            : "bg-red-500/90 p-1 text-white"
                        } rounded-full py-2 px-5`}
                      >
                        {Number(totalGastosClienteAdmin).toLocaleString(
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
                </article>

                <article className="flex flex-col gap-4 rounded-2xl shadow-lg bg-white p-4">
                  <div className="inline-flex gap-2 self-end rounded-2xl bg-green-500/90 p-2 text-white">
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

                    <span className="text-xs font-bold">{nombreMesActual}</span>
                  </div>

                  <div>
                    <strong className="block text-sm font-bold text-gray-500 max-md:text-xs">
                      Fecha Actual del mes
                    </strong>

                    <p>
                      <span className="text-2xl max-md:text-base font-bold text-gray-600">
                        {nombreMesActual}
                      </span>
                    </p>
                  </div>
                </article>

                <article className="flex flex-col gap-4 rounded-2xl shadow-lg bg-white p-4">
                  <div className="inline-flex gap-2 self-end rounded-xl bg-green-500/90 p-2 text-white">
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

                    <span className="text-xs font-bold">
                      {" "}
                      {Number(totalSalidasViviendas / 100).toFixed(2)} %{" "}
                    </span>
                  </div>

                  <div>
                    <strong className="block text-sm font-bold text-gray-500 max-md:text-sm">
                      Total salidas en el mes/viviendas/contratos
                    </strong>

                    <p className="flex gap-2 items-center mt-2">
                      <span className="text-2xl font-bold text-white bg-green-500/90 py-1.5 px-4 rounded-2xl max-md:text-sm">
                        {totalSalidasViviendas}
                      </span>

                      <span className="text-xs text-gray-500">
                        {" "}
                        Total viviendas entregadas{" "}
                        <span className="font-bold">
                          {totalSalidasViviendas}
                        </span>{" "}
                      </span>
                    </p>
                  </div>
                </article>
              </div>
            </Tab.Panel>
            <Tab.Panel key="2">
              <div
                className="relative flex items-center my-2 mx-2"
                ref={inputRef}
              >
                {/* Icono de búsqueda para abrir/cerrar el campo */}
                <button
                  onClick={handleToggle}
                  className="bg-gray-200 p-2 rounded-full"
                >
                  <AiOutlineSearch className="text-gray-700 text-2xl" />
                </button>

                {/* Campo de entrada que se expande al hacer clic */}
                <input
                  type="text"
                  placeholder="Buscar por el proveedor o detalle..."
                  className={clsx(
                    "rounded-xl py-2.5 px-5 border-slate-300 text-slate-700 border-[1px] uppercase text-sm absolute top-0 left-0 z-[100] transition-all outline-none",
                    {
                      "w-full bg-white opacity-100": handleIsOpen,
                      "w-0 opacity-0": !handleIsOpen,
                    }
                  )}
                  value={searchTermCliente}
                  onChange={(e) => setSearchTermCliente(e.target.value)}
                  style={{ left: handleIsOpen ? "0" : "-100px" }} // Controla el desplazamiento horizontal
                />
              </div>
              <div className="py-2 px-2 overflow-x-scroll">
                <div className="flex gap-2 w-[500px]">
                  <div className="py-2 px-4 max-md:text-sm border-slate-300 border-[1px] shadow rounded-xl w-full bg-white">
                    <select
                      value={selectedLocalidad}
                      onChange={(e) => setSelectedLocalidad(e.target.value)}
                      className="outline-none text-slate-600 bg-white w-full uppercase text-sm"
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

                  <div className="py-2 px-4 max-md:text-sm border-slate-300 border-[1px] shadow rounded-xl w-full bg-white">
                    <select
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      className="outline-none text-slate-600 bg-white w-full uppercase text-sm"
                    >
                      <option className="uppercase" value="">
                        Seleccionar usuario...
                      </option>
                      {uniqueUsersAdmin.map((user) => (
                        <option className="uppercase" key={user} value={user}>
                          {user}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="px-3 mt-2 flex">
                <Link
                  to={"/salidas-registradas"}
                  className="bg-green-500/90 py-2 px-4 rounded-full text-white font-semibold text-sm flex gap-2 items-center"
                >
                  Salidas registradas
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
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Link>
              </div>

              <CardComponentMobile
                handleID={handleID}
                openVerCliente={openVerCliente}
                filteredResultsAdmin={sortedResultsAdmin}
              />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  ) : (
    <section className="w-full h-full px-12 max-md:px-4 flex flex-col gap-10 py-24 max-md:gap-5">
      <ToastContainer />
      <div>
        <p className="font-bold text-2xl text-slate-600 max-md:text-lg max-md:text-center text-justify">
          Bienvenido{" "}
          <span className="capitalize text-green-500/90 underline">
            {user.username}
          </span>{" "}
          a la parte de salidas mensuales 🖐️.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-8 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-0 max-md:px-0 uppercase">
        <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all ease-linear bg-white p-6 max-md:p-3 max-md:rounded-xl cursor-pointer">
          <div className="inline-flex gap-2 self-end rounded bg-red-100 p-1 text-red-600">
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
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>

            <span className="text-xs font-medium max-md:text-xs">
              {" "}
              {Number(totalGastosCliente / 100000).toFixed(2)} %{""}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Total en Viaticos/Flete/Etc
            </strong>

            <p>
              <span className="text-2xl font-medium text-red-600 max-md:text-base">
                {Number(totalGastosCliente).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>

              <span className="text-xs text-gray-500">
                {" "}
                ultimos gastos total en el día{" "}
                <span className="font-bold text-slate-700">
                  {" "}
                  {Number(
                    Number(ultimaVentaDelDia?.total_viaticos) +
                      Number(ultimaVentaDelDia?.total_control) +
                      Number(ultimaVentaDelDia?.total_flete) || 0
                  ).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  })}{" "}
                </span>
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
              <span className="text-2xl max-md:text-base font-medium text-gray-900">
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
            <strong className="block text-sm font-medium text-gray-500 max-md:text-sm">
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
      </div>

      <div className="flex max-md:flex-col max-md:gap-2 max-md:items-start gap-5">
        <Link
          // to={"/crear-salida"}
          onClick={() => openModal()}
          className="bg-black py-3 uppercase text-sm max-md:py-2 px-6 max-md:px-4 max-md:text-sm rounded-xl text-white flex gap-2 items-center"
        >
          Crear nueva salida
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 max-md:h-4 max-md:w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
            />
          </svg>
        </Link>

        <Link
          to={"/salidas-registradas"}
          className="bg-white uppercase text-sm border-slate-300 border-[1px] py-3 max-md:py-2 px-6 max-md:px-4 max-md:text-sm rounded-xl text-blacks flex gap-2 items-center"
        >
          Ver salidas registradas
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 max-md:h-4 max-md:w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </Link>
      </div>

      <div className="flex gap-2 items-center w-1/2 max-md:w-full max-md:flex-col">
        <div className="bg-white py-2 max-md:py-2 px-4 max-md:px-5 border-slate-300 border-[1px] shadow rounded-xl w-full">
          <input
            value={searchTermCliente}
            onChange={(e) => setSearchTermCliente(e.target.value)}
            type="text"
            className="outline-none text-slate-600 w-full max-md:text-sm uppercase bg-white"
            placeholder="Buscar por cliente"
          />
        </div>
        <div className="py-2 px-4 max-md:text-sm border-slate-300 border-[1px] shadow rounded-xl w-full bg-white">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="outline-none text-slate-600 bg-white w-full uppercase"
          >
            <option className="uppercase" value="">
              Seleccionar usuario...
            </option>
            {uniqueUsers.map((user) => (
              <option className="uppercase" key={user} value={user}>
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
          {filteredResults
            .sort((a, b) => b.id - a.id)
            .map((datos) => (
              <div className="border-slate-300 hover:shadow-md transition-all ease-linear border-[1px] py-3 px-3 rounded-2xl flex justify-between gap-2">
                <div className="flex flex-col gap-1 w-full">
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
                    <p>Clientes:</p>
                    <div className="font-normal uppercase text-slate-700">
                      {datos.datos_cliente.datosCliente.map((c) => (
                        <div>
                          {c.cliente} ({c.numeroContrato})
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 w-full flex-col items-end h-[80px] overflow-y-scroll">
                  <button
                    onClick={() => {
                      handleId(datos.id), openEliminar();
                    }}
                    type="button"
                    className="bg-red-100 py-2 px-2 text-center rounded-xl text-red-800 flex items-center gap-2"
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
                    // to={`/editar/${datos.id}`}
                    onClick={() => openModalDos()}
                    className="bg-green-500 py-2 px-2 text-center rounded-xl text-white flex items-center gap-2"
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
                    to={`/resumen/${datos.id}`}
                    className="bg-black py-2 px-2 text-center rounded-xl text-white flex items-center gap-2"
                  >
                    <span className="text-xs">VER RESUMEN</span>
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
      <div className="bg-white rounded-2xl border-[1px] border-slate-300 hover:shadow-md transition-all ease-linear cursor-pointer max-md:hidden">
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
                Localidad/Creador
              </th>
              <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                Fabrica/Sucursal
              </th>
              <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                Total
              </th>
              <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                Clientes/Localidad/Ver
              </th>
              <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                Fabrica de salida
              </th>
              <th className="px-1 py-4  text-slate-800 font-bold uppercase">
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
                      handleID(s.id), openVerCliente();
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
                        <Link className="capitalize" to={`/resumen/${s.id}`}>
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
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center mt-4 mb-4 gap-1">
          <button
            className="mx-1 px-3 py-2 rounded-xl shadow text-sm flex gap-1 border-slate-300 border-[1px] cursor-pointer"
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
                  ? "bg-black py-1 px-4 rounded-xl text-white"
                  : "bg-white border-[1px] border-slate-300 py-1 px-4 rounded-xl text-black"
              }`}
              onClick={() => handlePageChange(startPage + index)}
            >
              {startPage + index}
            </button>
          ))}
          <button
            className="mx-1 px-3 py-2 rounded-xl shadow text-sm flex gap-1 border-slate-300 border-[1px]"
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
      <ModalEliminar
        closeEliminar={closeEliminar}
        eliminarModal={eliminarModal}
        obtenerId={obtenerId}
      />

      <ModalCrearSalida isOpenDos={isOpenModal} closeModalDos={closeModal} />

      <ModalEditarSalida
        obtenerID={obtenerID}
        isOpen={isOpenModalEditar}
        closeModal={closeModalDos}
      />

      <ModalVerClienteLocalidad
        isOpen={isOpenVerCliente}
        closeOpen={closeVerCliente}
        obtenerId={obtenerID}
      />
    </section>
  );
};

const CardComponentMobile = ({
  filteredResultsAdmin,
  handleID,
  openVerCliente,
}) => (
  <div>
    <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 lg:grid-cols-3">
      {filteredResultsAdmin.map((s) => (
        <div key={s.id} className="bg-white border p-4 shadow">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-slate-800 uppercase">Número</h2>
            <span className="text-gray-900 capitalize">{s.id}</span>
          </div>
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-slate-800 uppercase">Creador</h2>
            <span className="text-gray-900 capitalize">{s.usuario}</span>
          </div>
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-slate-800 uppercase">
              Fábrica/Sucursal
            </h2>
            <span className="text-gray-900 capitalize">{s.sucursal}</span>
          </div>
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-slate-800 uppercase">
              Localidad/Creador
            </h2>
            <span className="text-gray-900 capitalize">{s.localidad}</span>
          </div>
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-slate-800 uppercase">
              Fecha de creación
            </h2>
            <span className="text-gray-900 capitalize">
              {s.created_at.split("T")[0]}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-slate-800 uppercase">
              Mes de creación
            </h2>
            <span className="text-gray-900 capitalize">
              {new Date(s.created_at).toLocaleString("default", {
                month: "long",
              })}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <h2 className="font-bold text-slate-800 uppercase">
              Fábrica de salida
            </h2>
            <span className="text-gray-900 capitalize">{s.fabrica}</span>
          </div>
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-slate-800 uppercase">Total</h2>
            <span className="text-orange-500 capitalize font-semibold">
              {Number(
                Number(s.total_viaticos) +
                  Number(s.total_flete) +
                  Number(s.total_control) +
                  Number(s.espera)
              ).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumIntegerDigits: 2,
              })}
            </span>
          </div>
          <div className="flex justify-between items-center mt-3">
            <button
              onClick={() => {
                handleID(s.id);
                openVerCliente();
              }}
              className="bg-orange-100 py-2 px-4 rounded-xl text-orange-700 hover:shadow-md transition-all ease-linear flex gap-2 items-center font-semibold text-sm"
            >
              Ver Cliente/Localidad
              <FaHouseChimneyUser className="text-xl" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);
