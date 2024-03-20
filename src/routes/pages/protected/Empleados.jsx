import { Link } from "react-router-dom";
import { useEmpleadosContext } from "../../../context/EmpleadosProvider";
import { useEffect, useState } from "react";
import { ModalCrearFabrica } from "../../../components/empleados/ModalCrearFabrica";
import * as XLSX from "xlsx";
import client from "../../../api/axios";
import { guardarDatosEmpleado } from "../../../api/createDatos";
import { ModalEditarEmpleado } from "../../../components/empleados/ModalEditarEmpleado";

export const Empleados = () => {
  const { empleados, fabricas } = useEmpleadosContext();

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const [isEdit, setIsEdit] = useState(false);
  const openModalEdit = () => {
    setIsEdit(true);
  };

  const closeModalEdit = () => {
    setIsEdit(false);
  };

  //buscador y filtrador
  const [busqueda, setBusqueda] = useState("");
  const [filtroFabrica, setFiltroFabrica] = useState("");
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    // Filtrar empleados por búsqueda y tipo de fábrica
    const empleadosFiltrados = empleados.filter((empleado) => {
      const cumpleBusqueda = empleado.empleado
        .toLowerCase()
        .includes(busqueda.toLowerCase());
      const cumpleFiltro =
        !filtroFabrica || empleado.tipo_fabrica === filtroFabrica;
      return cumpleBusqueda && cumpleFiltro;
    });

    setResultados(empleadosFiltrados);
  }, [empleados, busqueda, filtroFabrica]);

  const totalFinalSum = resultados?.reduce((acumulador, empleado) => {
    // Convertir el valor de total_final a número y sumarlo al acumulador
    return acumulador + parseFloat(empleado?.total_final);
  }, 0);

  const totalFinalQuincenaCinco = resultados?.reduce((acumulador, empleado) => {
    // Convertir el valor de total_final a número y sumarlo al acumulador
    return acumulador + parseFloat(empleado?.total_quincena);
  }, 0);

  const totalFinalQuincenaVeinte = resultados?.reduce(
    (acumulador, empleado) => {
      // Convertir el valor de total_final a número y sumarlo al acumulador
      return acumulador + parseFloat(empleado?.total_quincena_veinte);
    },
    0
  );

  // Crear un conjunto para almacenar tipos de fábrica únicos
  const tiposFabricaUnicos = new Set(
    empleados.map((empleado) => empleado.tipo_fabrica)
  );

  // Convertir el conjunto a un array
  const tiposFabricaUnicosArray = Array.from(tiposFabricaUnicos);

  // Obtener la fecha actual
  const fechaActual = new Date();

  // Obtener el día de la semana (0 para domingo, 1 para lunes, ..., 6 para sábado)
  const diaDeLaSemana = fechaActual.getDay();

  // Obtener el día del mes
  const diaDelMes = fechaActual.getDate();

  // Obtener el mes (0 para enero, 1 para febrero, ..., 11 para diciembre)
  const mes = fechaActual.getMonth();

  // Obtener el año
  const ano = fechaActual.getFullYear();

  // Días de la semana en español
  const diasSemana = [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
  ];

  // Meses en español
  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  // Formatear la fecha
  const fechaFormateada = `${diasSemana[diaDeLaSemana]} ${meses[mes]} / ${diaDelMes} / ${ano}`;

  const itemsPerPage = 10; // Cantidad de elementos por página
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResults = resultados?.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(resultados.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSubmit = async () => {
    try {
      const response = await client.post("/empleados-datos", {
        datos: empleados,
      });

      console.log(response);
    } catch (error) {
      console.log(error.response);
    }
  };

  const downloadExcel = () => {
    const data = currentResults.map((e) => ({
      Empleado: e.empleado,
      Fecha: new Date(e.fecha).getFullYear(),
      Antiguedad: e.antiguedad,
      Tipo: e.tipo,
      "Sucrsal o Fabr.": e.tipo_fabrica,
      "mes 5 sin premios,descuentos,etc": Number(
        e.quincena_del_cinco
      ).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      }),
      "mes 20 sin premios,descuentos,etc": Number(
        e.quincena_del_veinte
      ).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      }),
      "premio asistencia": Number(e.premio_asistencia).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      }),
      "premio prouduccion": Number(e.premio_produccion).toLocaleString(
        "es-AR",
        {
          style: "currency",
          currency: "ARS",
        }
      ),
      "comida/premio": Number(e.comida_produccion).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      }),
      "mes 5": Number(e.total_quincena).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      }),
      "mes 20":
        e.tipo !== "mensual"
          ? Number(e.total_quincena_veinte).toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })
          : "",
      AntiguedadTotal: Number(e.total_antiguedad).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      }),
      Descuento:
        "-" +
        Number(e.descuento).toLocaleString("es-AR", {
          style: "currency",
          currency: "ARS",
        }),
      Banco:
        "+" +
        Number(e.otros).toLocaleString("es-AR", {
          style: "currency",
          currency: "ARS",
        }),
      Otros:
        "-" +
        Number(e.banco).toLocaleString("es-AR", {
          style: "currency",
          currency: "ARS",
        }),
      "Total Final": Number(e.total_final).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      }),
      "Total Final Mes": Number(
        Number(e.total_quincena) +
          Number(e.total_quincena_veinte) +
          Number(e.otros) +
          Number(e.banco)
      ).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      }),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
    XLSX.writeFile(wb, "empleados.xlsx");
  };

  const [obtenerId, setObtenerId] = useState(null);

  const handleId = (id) => setObtenerId(id);

  console.log(obtenerId);

  return (
    <section className=" py-16 w-full h-full flex flex-col gap-5">
      <Link
        to={"/"}
        className="px-10 absolute flex top-4 text-sm font-bold text-indigo-500 gap-2 items-center"
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
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
        VOLVER
      </Link>
      <div className="px-10">
        <div className=" bg-white w-full border-[1px] border-slate-300 shadow rounded-xl flex gap-4 items-center justify-center">
          <div className="py-8 px-6 flex flex-col justify-center items-center gap-1 w-full h-full border-r-[1px] border-slate-300">
            <p className="text-indigo-500 text-sm">Total empleados cargados</p>
            <p className="text-slate-700 text-sm font-semibold">
              {resultados.length}
            </p>
          </div>

          <div className="py-8 px-6 flex flex-col justify-center items-center gap-1 w-full h-full border-r-[1px] border-slate-300">
            <p className="text-indigo-500 text-sm">Total quincena 5 a pagar</p>
            <p className="text-slate-700 text-sm font-semibold">
              {Number(totalFinalQuincenaCinco).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
              })}
            </p>
          </div>

          <div className="py-8 px-6 flex flex-col justify-center items-center gap-1 w-full h-full border-r-[1px] border-slate-300">
            <p className="text-indigo-500 text-sm">Total quincena 20 a pagar</p>
            <p className="text-slate-700 text-sm font-semibold">
              {Number(totalFinalQuincenaVeinte).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
              })}
            </p>
          </div>

          <div className="py-8 px-6 flex flex-col justify-center items-center gap-1 w-full h-full">
            <p className="text-indigo-500 text-sm">Total fabricas cargadas</p>
            <p className="text-slate-700 text-sm font-semibold">
              {fabricas.length}
            </p>
          </div>
        </div>
      </div>
      <div className="px-10">
        <div className="bg-white w-full py-4 px-6 border-[1px] border-slate-300 shadow-md rounded-lg flex gap-4">
          <div>
            <button
              className="bg-indigo-500 text-white py-2 px-5 rounded-lg text-sm flex gap-2 items-center hover:translate-x-1 transiton-all ease-in-out duration-100"
              type="button"
            >
              <Link to="/empleado-nuevo">Cargar nuevo empleado</Link>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-7 h-[20px]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                />
              </svg>
            </button>
          </div>

          <div>
            <button
              onClick={() => openModal()}
              className="bg-indigo-500 text-white py-2 px-5 rounded-lg text-sm flex gap-2 items-center hover:translate-x-1 transiton-all ease-in-out duration-100"
              type="button"
            >
              Cargar nueva fabrica o editar fabrica
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-7 h-[20px]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                />
              </svg>
            </button>
          </div>

          <div>
            <button
              className="bg-slate-700 text-white py-2 px-5 rounded-lg text-sm flex gap-2 items-center cursor-pointer"
              type="button"
            >
              <Link to={"/empleados-comprobantes"}>
                Ir a pagina comprobantes
              </Link>
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
            </button>
          </div>

          <div>
            <Link
              to={"/empleados-datos"}
              className="bg-slate-700 text-white py-2 px-5 rounded-lg text-sm flex gap-2 items-center cursor-pointer"
            >
              Ver los datos guardados
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
          <div>
            <button
              className="bg-slate-500 text-white py-2 px-5 rounded-lg text-sm flex gap-2 items-center cursor-pointer"
              type="button"
            >
              <button type="button" onClick={() => handleSubmit()}>
                Guardar pagos / paso final
              </button>
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
            </button>
          </div>
        </div>
      </div>
      <div className="flex gap-16 items-center px-10">
        <div className="relative w-1/5 rounded-xl border-slate-300 border-[1px] py-2.5 pr-10 shadow-sm sm:text-sm cursor-pointer">
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar el empleado..."
            type="text"
            id="Search"
            className="outline-none px-2 w-full"
          />
          <span className="absolute inset-y-0 right-0 grid w-10 place-content-center">
            <button type="button" className="text-gray-600 hover:text-gray-700">
              <span className="sr-only">Search</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
          </span>
        </div>
        <div className="flex gap-2 items-center cursor-pointer">
          <label className="text-sm text-slate-600">Buscar por fabrica</label>
          <select
            value={filtroFabrica}
            onChange={(e) => setFiltroFabrica(e.target.value)}
            className="cursor-pointer rounded-xl bg-white px-4 border-slate-300 border-[1px] py-2.5 shadow uppercase text-slate-600 text-sm"
            name=""
            id=""
          >
            <option value="">Todos</option>
            {fabricas.map((f) => (
              <option value={f.tipo} key={f.id}>
                {f.tipo}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={downloadExcel}
          className="bg-green-500  py-2 px-5 text-white rounded-xl text-sm"
        >
          Descargar en formato excel
        </button>
      </div>

      <div className="h-screen px-4">
        <div className="overflow-x-auto rounded-lg border border-gray-200 mt-5">
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead>
              <tr className="border-b-[1px]">
                <th className="py-4 px-2 uppercase text-xs font-bold text-indigo-600 text-left">
                  Empleado
                </th>
                <th className="py-4 px-2 uppercase text-xs font-bold text-indigo-600 text-left">
                  Fecha
                </th>
                <th className="py-4 px-2 uppercase text-xs font-bold text-indigo-600 text-left">
                  Antg.
                </th>
                <th className="py-4 px-2 uppercase text-xs font-bold text-indigo-600 text-left">
                  Tipo
                </th>
                <th className="py-4 px-2 uppercase text-xs font-bold text-indigo-600 text-left">
                  Sucrsal o Fabr.
                </th>
                <th className="py-4 px-2 uppercase text-xs font-bold text-indigo-600 text-left">
                  mes 5
                </th>
                <th className="py-4 px-2 uppercase text-xs font-bold text-indigo-600 text-left">
                  mes 20
                </th>

                <th className="py-4 px-2 uppercase text-xs font-bold text-indigo-600 text-left">
                  Desc.
                </th>
                <th className="py-4 px-2 uppercase text-xs font-bold text-indigo-600 text-left">
                  Banco
                </th>
                <th className="py-4 px-2 uppercase text-xs font-bold text-indigo-600 text-left">
                  Otros
                </th>

                <th className="py-4 px-2 uppercase text-xs font-bold text-indigo-600 text-left">
                  Total Final Mes
                </th>
                <th className="py-2 px-2 uppercase text-xs font-bold text-indigo-600 text-left">
                  Ver
                </th>
                <th className="py-2 px-2 uppercase text-xs font-bold text-indigo-600 text-left">
                  Editar
                </th>
                <th className="py-2 px-2 uppercase text-xs font-bold text-indigo-600 text-left">
                  Descargar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-left">
              {currentResults.map((e) => (
                <tr
                  key={e.id}
                  className=" hover:bg-slate-100 transition-all ease-in-out duration-200 cursor-pointer"
                >
                  <td className="py-3 px-3 text-xs font-semibold text-left text-slate-600 capitalize">
                    {e.empleado}
                  </td>
                  <td className="py-3 px-3 text-xs font-semibold text-left text-slate-600">
                    {new Date(e.fecha).getFullYear()}
                  </td>
                  <td className="py-3 px-3 text-xs font-semibold text-left text-slate-600">
                    {e.antiguedad}
                  </td>
                  <td className="py-3 px-3 text-xs font-semibold text-left text-slate-600 capitalize">
                    {e.tipo}
                  </td>
                  <td className="py-3 px-3 text-xs font-semibold text-left text-slate-600 capitalize">
                    {e.tipo_fabrica}
                  </td>
                  <td className="py-3 px-3 text-xs font-semibold text-left text-slate-600">
                    {Number(e.total_quincena).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </td>
                  <td className="py-3 px-3 text-xs font-semibold text-left text-slate-600">
                    {e.tipo !== "mensual" &&
                      Number(e.total_quincena_veinte).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      })}
                  </td>

                  <td className="py-3 px-3 text-xs font-semibold text-left text-slate-600">
                    {" "}
                    {Number(e.descuento).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </td>
                  <td className="py-3 px-3 text-xs font-semibold text-left text-slate-600">
                    {" "}
                    {Number(e.otros).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </td>
                  <td className="py-3 px-3 text-xs font-semibold text-left text-slate-600">
                    {" "}
                    {Number(e.banco).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </td>
                  <td className="py-3 px-3 text-sm font-bold text-left text-green-600">
                    {Number(e.total_final).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </td>
                  <td className="py-3 px-3 text-sm text-left text-slate-700 flex items-start">
                    <Link
                      target="_blank" // Esto abre el enlace en una nueva pestaña
                      rel="noopener noreferrer" // Se recomienda para seguridad y prevención de ataques
                      to={`/empleados/${e.id}`}
                      className=" bg-slate-500/10 border-[1px] border-slate-500 py-1 px-3 rounded-lg text-left text-slate-700 flex gap-2 items-center text-xs font-semibold"
                    >
                      Ver
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
                          d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                        />
                      </svg>
                    </Link>
                  </td>
                  <td className="py-3 px-3 text-sm text-left text-slate-700">
                    <Link
                      onClick={() => {
                        handleId(e.id), openModalEdit();
                      }}
                      // target="_blank" // Esto abre el enlace en una nueva pestaña
                      // rel="noopener noreferrer" // Se recomienda para seguridad y prevención de ataques
                      // to={`/editar-empleado/${e.id}`}
                      type="button"
                      className="bg-indigo-500/10 border-[1px] border-indigo-500 py-1 px-3 text-indigo-600 rounded-lg text-left flex gap-2 items-center text-xs font-semibold w-20"
                    >
                      Editar
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
                  </td>

                  <td className="py-3 px-3 flex text-sm text-left text-slate-700">
                    <Link
                      to={`/view-pdf/${e.id}`}
                      target="_blank" // Esto abre el enlace en una nueva pestaña
                      rel="noopener noreferrer" // Se recomienda para seguridad y prevención de ataques
                      className={`bg-green-500/10 border-[1px] border-green-500 py-1 px-3 text-green-600 rounded-lg text-left flex gap-2 items-center text-xs font-semibold`}
                    >
                      Imprimir pdf
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center mt-4 mb-4 gap-3">
              <button
                className="mx-1 px-3 py-1 rounded bg-gray-100 shadow shadow-black/20 text-sm flex gap-1 items-center hover:bg-indigo-500 transiton-all ease-in duration-100 hover:text-white"
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
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  className={`mx-1 px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? "bg-indigo-500 hover:bg-primary transition-all ease-in-out text-white shadow shadow-black/20 text-sm"
                      : "bg-gray-100 shadow shadow-black/20 text-sm"
                  }`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className="mx-1 px-3 py-1 rounded bg-gray-100 shadow shadow-black/20 text-sm flex gap-1 items-center hover:bg-indigo-500 transiton-all ease-in duration-100 hover:text-white"
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
      </div>

      <ModalCrearFabrica isOpen={isOpen} closeModal={closeModal} />
      <ModalEditarEmpleado
        obtenerId={obtenerId}
        isOpenEdit={isEdit}
        closeModalEdit={closeModalEdit}
      />
    </section>
  );
};
