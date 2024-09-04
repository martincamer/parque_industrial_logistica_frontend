import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLegalesContext } from "../../../context/LegalesProvider";
import { ModalVerClienteRemuneracion } from "../../../components/Modales/ModalVerClienteRemuneracion";
import { FaDeleteLeft, FaEye, FaHouseChimneyUser } from "react-icons/fa6";
import { FaArrowAltCircleRight, FaEdit, FaSearch } from "react-icons/fa";
import { formatearFecha } from "../../../helpers/formatearFecha";
import { useAuth } from "../../../context/AuthProvider";
import { useForm } from "react-hook-form";
import { useObtenerId } from "../../../helpers/obtenerId";
import { formatearDinero } from "../../../helpers/FormatearDinero";
import {
  showSuccessToast,
  showSuccessToastError,
} from "../../../helpers/toast";
import { ModalEditarClienteRemuneracion } from "../../../components/Modales/ModalEditarClienteRemuneracion";
import { ModalCrearClienteRemuneracion } from "../../../components/Modales/ModalCrearClienteRemuneracion";
import { useSalidasContext } from "../../../context/SalidasProvider";
import { crearNuevoLegal } from "../../../api/ingresos";
import client from "../../../api/axios";
import io from "socket.io-client";

export const LegalesAdmin = () => {
  const [legalesReal, setLegales] = useState([]);
  useEffect(() => {
    async function loadDataLegales() {
      const respuesta = await client.get("/legales-admin");
      setLegales(respuesta.data);
    }

    loadDataLegales();
  }, []);

  const { user } = useAuth();

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

  //usuarios unicos
  const uniqueUsers = Array.from(
    new Set(legalesReal.map((legal) => legal.localidad.toLowerCase()))
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
  let filteredData = legalesReal.filter((item) => {
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

  // Filtrar pedidos del mes actual
  const currentMonth = new Date().getMonth() + 1;

  const filteredByMonth = legalesReal.filter((salida) => {
    const createdAtMonth = new Date(salida.created_at).getMonth() + 1;
    return createdAtMonth === currentMonth;
  });

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
  const filteredByWeek = legalesReal.filter((salida) => {
    const createdAtDate = new Date(salida.created_at);
    return createdAtDate >= firstDayOfWeek && createdAtDate <= lastDayOfWeek;
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

  //reduces de totales.
  const totalRecaudacionMensual = filteredByMonth.reduce((acc, current) => {
    // Convert the recaudacion value from string to number (assuming it's always a number in string format)
    const recaudacion = parseFloat(current.recaudacion);
    return acc + recaudacion;
  }, 0);

  const totalRecaudacionSemanal = filteredByWeek.reduce((acc, current) => {
    // Convert the recaudacion value from string to number (assuming it's always a number in string format)
    const recaudacion = parseFloat(current.recaudacion);
    return acc + recaudacion;
  }, 0);

  const totalRemuneracionesAnualmente = filteredData.reduce((acc, current) => {
    // Convert the recaudacion value from string to number (assuming it's always a number in string format)
    const recaudacion = parseFloat(current.recaudacion);
    return acc + recaudacion;
  }, 0);

  const [mostrarValor, setMostrarValor] = useState(false);

  const handleClick = () => {
    setMostrarValor(!mostrarValor); // Cambia el estado al contrario del estado actual
  };

  const totalContratosEntregados = filteredData.reduce((total, salida) => {
    return (
      total +
      (salida.datos_cliente.datosCliente
        ? salida.datos_cliente.datosCliente.length
        : 0)
    );
  }, 0);

  const totalMetrosCuadrados = filteredData?.reduce((total, salida) => {
    return (
      total +
      (salida?.datos_cliente?.datosCliente?.reduce((subtotal, cliente) => {
        return subtotal + Number(cliente.metrosCuadrados);
      }, 0) || 0)
    );
  }, 0);

  const { handleObtenerId, idObtenida } = useObtenerId();

  return (
    <section className="w-full h-full min-h-screen max-h-full">
      <div className="bg-gray-100 py-10 px-10 flex justify-between items-center max-md:flex-col max-md:gap-3">
        <p className="font-bold text-gray-900 text-xl">
          Contratos legales finalizados, perdidas.
        </p>
      </div>
      <div className="py-10 px-5 flex justify-between max-md:flex-col max-md:gap-3">
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
                Seleccionar localidad...
              </option>
              {uniqueUsers.map((user) => (
                <option
                  className="capitalize font-semibold"
                  key={user}
                  value={user}
                >
                  {user}
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

        <div className="dropdown dropdown-left dropdown-hover max-md:hidden">
          <button className="font-bold text-sm bg-primary py-2 px-4 text-white rounded">
            Ver estadisticas de legales
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 mt-2 bg-gray-800 w-[800px] rounded-md max-md:w-80 mr-1"
          >
            <div className="py-5 px-5 grid grid-cols-3 gap-5 w-full max-md:grid-cols-1">
              <div className="flex flex-col gap-1 border py-3 px-3 bg-white rounded-md">
                <p className="font-medium text-sm text-center">
                  Total en legales del mes.
                </p>
                <p className="font-bold text-lg text-primary text-center">
                  {totalRecaudacionMensual.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </p>
              </div>
              <div className="flex flex-col gap-1 border py-3 px-3 bg-white rounded-md">
                <p className="font-medium text-sm text-center">
                  Total en legales de la semana.
                </p>
                <p className="font-bold text-lg text-center">
                  {totalRecaudacionSemanal.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </p>
              </div>
              <div
                className="flex flex-col gap-1 border py-3 px-3 bg-white rounded-md"
                onClick={handleClick}
              >
                <p className="font-medium text-sm text-center">
                  Total en legales anualmente.
                </p>
                {mostrarValor ? (
                  <p className="font-bold text-lg text-primary text-center cursor-pointer">
                    {totalRemuneracionesAnualmente.toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </p>
                ) : (
                  <div className="flex gap-2 items-center justify-center font-bold cursor-pointer">
                    <FaEye className="text-primary text-xl" /> Ver monto
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1 border py-3 px-3 bg-white rounded-md">
                <p className="font-medium text-sm text-center">
                  Total viviendas entregadas/contratos.
                </p>
                <p className="font-bold text-lg text-primary text-center">
                  {totalContratosEntregados}
                </p>
              </div>
              <div className="flex flex-col gap-1 border py-3 px-3 bg-white rounded-md">
                <p className="font-medium text-sm text-center">
                  Total metros cuadrados entregados.
                </p>
                <p className="font-bold text-lg text-primary text-center">
                  {totalMetrosCuadrados?.toFixed(2)} mts.
                </p>
              </div>
            </div>
          </ul>
        </div>
      </div>
      {/* tabla de datos  */}
      <div className="px-5 max-md:overflow-x-auto scrollbar-hidden">
        <table className="table">
          <thead className="text-sm font-bold text-gray-800">
            <tr>
              <th>Num</th>
              <th>Fecha</th>
              <th>Mes</th>
              <th>Clientes</th>
              <th>Perdida</th>
              <th>Fabrica Usuario</th>
              <th>Localidad Usuario</th>
              <th>Usuario</th>
            </tr>
          </thead>
          <tbody className="text-xs capitalize font-medium">
            {filteredData.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{formatearFecha(s.created_at)}</td>
                <td>
                  {new Date(s.created_at).toLocaleString("default", {
                    month: "long",
                  })}
                </td>
                <td>
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

                <td>
                  <div className="flex">
                    <p
                      className={`font-bold py-1 px-2 rounded-md ${
                        s.recaudacion >= 0
                          ? "bg-green-100/80 text-green-700"
                          : "bg-red-100/80 text-red-700"
                      } `}
                    >
                      {Number(s.recaudacion).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        minimumIntegerDigits: 2,
                      })}
                    </p>
                  </div>
                </td>
                <td>{s.sucursal}</td>
                <td>{s.localidad}</td>
                <td>{s.usuario}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalVerClienteRemuneracion
        isOpen={isOpenVerCliente}
        closeOpen={closeVerCliente}
        obtenerId={obtenerID}
      />
    </section>
  );
};
