import { Link } from "react-router-dom";
import { useSalidasContext } from "../../../context/SalidasProvider";
import { useState } from "react";
import { ModalEliminar } from "../../../components/Modales/ModalEliminar";
import { ToastContainer } from "react-toastify";

export const Salidas = () => {
  const { salidasMensuales } = useSalidasContext();

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResults = salidasMensuales?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(salidasMensuales?.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const rangeSize = 5;

  const startPage = Math.max(1, currentPage - Math.floor(rangeSize / 2));
  const endPage = Math.min(totalPages, startPage + rangeSize - 1);

  // Estados para términos de búsqueda por cliente y usuario
  // Estados para términos de búsqueda por cliente y usuario
  const [searchTermCliente, setSearchTermCliente] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  // Obtener lista de usuarios únicos
  const uniqueUsers = Array.from(
    new Set(salidasMensuales.map((salida) => salida.usuario.toLowerCase()))
  );

  // Filtrar por cliente y usuario
  const filteredResults = salidasMensuales.filter((salida) =>
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

  return (
    <section className="w-full h-full px-12 max-md:px-4 flex flex-col gap-10 py-16">
      <ToastContainer />
      <div className=" py-10 px-10 rounded-xl bg-white border-slate-200 border-[1px] shadow grid grid-cols-3 gap-3 mb-8">
        <article className="flex flex-col gap-4 rounded-lg border border-slate-200 shadow bg-white p-6">
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

            <span className="text-xs font-medium">
              {" "}
              {Number(totalGastosCliente / 100000).toFixed(2)} %{""}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500">
              Total en Viaticos/Flete/Etc
            </strong>

            <p>
              <span className="text-2xl font-medium text-red-600">
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

        <article className="flex flex-col gap-4 rounded-lg border border-slate-200 shadow bg-white p-6">
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
            <strong className="block text-sm font-medium text-gray-500">
              Fecha Actual
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900">
                {nombreMesActual}
              </span>

              <span className="text-xs text-gray-500">
                {" "}
                Dia {nombreDiaActual}
              </span>
            </p>
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-lg border border-slate-200 shadow bg-white p-6">
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
            <strong className="block text-sm font-medium text-gray-500">
              Total salidas/viviendas
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900">
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

      <div className="flex gap-5">
        <Link
          to={"/crear-salida"}
          className="bg-black py-3 px-6 rounded-xl text-white flex gap-2 items-center"
        >
          Crear nueva salida
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
          to={"/salidas-registradas"}
          className="bg-white border-slate-300 border-[1px] py-3 px-6 rounded-xl text-blacks flex gap-2 items-center"
        >
          Ver salidas registradas
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

      <div className="flex gap-2 items-center w-1/2">
        <div className="py-2 px-4 border-slate-300 border-[1px] shadow rounded-xl w-full">
          <input
            value={searchTermCliente}
            onChange={(e) => setSearchTermCliente(e.target.value)}
            type="text"
            className="outline-none text-slate-600 w-full"
            placeholder="Buscar por cliente"
          />
          {/* Icono de búsqueda para cliente */}
        </div>
        <div className="py-2 px-4 border-slate-300 border-[1px] shadow rounded-xl w-full bg-white">
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
      {/* tabla de datos  */}
      <div className="rounded-xl border-[1px] border-slate-300 shadow ">
        <table className="w-full divide-y-2 divide-gray-200 text-sm">
          <thead className="text-left">
            <tr>
              <th className="px-4 py-2  text-orange-500 font-bold uppercase">
                Numero
              </th>
              <th className="px-4 py-2  text-orange-500 font-bold uppercase">
                Creador
              </th>
              <th className="px-4 py-2  text-orange-500 font-bold uppercase">
                Clientes/Cliente
              </th>
              <th className="px-4 py-2  text-orange-500 font-bold uppercase">
                Localidad/Cliente
              </th>
              <th className="px-4 py-2  text-orange-500 font-bold uppercase">
                Fabrica/Sucursal
              </th>

              <th className="px-1 py-2  text-orange-500 font-bold uppercase">
                Eliminar
              </th>
              <th className="px-1 py-2  text-orange-500 font-bold uppercase">
                Editar
              </th>
              <th className="px-1 py-2  text-orange-500 font-bold uppercase">
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
                  {s.datos_cliente.datosCliente.map((c) => (
                    <div>{c.localidad}</div>
                  ))}
                </td>
                <td className="px-4 py-2 font-medium text-gray-900 capitalize">
                  {s.fabrica}
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
                    to={`/editar/${s.id}`}
                    className="bg-green-500 py-2 px-5 text-center rounded-xl text-white"
                  >
                    Editar
                  </Link>
                </td>
                <td className="px-1 py-2 font-medium text-gray-900 capitalize w-[150px] cursor-pointer">
                  <Link
                    to={`/resumen/${s.id}`}
                    className="bg-black py-2 px-5 text-center rounded-xl text-white"
                  >
                    Ver resumen
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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
      <ModalEliminar
        closeEliminar={closeEliminar}
        eliminarModal={eliminarModal}
        obtenerId={obtenerId}
      />
    </section>
  );
};
