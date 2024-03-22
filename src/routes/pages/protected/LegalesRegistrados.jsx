import { Link } from "react-router-dom";
import { useState } from "react";
import { ModalEliminar } from "../../../components/Modales/ModalEliminar";
import { ToastContainer } from "react-toastify";
import { SyncLoader } from "react-spinners";
import client from "../../../api/axios";
import * as XLSX from "xlsx";

export const LegalesRegistrados = () => {
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

      const response = await client.post("/legales/rango-fechas", {
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

  console.log(datos);

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

  const [eliminarModal, setEliminarModal] = useState(false);
  const [obtenerId, setObtenerId] = useState(null);

  const openEliminar = () => {
    setEliminarModal(true);
  };

  const closeEliminar = () => {
    setEliminarModal(false);
  };

  const handleId = (id) => setObtenerId(id);

  const totalGastosCliente = datos.reduce(
    (total, item) => total + parseFloat(item.recaudacion),
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

  const totalDatosMetrosCuadrados = datos?.reduce((total, salida) => {
    return (
      total +
      (salida?.datos_cliente?.datosCliente?.reduce((subtotal, cliente) => {
        return subtotal + Number(cliente.metrosCuadrados);
      }, 0) || 0)
    );
  }, 0);

  return (
    <section className="w-full h-full px-12 max-md:px-4 flex flex-col gap-8 py-24">
      <ToastContainer />
      <div className=" py-10 px-10 rounded-xl bg-white border-slate-300 border-[1px] shadow grid grid-cols-4 gap-3 mb-1 max-md:grid-cols-1 max-md:border-none max-md:shadow-none max-md:py-0 max-md:px-0">
        <article className="flex flex-col gap-4 rounded-xl border border-slate-200 shadow bg-white p-6 max-md:pb-3">
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
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>

            <span className="text-xs font-medium">
              {" "}
              {Number(totalGastosCliente / 100000).toFixed(2)} %{""}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Total en remuneraciones de la busqueda
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
                ultima remuneracion total de la busqueda{" "}
                <span className="font-bold text-red-700">
                  {" "}
                  {Number(
                    Number(ultimaVentaDelDia?.recaudacion || 0)
                  ).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  })}
                </span>
              </span>
            </p>
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-xl border border-slate-200 shadow bg-white p-6 max-md:pb-3">
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

        <article className="flex flex-col gap-4 rounded-xl border border-slate-200 shadow bg-white p-6 max-md:pb-3">
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
              {totalDatosMetrosCuadrados / 10000} %{" "}
            </span>
          </div>

          <div>
            <strong className="block text-sm font-medium text-gray-500 max-md:text-xs">
              Total en metros cuadradados
            </strong>

            <p>
              <span className="text-3xl font-medium text-gray-900 max-md:text-base">
                {totalDatosMetrosCuadrados}
              </span>

              <span className="text-xs text-gray-500">
                {" "}
                Total en el mes {totalDatosMetrosCuadrados} mts{" "}
              </span>
            </p>
          </div>
        </article>
      </div>

      <div className="mt-10 max-md:mt-1">
        <div className="flex gap-6 items-center max-md:flex-col max-md:items-start">
          <div className="flex gap-2 items-center max-md:text-sm">
            <label className="text-base text-slate-700">Fecha de inicio</label>
            <input
              className="text-sm bg-white py-2 px-3 rounded-lg shadow border-slate-300 border-[1px] cursor-pointer text-slate-700 outline-none"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center max-md:text-sm">
            <label className="text-base text-slate-700">Fecha fin</label>
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
            className="bg-green-500 py-2 px-6 text-white rounded-xl shadow mt-5 max-md:text-sm"
            onClick={() => downloadDataAsExcel(datos)}
          >
            Descargar todo en formato excel
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center py-2 px-4 border-slate-300 border-[1px] shadow rounded-xl w-1/4 max-md:w-full">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          className="outline-none text-slate-600 w-full"
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
          <table className="w-full divide-y-2 divide-gray-200 text-sm">
            <thead className="text-left">
              <tr>
                <th className="px-4 py-2  text-orange-500 max-md:text-slate-800 font-bold uppercase">
                  Numero
                </th>
                <th className="px-4 py-2  text-orange-500 max-md:text-slate-800 font-bold uppercase">
                  Clientes/Cliente
                </th>
                <th className="px-4 py-2  text-orange-500 max-md:text-slate-800 font-bold uppercase">
                  Localidad/Cliente
                </th>
                <th className="px-4 py-2  text-orange-500 max-md:text-slate-800 font-bold uppercase">
                  Recaudacion generada
                </th>
                <th className="px-4 py-2  text-orange-500 max-md:text-slate-800 font-bold uppercase">
                  Creador
                </th>
                <th className="px-1 py-2  text-orange-500 max-md:text-slate-800 font-bold uppercase">
                  Eliminar
                </th>
                {/* <th className="px-1 py-2  text-orange-500 max-md:text-slate-800 font-bold uppercase">
                Editar
              </th> */}
                <th className="px-1 py-2  text-orange-500 max-md:text-slate-800 font-bold uppercase">
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
                  <td
                    className={`px-4 py-2 font-bold text-${
                      s.recaudacion >= 0 ? "black" : "red"
                    }-500 capitalize`}
                  >
                    {Number(s.recaudacion).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      minimumIntegerDigits: 2,
                    })}
                  </td>
                  <td className="px-4 py-2 font-medium text-gray-900 capitalize">
                    {s.usuario}
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
                  {/* <td className="px-1 py-2 font-medium text-gray-900 capitalize w-[150px] cursor-pointer">
                  <Link
                    to={`/editar/${s.id}`}
                    className="bg-green-500 py-2 px-5 text-center rounded-xl text-white"
                  >
                    Editar
                  </Link>
                </td> */}
                  <td className="px-1 py-2 font-medium text-gray-900 capitalize cursor-pointer">
                    <Link
                      to={`/legales/${s.id}`}
                      target="_blank"
                      className="bg-black py-2 px-5 text-center rounded-xl text-white"
                    >
                      Ver legales
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
      <ModalEliminar
        closeEliminar={closeEliminar}
        eliminarModal={eliminarModal}
        obtenerId={obtenerId}
      />
    </section>
  );
};
