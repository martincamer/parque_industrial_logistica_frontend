import { Link } from "react-router-dom";
import { useSalidasContext } from "../../../context/SalidasProvider";
import { useState, useEffect, Fragment } from "react";
import { FaArrowDown, FaDeleteLeft, FaHouseChimneyUser } from "react-icons/fa6";
import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaEdit,
  FaSearch,
} from "react-icons/fa";
import { formatearFecha } from "../../../helpers/formatearFecha";
import { useAuth } from "../../../context/AuthProvider";
import { crearNuevaSalida } from "../../../api/ingresos";
import { ModalCrearCliente } from "../../../components/Modales/ModalCrearCliente";
import { ModalCrearChoferes } from "../../../components/Modales/ModalCrearChoferes";
import { ModalVerChoferes } from "../../../components/Modales/ModalVerChoferes";
import { ModalEditarClienteSalida } from "../../../components/Modales/ModalEditarClienteSalida";
import { formatearDinero } from "../../../helpers/FormatearDinero";
import { ModalVerClienteLocalidad } from "../../../components/Modales/ModalVerClienteLocalidad";
import { useObtenerId } from "../../../helpers/obtenerId";
import { useForm } from "react-hook-form";
import {
  showSuccessToast,
  showSuccessToastError,
} from "../../../helpers/toast";
import client from "../../../api/axios";
import io from "socket.io-client";

export const SalidasAdmin = () => {
  const [salidas, setSalidas] = useState([]);
  useEffect(() => {
    async function loadDataSalidas() {
      const respuesta = await client.get("/salidas-admin");
      setSalidas(respuesta.data);
    }

    loadDataSalidas();
  }, []);

  const { user } = useAuth();

  const { idObtenida, handleObtenerId } = useObtenerId();
  const [obtenerID, setObtenerID] = useState(null);

  const handleID = (id) => setObtenerID(id);

  const [isOpenVerCliente, setIsOpenVerCliente] = useState(false);

  const openVerCliente = () => {
    setIsOpenVerCliente(true);
  };

  const closeVerCliente = () => {
    setIsOpenVerCliente(false);
  };

  const [searchTermCliente, setSearchTermCliente] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  // Obtener el primer día del mes actual
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

  // Convertir las fechas en formato YYYY-MM-DD para los inputs tipo date
  const fechaInicioPorDefecto = firstDayOfMonth.toISOString().split("T")[0];
  const fechaFinPorDefecto = lastDayOfMonth.toISOString().split("T")[0];

  const [fechaInicio, setFechaInicio] = useState(fechaInicioPorDefecto);
  const [fechaFin, setFechaFin] = useState(fechaFinPorDefecto);

  // Obtener lista de usuarios únicos
  const uniqueUsers = Array.from(
    new Set(salidas.map((salida) => salida.localidad.toLowerCase()))
  );

  const handleSearchClienteChange = (e) => {
    setSearchTermCliente(e.target.value);
  };

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleFechaInicioChange = (e) => {
    setFechaInicio(e.target.value);
  };

  const handleFechaFinChange = (e) => {
    setFechaFin(e.target.value);
  };

  // Filtrar por término de búsqueda y usuario seleccionado
  let filteredData = salidas.filter((item) => {
    const matchesSearchTerm = item.datos_cliente.datosCliente.some((cliente) =>
      cliente.cliente.toLowerCase().includes(searchTermCliente.toLowerCase())
    );

    // Filtrar por usuario seleccionado
    const matchesUser =
      selectedUser === "" ||
      item.localidad.toLowerCase() === selectedUser.toLowerCase();

    return matchesSearchTerm && matchesUser;
  });

  // Filtrar por rango de fechas
  if (fechaInicio && fechaFin) {
    const fechaInicioObj = new Date(fechaInicio);
    const fechaFinObj = new Date(fechaFin);
    filteredData = filteredData.filter((item) => {
      const fechaOrden = new Date(item.created_at);
      return fechaOrden >= fechaInicioObj && fechaOrden <= fechaFinObj;
    });
  }

  // Ordenar por fecha de mayor a menor
  filteredData.sort((a, b) => {
    const fechaA = new Date(a.created_at);
    const fechaB = new Date(b.created_at);
    return fechaB - fechaA; // Ordena de mayor a menor (fecha más reciente primero)
  });
  //salidas mensuales
  // Filtrar pedidos del mes actual
  const currentMonth = new Date().getMonth() + 1;

  const filteredByMonth = salidas.filter((salida) => {
    const createdAtMonth = new Date(salida.created_at).getMonth() + 1;
    return createdAtMonth === currentMonth;
  });

  const totalEnSalidas = filteredByMonth.reduce(
    (total, salida) =>
      total +
      parseFloat(salida.total_flete) +
      parseFloat(salida.total_control) +
      parseFloat(salida.total_viaticos) +
      parseFloat(salida.espera),
    0
  );

  // Obtener la fecha actual
  const currentDate = new Date();

  // Obtener el número del día de la semana (0 para domingo, 1 para lunes, etc.)
  const currentDayOfWeek = currentDate.getDay();

  // Calcular la fecha del primer día de la semana (lunes)
  const firstDayOfWeek = new Date(currentDate);
  firstDayOfWeek.setDate(
    currentDate.getDate() - currentDayOfWeek + (currentDayOfWeek === 0 ? -6 : 1)
  );

  // Calcular la fecha del último día de la semana (domingo)
  const lastDayOfWeek = new Date(currentDate);
  lastDayOfWeek.setDate(currentDate.getDate() - currentDayOfWeek + 7);

  // Filtrar las salidas por la semana actual
  const filteredByWeek = salidas.filter((salida) => {
    const createdAtDate = new Date(salida.created_at);
    return createdAtDate >= firstDayOfWeek && createdAtDate <= lastDayOfWeek;
  });

  // Calcular el total en salidas para la semana actual
  const totalEnSalidasSemana = filteredByWeek.reduce(
    (total, salida) =>
      total +
      parseFloat(salida.total_flete) +
      parseFloat(salida.total_control) +
      parseFloat(salida.total_viaticos) +
      parseFloat(salida.espera),
    0
  );

  const totalEnSalidasAnual = filteredData.reduce(
    (total, salida) =>
      total +
      parseFloat(salida.total_flete) +
      parseFloat(salida.total_control) +
      parseFloat(salida.total_viaticos) +
      parseFloat(salida.espera),
    0
  );

  const totalFletes = filteredData.reduce(
    (total, salida) => total + parseFloat(salida.total_flete),
    0
  );
  const totalControl = filteredData.reduce(
    (total, salida) => total + parseFloat(salida.total_control),
    0
  );
  const totalViaticos = filteredData.reduce(
    (total, salida) => total + parseFloat(salida.total_viaticos),
    0
  );
  const totalEspera = filteredData.reduce(
    (total, salida) => total + parseFloat(salida.espera),
    0
  );

  const totalContratosEnSalidas = filteredData?.reduce((total, salida) => {
    return (
      total +
      (salida?.datos_cliente?.datosCliente
        ? salida?.datos_cliente?.datosCliente?.length
        : 0)
    );
  }, 0);

  return (
    <section className="w-full h-full min-h-screen max-h-full">
      <div className="bg-gray-100 py-10 px-10 flex justify-between items-center max-md:flex-col max-md:gap-3">
        <p className="font-bold text-gray-900 text-xl">
          Salidas de contratos cargadas.
        </p>
      </div>

      <div className="flex gap-3 mx-5 justify-between mt-10 mb-2 max-md:mt-3">
        <div className="flex items-center gap-3 max-md:flex-col">
          <div className="flex gap-2 max-md:flex-col max-md:w-full">
            <div className="border border-gray-300 flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md">
              <input
                value={searchTermCliente}
                onChange={handleSearchClienteChange}
                type="text"
                className="outline-none font-medium w-full"
                placeholder="Buscar por contratos.."
              />
              <FaSearch className="text-gray-700" />
            </div>

            <select
              value={selectedUser}
              onChange={handleUserChange}
              className="border border-gray-300 flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md outline-none font-semibold capitalize"
            >
              <option className="font-bold capitalize text-primary" value="">
                Seleccionar localidad
              </option>
              {uniqueUsers.map((localidad) => (
                <option
                  className="capitalize font-semibold"
                  key={localidad}
                  value={localidad}
                >
                  {localidad}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <div className="border border-gray-300 flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md outline-none font-semibold">
              <input
                value={fechaInicio}
                onChange={handleFechaInicioChange}
                type="date"
                className="outline-none text-slate-600 w-full max-md:text-sm uppercase bg-white"
                placeholder="Fecha de inicio"
              />
            </div>
            <div className="border border-gray-300 flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md outline-none font-semibold">
              <input
                value={fechaFin}
                onChange={handleFechaFinChange}
                type="date"
                className="outline-none text-slate-600 w-full max-md:text-sm uppercase bg-white"
                placeholder="Fecha fin"
              />
            </div>
          </div>
        </div>

        <div className="max-md:hidden">
          <div className="dropdown dropdown-left dropdown-hover">
            <button className="font-bold text-sm bg-primary py-2 px-4 text-white rounded">
              Ver estadisticas de las salidas
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 mt-2 rounded-md bg-gray-800 w-[800px] max-md:w-[300px] mr-2"
            >
              <div className="py-5 px-5 grid grid-cols-3 gap-5 w-full max-md:grid-cols-1 max-md:h-[300px] scrollbar-hidden max-md:overflow-y-scroll">
                <div className="flex flex-col gap-1 bg-white rounded-md py-3 px-3">
                  <p className="font-medium text-sm text-center text-gray-900">
                    Total en salidas del mes.
                  </p>
                  <p className="font-bold text-lg text-primary text-center">
                    {totalEnSalidas.toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </p>
                </div>
                <div className="flex flex-col gap-1 bg-white rounded-md py-3 px-3">
                  <p className="font-medium text-sm text-center">
                    Total en salidas en la semana.
                  </p>
                  <p className="font-bold text-lg text-center">
                    {totalEnSalidasSemana.toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </p>
                </div>
                <div className="flex flex-col gap-1 bg-white rounded-md py-3 px-3">
                  <p className="font-medium text-sm text-center">
                    Total de salidas generadas.
                  </p>
                  <p className="font-bold text-lg text-center">
                    {salidas.length}
                  </p>
                </div>
                <div className="flex flex-col gap-1 bg-white rounded-md py-3 px-3">
                  <p className="font-medium text-sm text-center">
                    Total de salidas del mes.
                  </p>
                  <p className="font-bold text-lg text-center">
                    {filteredByMonth.length}
                  </p>
                </div>
                <div className="flex flex-col gap-1 bg-white rounded-md py-3 px-3">
                  <p className="font-medium text-sm text-center ">
                    Total en salidas filtradas.
                  </p>
                  <p className="font-bold text-lg  text-center">
                    {totalEnSalidasAnual.toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </p>
                </div>
                <div className="flex flex-col gap-1 bg-white rounded-md py-3 px-3">
                  <p className="font-medium text-sm text-center">
                    Total en fletes
                  </p>
                  <p className="font-bold text-lg text-center">
                    -{" "}
                    {totalFletes.toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </p>
                </div>
                <div className="flex flex-col gap-1 bg-white rounded-md py-3 px-3">
                  <p className="font-medium text-sm text-center ">
                    Total en control fletes
                  </p>
                  <p className="font-bold text-lg  text-center">
                    -{" "}
                    {totalControl.toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </p>
                </div>
                <div className="flex flex-col gap-1 bg-white rounded-md py-3 px-3">
                  <p className="font-medium text-sm text-center ">
                    Total en viaticos
                  </p>
                  <p className="font-bold text-lg  text-center">
                    -{" "}
                    {totalViaticos.toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </p>
                </div>
                <div className="flex flex-col gap-1 bg-white rounded-md py-3 px-3">
                  <p className="font-medium text-sm text-center ">
                    Total en viaticos
                  </p>
                  <p className="font-bold text-lg  text-center">
                    -{" "}
                    {totalViaticos.toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </p>
                </div>
                <div className="flex flex-col gap-1 bg-white rounded-md py-3 px-3">
                  <p className="font-medium text-sm text-center ">
                    Total en esperas fletero
                  </p>
                  <p className="font-bold text-lg  text-center">
                    -{" "}
                    {totalEspera.toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </p>
                </div>
                <div className="flex flex-col gap-1 bg-white rounded-md py-3 px-3">
                  <p className="font-medium text-sm text-center">
                    Total en contratos/salidas
                  </p>
                  <p className="font-bold text-lg text-center">
                    {totalContratosEnSalidas}
                  </p>
                </div>
              </div>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-md:overflow-x-auto mx-5 mt-10 scrollbar-hidden">
        <table className="table">
          <thead className="text-left font-bold text-gray-900 text-sm">
            <tr>
              <th className="">Num</th>
              <th className="">Fecha de la salida</th>
              <th className="">Total</th>
              <th className="">Clientes/Localidad/Ver</th>
              <th className="">Fabrica de salida</th>
              <th className="">Usuario</th>
              <th className="">Localidad</th>
            </tr>
          </thead>
          <tbody className="text-xs capitalize font-medium">
            {filteredData.map((s) => (
              <tr key={s.id}>
                <td className="">{s.id}</td>
                <td className="">{formatearFecha(s.created_at)}</td>
                <td className="text-primary font-bold">
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
                <td className="">
                  <button
                    onClick={() => {
                      handleID(s.id), openVerCliente();
                    }}
                    type="button"
                    className="bg-primary py-1 px-4 rounded text-white font-bold flex gap-2 items-center outline-none"
                  >
                    Ver cliente/contrato{" "}
                    <FaHouseChimneyUser className="text-xl" />
                  </button>
                </td>
                <td className="">{s.sucursal}</td>
                <td className="">{s.usuario}</td>
                <td className="">{s.localidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ModalVerClienteLocalidad
        isOpen={isOpenVerCliente}
        closeOpen={closeVerCliente}
        obtenerId={obtenerID}
      />
    </section>
  );
};
