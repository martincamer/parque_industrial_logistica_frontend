import { Link } from "react-router-dom";
import { useState } from "react";
import { ModalEditarLegales } from "../../../components/Modales/ModalEditarLegales";
import { ToastContainer } from "react-toastify";
import { useAuth } from "../../../context/AuthProvider";
import { SyncLoader } from "react-spinners";
import client from "../../../api/axios";
import * as XLSX from "xlsx";

export const LegalesRegistrados = () => {
  const { user } = useAuth();

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [datos, setDatos] = useState([]);
  const [datosAdmin, setDatosAdmin] = useState([]);

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

      if (user.localidad === "admin") {
        const responseDos = await client.post("/legales/rango-fechas-admin", {
          fechaInicio,
          fechaFin,
        });

        setDatosAdmin(responseDos.data); // Maneja la respuesta según tus necesidades
      } else {
        const response = await client.post("/legales/rango-fechas", {
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
    return (
      salida.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salida.localidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salida.datos_cliente.datosCliente.some((d) =>
        d.cliente.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  });

  const totalGastosCliente = filteredResults.reduce(
    (total, item) => total + parseFloat(item.recaudacion),
    0
  );

  const totalDatos = filteredResults.reduce((total, salida) => {
    return (
      total +
      (salida.datos_cliente.datosCliente
        ? salida.datos_cliente.datosCliente.length
        : 0)
    );
  }, 0);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const downloadDataAsExcel = (datos) => {
    if (datos && datos.length > 0) {
      // Convert all data to an array of objects
      const dataArray = datos.map((data) => ({
        NUMERO: data.id,
        CLIENTES: (data?.datos_cliente?.datosCliente || [])
          .map(
            (datos) =>
              `${datos.cliente.toUpperCase()} (${datos.numeroContrato})`
          )
          .join(", "),
        LOCALIDAD: (data?.datos_cliente?.datosCliente || [])
          .map((datos) => `${datos.localidad.toUpperCase()}`)
          .join(", "),
        "TOTAL FLETES": (data?.datos_cliente?.datosCliente || [])
          .map((datos) => `${datos.totalFlete}`)
          .join(", "),
        "TOTAL METROS CUADRADOS": (data?.datos_cliente?.datosCliente || [])
          .map((datos) => `${datos.metrosCuadrados}`)
          .join(", "),
        ARMADOR: data.armador.toUpperCase(),
        CHOFER: data.chofer.toUpperCase(),
        "KM LINEAL": data.km_lineal,
        "FECHA DE CARGA": formatDate(data.fecha_carga),
        "FECHA DE ENTREGA": formatDate(data.fecha_entrega),
        "PAGO CHOFER ESPERA": data.pago_fletero_espera,
        REFUERZO: data.refuerzo,
        VIATICOS: data.viaticos,
        "TOTAL FLETES": (data?.datos_cliente?.datosCliente || []).reduce(
          (acc, datos) => acc + parseFloat(datos.totalFlete),
          0
        ),
        RECAUDACION: data.recaudacion,
      }));

      // Define the worksheet columns
      const columns = ["NUMERO", "CLIENTES"];

      // Create the worksheet
      const ws = XLSX.utils.json_to_sheet(dataArray, { header: columns });

      // Create a workbook and add the worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Datos");

      // Save the file
      XLSX.writeFile(wb, `all_datos.xlsx`);
    }
  };

  const totalDatosMetrosCuadrados = filteredResults?.reduce((total, salida) => {
    return (
      total +
      (salida?.datos_cliente?.datosCliente?.reduce((subtotal, cliente) => {
        return subtotal + Number(cliente.metrosCuadrados);
      }, 0) || 0)
    );
  }, 0);

  const [isOpen, setOpen] = useState(false);
  const [obtenerId, setObtenerId] = useState(null);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);
  const handleId = (id) => setObtenerId(id);

  const esNegativo = Number(totalGastosCliente) > 0;

  // Clases para el indicador visual
  const indicadorColor = esNegativo
    ? "bg-red-100 text-red-600"
    : "bg-red-100 text-red-600";
  const porcentajeColor = esNegativo ? "text-red-600" : "text-red-600";

  ///////////////ADMIN/////////////////////
  ///////////////////ADMIN///////////////////////
  const itemsPerPageAdmin = 10; // Cantidad de elementos por página para administración
  const [currentPageAdmin, setCurrentPageAdmin] = useState(1);
  const [searchTermAdmin, setSearchTermAdmin] = useState("");

  // Calcular índices de la página actual
  const indexOfLastItemAdmin = currentPageAdmin * itemsPerPageAdmin;
  const indexOfFirstItemAdmin = indexOfLastItemAdmin - itemsPerPageAdmin;

  // Obtener resultados de la página actual
  const currentResultsAdmin = datosAdmin?.slice(
    indexOfFirstItemAdmin,
    indexOfLastItemAdmin
  );

  // Calcular número total de páginas
  const totalPagesAdmin = Math.ceil(datosAdmin?.length / itemsPerPageAdmin);

  const handlePageChangeAdmin = (newPageAdmin) => {
    setCurrentPageAdmin(newPageAdmin);
  };

  // Determinar rango de páginas a mostrar en la paginación
  const rangeSizeAdmin = 5;
  const startPageAdmin = Math.max(
    1,
    currentPageAdmin - Math.floor(rangeSizeAdmin / 2)
  );
  const endPageAdmin = Math.min(
    totalPagesAdmin,
    startPageAdmin + rangeSizeAdmin - 1
  );

  // Filtrar resultados por término de búsqueda
  const filteredResultsAdmin = currentResultsAdmin.filter((salida) => {
    return (
      salida.usuario.toLowerCase().includes(searchTermAdmin.toLowerCase()) ||
      salida.localidad.toLowerCase().includes(searchTermAdmin.toLowerCase()) ||
      salida.datos_cliente.datosCliente.some((d) =>
        d.cliente.toLowerCase().includes(searchTermAdmin.toLowerCase())
      )
    );
  });

  const totalGastosClienteAdmin = filteredResultsAdmin.reduce(
    (total, item) => total + parseFloat(item.recaudacion),
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

  const resultadoNegativo =
    totalGastosClienteAdmin > 0
      ? -totalGastosClienteAdmin
      : totalGastosClienteAdmin;

  const isFilteredResultsAvailable =
    filteredResults && filteredResults.length > 0;

  const results = isFilteredResultsAvailable
    ? filteredResults
    : filteredResultsAdmin;

  const totalDatosRefuerzos = results?.reduce((total, salida) => {
    return total + Number(salida?.refuerzo || 0);
  }, 0);

  const totalDatosViaticos = results?.reduce((total, salida) => {
    return total + Number(salida?.viaticos || 0);
  }, 0);

  const totalDatosFleteEspera = results?.reduce((total, salida) => {
    return total + Number(salida?.pago_fletero_espera || 0);
  }, 0);

  const totalDatosAuto = results?.reduce((total, salida) => {
    return total + Number(salida?.auto || 0);
  }, 0);

  const totalEnFletesGenerados = results?.reduce((total, salida) => {
    return (
      total +
      (salida?.datos_cliente?.datosCliente
        ? salida.datos_cliente.datosCliente.reduce(
            (subtotal, cliente) => subtotal + Number(cliente.totalFlete || 0), // Asegurarse de manejar el caso en que totalFlete no esté definido
            0
          )
        : 0)
    );
  }, 0);

  return user.localidad === "admin" ? (
    <section className="w-full h-full px-12 max-md:px-4 flex flex-col gap-8 py-24">
      <ToastContainer />
      <div className="uppercase grid grid-cols-4 gap-3 mb-1 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-0 max-md:px-0">
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
              {Number(totalGastosClienteAdmin / 10000).toFixed(2)} %
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
                {Number(resultadoNegativo).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>
            </p>
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-2xl border hover:shadow-md transition-all ease-linear border-slate-200 bg-white p-6 max-md:p-3">
          <div
            className={`inline-flex gap-2 self-end rounded p-1 text-xs font-medium ${
              totalDatosRefuerzos < 0
                ? "bg-red-100 text-red-600"
                : "bg-red-100 text-red-600"
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
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>

            <span>{Number(totalDatosRefuerzos / 100000).toFixed(2)} %</span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Total en refuerzos de la busqueda
            </strong>

            <p>
              <span
                className={`text-2xl font-medium ${
                  Number(totalDatosRefuerzos) < 0
                    ? "text-red-600"
                    : "text-red-600"
                } max-md:text-base`}
              >
                -{" "}
                {Number(totalDatosRefuerzos).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>
            </p>
          </div>
        </article>
        <article className="flex flex-col gap-4 rounded-2xl border hover:shadow-md transition-all ease-linear border-slate-200 bg-white p-6 max-md:p-3">
          <div
            className={`inline-flex gap-2 self-end rounded p-1 text-xs font-medium ${
              totalDatosRefuerzos < 0
                ? "bg-red-100 text-red-600"
                : "bg-red-100 text-red-600"
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
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>

            <span>{Number(totalEnFletesGenerados / 100000).toFixed(2)} %</span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Total en fletes de la busqueda
            </strong>

            <p>
              <span
                className={`text-2xl font-medium ${
                  Number(totalEnFletesGenerados) < 0
                    ? "text-red-600"
                    : "text-red-600"
                } max-md:text-base`}
              >
                -{" "}
                {Number(totalEnFletesGenerados).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>
            </p>
          </div>
        </article>
        <article className="flex flex-col gap-4 rounded-2xl border hover:shadow-md transition-all ease-linear border-slate-200 bg-white p-6 max-md:p-3">
          <div
            className={`inline-flex gap-2 self-end rounded p-1 text-xs font-medium ${
              totalDatosViaticos < 0
                ? "bg-red-100 text-red-600"
                : "bg-red-100 text-red-600"
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
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>

            <span>{Number(totalDatosViaticos / 100000).toFixed(2)} %</span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Total en viaticos de la busqueda
            </strong>

            <p>
              <span
                className={`text-2xl font-medium ${
                  Number(totalDatosViaticos) < 0
                    ? "text-red-600"
                    : "text-red-600"
                } max-md:text-base`}
              >
                -{" "}
                {Number(totalDatosViaticos).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>
            </p>
          </div>
        </article>
        <article className="flex flex-col gap-4 rounded-2xl border hover:shadow-md transition-all ease-linear border-slate-200 bg-white p-6 max-md:p-3">
          <div
            className={`inline-flex gap-2 self-end rounded p-1 text-xs font-medium ${
              totalDatosFleteEspera < 0
                ? "bg-red-100 text-red-600"
                : "bg-red-100 text-red-600"
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
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>

            <span>{Number(totalDatosFleteEspera / 100000).toFixed(2)} %</span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Total en pagos a fletero por espera de la busqueda
            </strong>

            <p>
              <span
                className={`text-2xl font-medium ${
                  Number(totalDatosFleteEspera) < 0
                    ? "text-red-600"
                    : "text-red-600"
                } max-md:text-base`}
              >
                -{" "}
                {Number(totalDatosFleteEspera).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>
            </p>
          </div>
        </article>
        <article className="flex flex-col gap-4 rounded-2xl border hover:shadow-md transition-all ease-linear border-slate-200 bg-white p-6 max-md:p-3">
          <div
            className={`inline-flex gap-2 self-end rounded p-1 text-xs font-medium ${
              totalDatosAuto < 0
                ? "bg-red-100 text-red-600"
                : "bg-red-100 text-red-600"
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
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>

            <span>{Number(totalDatosAuto / 100000).toFixed(2)} %</span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Total en auto de la busqueda
            </strong>

            <p>
              <span
                className={`text-2xl font-medium ${
                  Number(totalDatosAuto) < 0 ? "text-red-600" : "text-red-600"
                } max-md:text-base`}
              >
                -{" "}
                {Number(totalDatosAuto).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
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
              {Number(totalDatosAdmin / 100).toFixed(2)} %{" "}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Total viviendas entregadas de la busqueda
            </strong>

            <p>
              <span className="text-3xl font-medium text-gray-900 max-md:text-base">
                {totalDatosAdmin}
              </span>

              <span className="text-xs text-gray-500">
                {" "}
                Total viviendas entregadas{" "}
                <span className="font-bold text-slate-700">
                  {totalDatosAdmin}
                </span>{" "}
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
              {Number(totalDatosMetrosCuadradosAdmin / 1000).toFixed(2)} %{" "}
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

      <div className="mt-4 max-md:mt-1">
        <div className="flex gap-6 items-center max-md:flex-col max-md:items-start">
          <div className="flex gap-2 items-center max-md:text-sm">
            <label className="text-base text-slate-700 uppercase">
              Fecha de inicio
            </label>
            <input
              className="text-sm bg-white py-2 px-3 rounded-lg shadow border-slate-300 border-[1px] cursor-pointer text-slate-700 uppercase outline-none"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center max-md:text-sm">
            <label className="text-base text-slate-700 uppercase">
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
              className="bg-white border-slate-300 border-[1px] rounded-xl px-4 py-2 shadow flex gap-3 text-slate-700 hover:shadow-md transtion-all ease-in-out duration-200 max-md:text-sm max-md:py-1"
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

        <div>
          <button
            className="bg-green-100 text-green-700 py-3 px-5 rounded-xl hover:shadow mt-5 max-md:text-sm uppercase text-sm
            flex gap-2 items-center"
            onClick={() => downloadDataAsExcel(datosAdmin)}
          >
            Descargar todo en formato excel
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
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center py-2 px-4 border-slate-300 border-[1px] shadow rounded-xl w-1/4 max-md:w-full">
          <input
            value={searchTermAdmin}
            onChange={(e) => setSearchTermAdmin(e.target.value)}
            type="text"
            className="outline-none text-slate-600 w-full uppercase text-sm"
            placeholder="Buscar el cliente en especifico / o usuario"
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
      </div>
      {/* tabla de datos  */}
      <div className="rounded-xl border-[1px] border-slate-300 shadow  overflow-x-scroll">
        {loading ? (
          // Muestra el spinner mientras se cargan los datos
          <div className="flex justify-center items-center h-40">
            <SyncLoader color="#4A90E2" size={6} margin={6} />
            <p className="animate-blink text-slate-700 text-sm">
              Buscando los datos...
            </p>
          </div>
        ) : (
          <table className="w-full divide-y-2 divide-gray-200 text-sm uppercase">
            <thead className="text-left">
              <tr>
                <th className="px-4 py-4  text-slate-700 max-md:text-slate-800 font-bold uppercase">
                  Numero
                </th>
                <th className="px-4 py-4  text-slate-700 max-md:text-slate-800 font-bold uppercase">
                  Clientes/Cliente
                </th>
                <th className="px-4 py-4  text-slate-700 max-md:text-slate-800 font-bold uppercase">
                  Localidad/Cliente
                </th>
                <th className="px-4 py-4  text-slate-700 max-md:text-slate-800 font-bold uppercase">
                  Total legal
                </th>
                <th className="px-4 py-4  text-slate-700 max-md:text-slate-800 font-bold uppercase">
                  Mes de creación
                </th>
                <th className="px-4 py-4  text-slate-700 max-md:text-slate-800 font-bold uppercase">
                  Fecha de creación
                </th>
                <th className="px-4 py-4  text-slate-700 max-md:text-slate-800 font-bold uppercase">
                  Creador
                </th>
                <th className="px-4 py-4  text-slate-700 max-md:text-slate-800 font-bold uppercase">
                  Localidad/Creador
                </th>
                <th className="px-4 py-4  text-slate-700 max-md:text-slate-800 font-bold uppercase">
                  Fabrica/Sucursal
                </th>
                <th className="px-1 py-4  text-slate-700 max-md:text-slate-800 font-bold uppercase">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredResultsAdmin.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-4 font-medium text-gray-900">
                    {s.id}
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-900">
                    {s.datos_cliente.datosCliente.map((c) => (
                      <div>
                        {c.cliente}({c.numeroContrato})
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-900">
                    {s.datos_cliente.datosCliente.map((c) => (
                      <div>{c.localidad}</div>
                    ))}
                  </td>
                  <td
                    className={`px-4 py-4 font-bold text-${
                      s.recaudacion >= 0 ? "black" : "red"
                    }-500`}
                  >
                    {Number(s.recaudacion).toLocaleString("es-AR", {
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

                  <td className="px-4 py-3 font-bold text-gray-900 uppercase">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 font-bold text-gray-900">
                    {s.usuario}
                  </td>
                  <td className="px-4 py-4 font-bold text-gray-900">
                    {s.localidad}
                  </td>
                  <td className="px-4 py-4 font-bold text-gray-900">
                    {s.sucursal}
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
        )}
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
      </div>
    </section>
  ) : (
    <section className="bg-gray-100/50 min-h-screen max-h-full w-full h-full px-12 max-md:px-4 flex flex-col gap-8 py-24">
      <ToastContainer />
      <div className="uppercase grid grid-cols-4 gap-3 mb-1 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-0 max-md:px-0">
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
              {Number(totalGastosCliente / 10000).toFixed(2)} %
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
                -
                {Number(totalGastosCliente).toLocaleString("es-AR", {
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

        <article className="flex flex-col gap-4 rounded-2xl border hover:shadow-md transition-all ease-linear border-slate-200 bg-white p-6 max-md:p-3">
          <div
            className={`inline-flex gap-2 self-end rounded p-1 text-xs font-medium ${
              totalDatosRefuerzos < 0
                ? "bg-red-100 text-red-600"
                : "bg-red-100 text-red-600"
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
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>

            <span>{Number(totalDatosRefuerzos / 100000).toFixed(2)} %</span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Total en refuerzos de la busqueda
            </strong>

            <p>
              <span
                className={`text-2xl font-medium ${
                  Number(totalDatosRefuerzos) < 0
                    ? "text-red-600"
                    : "text-red-600"
                } max-md:text-base`}
              >
                -{" "}
                {Number(totalDatosRefuerzos).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>
            </p>
          </div>
        </article>
        <article className="flex flex-col gap-4 rounded-2xl border hover:shadow-md transition-all ease-linear border-slate-200 bg-white p-6 max-md:p-3">
          <div
            className={`inline-flex gap-2 self-end rounded p-1 text-xs font-medium ${
              totalDatosRefuerzos < 0
                ? "bg-red-100 text-red-600"
                : "bg-red-100 text-red-600"
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
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>

            <span>{Number(totalEnFletesGenerados / 100000).toFixed(2)} %</span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Total en fletes de la busqueda
            </strong>

            <p>
              <span
                className={`text-2xl font-medium ${
                  Number(totalEnFletesGenerados) < 0
                    ? "text-red-600"
                    : "text-red-600"
                } max-md:text-base`}
              >
                -{" "}
                {Number(totalEnFletesGenerados).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>
            </p>
          </div>
        </article>
        <article className="flex flex-col gap-4 rounded-2xl border hover:shadow-md transition-all ease-linear border-slate-200 bg-white p-6 max-md:p-3">
          <div
            className={`inline-flex gap-2 self-end rounded p-1 text-xs font-medium ${
              totalDatosViaticos < 0
                ? "bg-red-100 text-red-600"
                : "bg-red-100 text-red-600"
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
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>

            <span>{Number(totalDatosViaticos / 100000).toFixed(2)} %</span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Total en viaticos de la busqueda
            </strong>

            <p>
              <span
                className={`text-2xl font-medium ${
                  Number(totalDatosViaticos) < 0
                    ? "text-red-600"
                    : "text-red-600"
                } max-md:text-base`}
              >
                -{" "}
                {Number(totalDatosViaticos).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>
            </p>
          </div>
        </article>
        <article className="flex flex-col gap-4 rounded-2xl border hover:shadow-md transition-all ease-linear border-slate-200 bg-white p-6 max-md:p-3">
          <div
            className={`inline-flex gap-2 self-end rounded p-1 text-xs font-medium ${
              totalDatosFleteEspera < 0
                ? "bg-red-100 text-red-600"
                : "bg-red-100 text-red-600"
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
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>

            <span>{Number(totalDatosFleteEspera / 100000).toFixed(2)} %</span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Total en pagos a fletero por espera de la busqueda
            </strong>

            <p>
              <span
                className={`text-2xl font-medium ${
                  Number(totalDatosFleteEspera) < 0
                    ? "text-red-600"
                    : "text-red-600"
                } max-md:text-base`}
              >
                -{" "}
                {Number(totalDatosFleteEspera).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
              </span>
            </p>
          </div>
        </article>
        <article className="flex flex-col gap-4 rounded-2xl border hover:shadow-md transition-all ease-linear border-slate-200 bg-white p-6 max-md:p-3">
          <div
            className={`inline-flex gap-2 self-end rounded p-1 text-xs font-medium ${
              totalDatosAuto < 0
                ? "bg-red-100 text-red-600"
                : "bg-red-100 text-red-600"
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
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>

            <span>{Number(totalDatosAuto / 100000).toFixed(2)} %</span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Total en auto de la busqueda
            </strong>

            <p>
              <span
                className={`text-2xl font-medium ${
                  Number(totalDatosAuto) < 0 ? "text-red-600" : "text-red-600"
                } max-md:text-base`}
              >
                -{" "}
                {Number(totalDatosAuto).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumIntegerDigits: 2,
                })}
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
              Total viviendas entregadas de la busqueda
            </strong>

            <p>
              <span className="text-3xl font-medium text-gray-900 max-md:text-base">
                {totalDatos}
              </span>

              <span className="text-xs text-gray-500">
                {" "}
                Total viviendas entregadas{" "}
                <span className="font-bold text-slate-700">
                  {totalDatos}
                </span>{" "}
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
              {Number(totalDatosMetrosCuadrados / 1000).toFixed(2)} %{" "}
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

      <div className="mt-4 max-md:mt-1">
        <div className="flex gap-6 items-center max-md:flex-col max-md:items-start">
          <div className="flex gap-2 items-center max-md:text-sm">
            <label className="text-base text-slate-700 uppercase">
              Fecha de inicio
            </label>
            <input
              className="text-sm bg-white py-2 px-3 rounded-lg shadow border-slate-300 border-[1px] cursor-pointer text-slate-700 uppercase outline-none"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center max-md:text-sm">
            <label className="text-base text-slate-700 uppercase">
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
              className="bg-white border-slate-300 border-[1px] rounded-xl px-4 py-2 shadow flex gap-3 text-slate-700 hover:shadow-md transtion-all ease-in-out duration-200 max-md:text-sm max-md:py-1"
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

        <div>
          <button
            className="bg-green-100 text-green-700 py-3 px-5 rounded-xl hover:shadow mt-5 max-md:text-sm uppercase text-sm
            flex gap-2 items-center"
            onClick={() => downloadDataAsExcel(datos)}
          >
            Descargar todo en formato excel
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
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div>
        <div className="bg-white flex justify-between items-center py-2 px-4 border-slate-300 border-[1px] shadow rounded-xl w-1/4 max-md:w-full">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            className="outline-none text-slate-600 w-full uppercase text-sm bg-white"
            placeholder="Buscar el cliente en especifico / o usuario"
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
      </div>
      {/* tabla de datos  */}
      <div className="bg-white rounded-xl border-[1px] border-slate-300 shadow  overflow-x-scroll">
        {loading ? (
          // Muestra el spinner mientras se cargan los datos
          <div className="flex justify-center items-center h-40">
            <SyncLoader color="#4A90E2" size={6} margin={6} />
            <p className="animate-blink text-slate-700 text-sm">
              Buscando los datos...
            </p>
          </div>
        ) : (
          <table className="w-full divide-y-2 divide-gray-200 text-sm uppercase">
            <thead className="text-left">
              <tr>
                <th className="px-4 py-4  text-slate-700 max-md:text-slate-800 font-bold uppercase">
                  Numero
                </th>
                <th className="px-4 py-4  text-slate-700 max-md:text-slate-800 font-bold uppercase">
                  Clientes/Cliente
                </th>
                <th className="px-4 py-4  text-slate-700 max-md:text-slate-800 font-bold uppercase">
                  Localidad/Cliente
                </th>
                <th className="px-4 py-4  text-slate-700 max-md:text-slate-800 font-bold uppercase">
                  Recaudación legal generada
                </th>
                <th className="px-4 py-4  text-slate-700 max-md:text-slate-800 font-bold uppercase">
                  MES DE CREACIÓN
                </th>
                <th className="px-4 py-4  text-slate-700 max-md:text-slate-800 font-bold uppercase">
                  Creador
                </th>
                <th className="px-4 py-4  text-slate-700 max-md:text-slate-800 font-bold uppercase">
                  Sucursal/Fabrica
                </th>
                <th className="px-4 py-4  text-slate-700 max-md:text-slate-800 font-bold uppercase">
                  Localidad/Creador
                </th>
                <th className="px-1 py-4  text-slate-700 max-md:text-slate-800 font-bold uppercase">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredResults.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-4 font-medium text-gray-900">
                    {s.id}
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-900">
                    {s.datos_cliente.datosCliente.map((c) => (
                      <div>
                        {c.cliente}({c.numeroContrato})
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-900">
                    {s.datos_cliente.datosCliente.map((c) => (
                      <div>{c.localidad}</div>
                    ))}
                  </td>
                  <td
                    className={`px-4 py-4 font-bold text-${
                      s.recaudacion >= 0 ? "red" : "red"
                    }-500`}
                  >
                    {Number(s.recaudacion).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      minimumIntegerDigits: 4,
                    })}
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-900 uppercase">
                    {new Date(s.created_at).toLocaleString("default", {
                      month: "long",
                    })}
                  </td>
                  <td className="px-4 py-4 font-bold text-gray-900">
                    {s.usuario}
                  </td>
                  <td className="px-4 py-4 font-bold text-gray-900">
                    {s.sucursal}
                  </td>
                  <td className="px-4 py-4 font-bold text-gray-900">
                    {s.localidad}
                  </td>
                  <td className="px-1 py-3 font-medium text-gray-900 uppercase w-[150px] cursor-pointer space-x-2 flex">
                    <button
                      type="button"
                      onClick={() => {
                        handleId(s.id), openModal();
                      }}
                      className="bg-green-100 py-1 uppercase px-2 text-center rounded-xl text-green-700"
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
      <ModalEditarLegales
        closeModal={closeModal}
        isOpen={isOpen}
        obtenerID={obtenerId}
      />
    </section>
  );
};
