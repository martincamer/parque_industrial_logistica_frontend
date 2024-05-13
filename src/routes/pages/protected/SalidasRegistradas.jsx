import { Link } from "react-router-dom";
import { useState } from "react";
import { ModalEditarSalida } from "../../../components/Modales/ModalEditarSalida";
import { useAuth } from "../../../context/AuthProvider";
import { ToastContainer } from "react-toastify";
import { SyncLoader } from "react-spinners";
import client from "../../../api/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const SalidasRegistradas = () => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [datos, setDatos] = useState([]);
  const [datosAdmin, setDatosAdmin] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

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

      if (user.localidad === "admin") {
        const responseDos = await client.post("/salidas-rango-fechas-admin", {
          fechaInicio,
          fechaFin,
        });

        console.log(responseDos.data);

        setDatosAdmin(responseDos.data); // Maneja la respuesta según tus necesidades
      } else {
        const response = await client.post("/salidas-rango-fechas", {
          fechaInicio,
          fechaFin,
        });

        setDatos(response.data); // Maneja la respuesta según tus necesidades
      }
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

  // Obtener la fecha en formato de cadena (YYYY-MM-DD)
  const fechaActualString = fechaActual.toISOString().slice(0, 10);

  // Filtrar los objetos de 'data' que tienen la misma fecha que la fecha actual
  const ventasDelDia = datos?.filter(
    (item) => item?.created_at.slice(0, 10) === fechaActualString
  );

  // Encontrar la venta más reciente del día
  const ultimaVentaDelDia = datos?.reduce((ultimaVenta, venta) => {
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
  const currentResults = datos?.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(datos?.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const rangeSize = 5;

  const startPage = Math.max(1, currentPage - Math.floor(rangeSize / 2));
  const endPage = Math.min(totalPages, startPage + rangeSize - 1);

  // Función para filtrar los resultados por cliente
  const filteredResults = currentResults.filter((salida) => {
    // Ajusta 'cliente' por la propiedad de tu objeto que contiene el nombre del cliente
    return salida.datos_cliente.datosCliente.some((d) =>
      d.cliente.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalGastosCliente = datos.reduce(
    (total, item) =>
      total +
      parseFloat(item.total_flete) +
      parseFloat(item.total_control) +
      parseFloat(item.total_viaticos) +
      parseFloat(item.espera),
    0
  );

  const totalDatos = datos.reduce((total, salida) => {
    return (
      total +
      (salida.datos_cliente.datosCliente
        ? salida.datos_cliente.datosCliente.length
        : 0)
    );
  }, 0);

  const [isOpen, setOpen] = useState(false);
  const [obtenerId, setObtenerId] = useState(null);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);
  const handleId = (id) => setObtenerId(id);

  const total = parseFloat(totalGastosCliente);

  const esNegativo = total < 0;
  const colorDeFondo = esNegativo
    ? "bg-red-100 text-red-600"
    : "bg-red-100 text-red-600";
  const textoColor = esNegativo ? "text-red-900" : "text-red-600";

  //ADMIN DATOS
  const itemsPerPageAdmin = 10; // Cantidad de elementos por página
  const [currentPageAdmin, setCurrentPageAdmin] = useState(1);

  const indexOfLastItemAdmin = currentPageAdmin * itemsPerPageAdmin;
  const indexOfFirstItemAdmin = indexOfLastItemAdmin - itemsPerPageAdmin;
  const currentResultsAdmin = datosAdmin?.slice(
    indexOfFirstItemAdmin,
    indexOfLastItemAdmin
  );

  const totalPagesAdmin = Math.ceil(datosAdmin?.length / itemsPerPageAdmin);

  const handlePageChangeAdmin = (newPage) => {
    setCurrentPageAdmin(newPage);
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

  const filteredResultsAdmin = currentResultsAdmin.filter((salida) => {
    return (
      salida.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salida.localidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salida.datos_cliente.datosCliente.some((d) =>
        d.cliente.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  });

  const totalGastosClienteAdmin = filteredResultsAdmin.reduce(
    (total, item) =>
      total +
      parseFloat(item.total_flete) +
      parseFloat(item.total_control) +
      parseFloat(item.total_viaticos) +
      parseFloat(item.espera),
    0
  );

  const totalDatosAdmin = filteredResultsAdmin.reduce((total, salida) => {
    return (
      total +
      (salida.datos_cliente.datosCliente
        ? salida.datos_cliente.datosCliente.length
        : 0)
    );
  }, 0);

  const resultadoNegativo =
    totalGastosClienteAdmin > 0
      ? -totalGastosClienteAdmin
      : totalGastosClienteAdmin;

  return user.localidad === "admin" ? (
    <section className="bg-gray-100/50 w-full px-12 max-md:px-4 flex flex-col gap-6 py-24 max-md:gap-3 h-full max-h-full min-h-screen max-md:py-16">
      <ToastContainer />
      <div className="uppercase grid grid-cols-4 gap-3 mb-0 max-md:grid-cols-1 max-md:shadow-none max-md:border-none max-md:px-0 max-md:py-0 max-md:gap-5">
        <article
          className={`flex flex-col gap-4 rounded-2xl border hover:shadow-md transition-all ease-linear border-slate-200 bg-white p-6 max-md:p-4 max-md:border-none max-md:shadow-lg max-md:hover:shadow-none`}
        >
          <div
            className={`inline-flex gap-2 self-end rounded-2xl ${colorDeFondo} p-3`}
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

            <span className="text-xs font-bold">
              {Number(totalGastosClienteAdmin % 100).toFixed(2)} %{""}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Total final en salidas
            </strong>

            <p>
              <span
                className={`text-2xl font-bold ${textoColor} max-md:text-base`}
              >
                {Number(resultadoNegativo).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>{" "}
            </p>
          </div>
        </article>
        <article
          className={`flex flex-col gap-4 rounded-2xl border hover:shadow-md transition-all ease-linear border-slate-200 bg-white p-6 max-md:p-4 max-md:border-none max-md:shadow-lg max-md:hover:shadow-none`}
        >
          <div className="inline-flex gap-2 self-end rounded-xl bg-green-100 p-3 text-green-600">
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
              {Number(totalDatosAdmin % 100).toFixed(2)} %{" "}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Total salidas/viviendas
            </strong>

            <p>
              <span className="text-2xl font-medium text-gray-900 max-md:text-base">
                {totalDatosAdmin}
              </span>

              <span className="text-xs text-gray-500">
                {" "}
                Total viviendas de las salidas {totalDatosAdmin}{" "}
              </span>
            </p>
          </div>
        </article>
      </div>

      <div className="mt-5 max-md:mt-4 max-md:overflow-x-scroll">
        <div className="flex gap-6 items-end max-md:items-end max-md:gap-3 max-md:w-[550px]">
          <div className="flex flex-col  max-md:flex-row items-center md:gap-2">
            <label className="text-sm text-slate-700 uppercase font-bold w-full max-md:w-auto max-md:text-center">
              Fecha de inicio
            </label>
            <DatePicker
              selected={fechaInicio}
              onChange={(date) => setFechaInicio(date)}
              dateFormat="dd/MM/yyyy" // Formato de la fecha
              className="text-sm bg-white py-2 px-3 rounded-lg shadow-sm border border-slate-300 text-slate-700 outline-none transition duration-300 ease-in-out w-full"
              placeholderText="Seleccione fecha" // Texto de marcador de posición
            />
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex flex-col max-md:flex-row items-center md:gap-2">
              <label className="text-sm text-slate-700 uppercase font-bold w-full max-md:w-auto max-md:text-center">
                Fecha fin
              </label>
              <DatePicker
                selected={fechaFin}
                onChange={(date) => setFechaFin(date)}
                dateFormat="dd/MM/yyyy" // Formato de la fecha
                className="text-sm bg-white py-2 px-3 rounded-lg shadow-sm border border-slate-300 text-slate-700 outline-none transition duration-300 ease-in-out w-full"
                placeholderText="Seleccione fecha" // Texto de marcador de posición
              />
            </div>
            <button
              onClick={buscarIngresosPorFecha}
              className="max-md:text-sm bg-white border-slate-300 border-[1px] rounded-xl px-4 py-2 shadow flex gap-3 text-slate-700 hover:shadow-md transtion-all ease-in-out duration-200 max-md:block md:hidden max-md:py-1"
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

          <button
            onClick={buscarIngresosPorFecha}
            className="max-md:text-sm bg-white border-slate-300 border-[1px] rounded-full px-3 py-3 shadow flex gap-3 text-slate-700 hover:shadow-md transtion-all ease-in-out duration-200 max-md:hidden"
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

      <div className="bg-white flex justify-between items-center py-2 px-4 border-slate-300 border-[1px] shadow rounded-xl w-1/4 max-md:w-full max-md:text-sm max-md:mt-1">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          className="outline-none text-slate-600 w-full uppercase text-sm bg-white max-md:text-xs"
          placeholder="Buscar el cliente/localidad creador o nombre"
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
      {/* tabla de datos  */}
      <div className="bg-white rounded-xl border-[1px] border-slate-300 shadow max-md:overflow-x-scroll">
        {loading ? (
          // Muestra el spinner mientras se cargan los datos
          <div className="flex justify-center items-center h-40">
            <SyncLoader color="#4A90E2" size={6} margin={6} />
            <p className="animate-blink text-slate-700 text-sm">
              Buscando los datos...
            </p>
          </div>
        ) : (
          <table className="w-full divide-y-2 divide-gray-200 text-sm ">
            <thead className="text-left">
              <tr>
                <th className="px-4 py-3  text-slate-800 font-bold uppercase max-md:text-xs">
                  Numero
                </th>
                <th className="px-4 py-3  text-slate-800 font-bold uppercase max-md:text-xs">
                  Clientes/Cliente
                </th>
                <th className="px-4 py-3  text-slate-800 font-bold uppercase max-md:text-xs">
                  Localidad/Cliente
                </th>
                <th className="px-4 py-3  text-slate-800 font-bold uppercase max-md:text-xs">
                  Total final
                </th>
                <th className="px-4 py-3  text-slate-800 font-bold uppercase max-md:text-xs">
                  Mes de creación
                </th>
                <th className="px-4 py-3  text-slate-800 font-bold uppercase max-md:text-xs">
                  Fabrica de salida
                </th>
                <th className="px-4 py-2  text-slate-800 font-bold uppercase">
                  Fabrica/Sucursal
                </th>
                <th className="px-4 py-2  text-slate-800 font-bold uppercase">
                  Localidad/Creador
                </th>
                <th className="px-4 py-3  text-slate-800 font-bold uppercase max-md:text-xs">
                  Creador
                </th>
                <th className="px-1 py-3  text-slate-800 font-bold uppercase max-md:text-xs">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 uppercase">
              {filteredResultsAdmin.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-4 font-medium text-gray-900 max-md:text-xs">
                    {s.id}
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-900 max-md:text-xs">
                    {s.datos_cliente.datosCliente.map((c) => (
                      <div>
                        {c.cliente}({c.numeroContrato})
                      </div>
                    ))}
                  </td>
                  {}
                  <td className="px-4 py-4 font-medium text-gray-900 max-md:text-xs">
                    {s.datos_cliente.datosCliente.map((c) => (
                      <div>{c.localidad}</div>
                    ))}
                  </td>
                  <td className="px-4 py-4 font-bold text-red-600 max-md:text-xs">
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
                  <td className="px-4 py-3 font-bold text-gray-900 uppercase">
                    {new Date(s.created_at).toLocaleString("default", {
                      month: "long",
                    })}
                  </td>
                  <td className="px-4 py-4 font-bold text-gray-900 max-md:text-xs">
                    {s.fabrica}
                  </td>
                  <td className="px-4 py-4 font-bold text-gray-900 max-md:text-xs">
                    {s.sucursal}
                  </td>
                  <td className="px-4 py-4 font-bold text-gray-900 max-md:text-xs">
                    {s.localidad}
                  </td>
                  <td className="px-4 py-4 font-bold text-gray-900 max-md:text-xs">
                    {s.usuario}
                  </td>
                  <td className="px-1 py-4 font-medium text-gray-900 max-md:text-xs flex items-center gap-2">
                    <Link
                      target="_blank"
                      to={`/resumen/${s.id}`}
                      className="bg-black py-2 px-5 text-center rounded-xl text-white uppercase"
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
            Anterior
          </button>
          {Array.from({ length: endPageAdmin - startPageAdmin + 1 }).map(
            (_, index) => (
              <button
                key={index}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPageAdmin === startPageAdmin + index
                    ? "bg-orange-500 hover:bg-white transition-all ease-in-out text-white shadow shadow-black/20 text-sm"
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
    </section>
  ) : (
    <section className="bg-gray-100/50 min-h-screen max-h-full w-full h-full px-12 max-md:px-4 flex flex-col gap-6 py-24 max-md:gap-3">
      <ToastContainer />
      <div className="uppercase grid grid-cols-4 gap-3 mb-0 max-md:grid-cols-1 max-md:shadow-none max-md:border-none max-md:px-0 max-md:py-0">
        <article
          className={`flex flex-col gap-4 rounded-2xl border hover:shadow-md transition-all ease-linear border-slate-200 bg-white p-6 max-md:p-3`}
        >
          <div
            className={`inline-flex gap-2 self-end rounded ${colorDeFondo} p-1`}
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

            <span className="text-xs font-medium">
              {Number(totalGastosCliente / 100000).toFixed(2)} %{""}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Total final en salidas
            </strong>

            <p>
              <span
                className={`text-2xl font-medium ${textoColor} max-md:text-base`}
              >
                {Number(totalGastosCliente).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>{" "}
              <span className="text-xs text-gray-500">
                Último gasto total de la búsqueda{" "}
                <span className="font-bold text-slate-700">
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
        <article className="flex flex-col gap-4 rounded-2xl border hover:shadow-md transition-all ease-linear border-slate-200 bg-white p-6 max-md:p-3">
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
                Total viviendas de las salidas {totalDatos}{" "}
              </span>
            </p>
          </div>
        </article>
      </div>

      <div className="mt-5 max-md:mt-4">
        <div className="flex gap-6 items-center max-md:flex-col max-md:items-start max-md:gap-3">
          <div className="flex gap-2 items-center">
            <label className="text-sm text-slate-700 max-md:text-sm uppercase">
              Fecha de inicio
            </label>
            <input
              className="text-sm bg-white py-2 px-3 rounded-lg shadow border-slate-300 border-[1px] cursor-pointer text-slate-700 outline-none"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-sm text-slate-700 max-md:text-sm uppercase">
              Fecha fin
            </label>
            <input
              className="text-sm bg-white py-2 px-3 rounded-lg shadow border-slate-300 border-[1px] cursor-pointer text-slate-700 outline-none"
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
            <button
              onClick={buscarIngresosPorFecha}
              className="max-md:text-sm bg-white border-slate-300 border-[1px] rounded-xl px-4 py-2 shadow flex gap-3 text-slate-700 hover:shadow-md transtion-all ease-in-out duration-200 max-md:block md:hidden max-md:py-1"
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

          <button
            onClick={buscarIngresosPorFecha}
            className="max-md:text-sm bg-white border-slate-300 border-[1px] rounded-xl px-4 py-2 shadow flex gap-3 text-slate-700 hover:shadow-md transtion-all ease-in-out duration-200 max-md:hidden"
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

      <div className="bg-white flex justify-between items-center py-2 px-4 border-slate-300 border-[1px] shadow rounded-xl w-1/4 max-md:w-full max-md:text-sm max-md:mt-5">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          className="outline-none text-slate-600 w-full uppercase text-sm bg-white"
          placeholder="Buscar el cliente en especifico"
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
      {/* tabla de datos  */}
      <div className="bg-white rounded-xl border-[1px] border-slate-300 shadow max-md:overflow-x-scroll">
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
            <thead className="text-left">
              <tr>
                <th className="px-4 py-4  text-slate-800 font-bold uppercase max-md:text-xs">
                  Numero
                </th>
                <th className="px-4 py-4  text-slate-800 font-bold uppercase max-md:text-xs">
                  Clientes/Cliente
                </th>
                <th className="px-4 py-4  text-slate-800 font-bold uppercase max-md:text-xs">
                  Localidad/Cliente
                </th>
                <th className="px-4 py-4  text-slate-800 font-bold uppercase max-md:text-xs">
                  Total
                </th>
                <th className="px-4 py-4  text-slate-800 font-bold uppercase max-md:text-xs">
                  Mes de creación
                </th>
                <th className="px-4 py-4  text-slate-800 font-bold uppercase max-md:text-xs">
                  Fabrica de salida
                </th>
                <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                  Fabrica/Sucursal
                </th>
                <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                  Localidad/Creador
                </th>
                <th className="px-4 py-4  text-slate-800 font-bold uppercase max-md:text-xs">
                  Creador
                </th>
                <th className="px-1 py-4  text-slate-800 font-bold uppercase max-md:text-xs">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 uppercase">
              {filteredResults.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-4 font-medium text-gray-900 max-md:text-xs">
                    {s.id}
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-900 max-md:text-xs">
                    {s.datos_cliente.datosCliente.map((c) => (
                      <div>
                        {c.cliente}({c.numeroContrato})
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-900 max-md:text-xs">
                    {s.datos_cliente.datosCliente.map((c) => (
                      <div>{c.localidad}</div>
                    ))}
                  </td>
                  <td className="px-4 py-4 font-bold text-red-600 max-md:text-xs">
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
                  <td className="px-4 py-3 font-bold text-gray-900 uppercase">
                    {new Date(s.created_at).toLocaleString("default", {
                      month: "long",
                    })}
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-900 max-md:text-xs">
                    {s.fabrica}
                  </td>
                  <td className="px-4 py-4 font-bold text-gray-900 max-md:text-xs">
                    {s.sucursal}
                  </td>
                  <td className="px-4 py-4 font-bold text-gray-900 max-md:text-xs">
                    {s.localidad}
                  </td>
                  <td className="px-4 py-4 font-bold text-gray-900 max-md:text-xs">
                    {s.usuario}
                  </td>
                  <td className="px-1 py-4 font-medium text-gray-900 max-md:text-xs flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleId(s.id), openModal();
                      }}
                      className="bg-green-100 py-1.5 uppercase px-4 text-center rounded-xl text-green-700"
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
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </button>
                    <Link
                      target="_blank"
                      to={`/resumen/${s.id}`}
                      className="bg-black py-2 px-5 text-center rounded-xl text-white uppercase"
                    >
                      Ver
                    </Link>
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
      <ModalEditarSalida
        closeModal={closeModal}
        isOpen={isOpen}
        obtenerID={obtenerId}
      />
    </section>
  );
};
