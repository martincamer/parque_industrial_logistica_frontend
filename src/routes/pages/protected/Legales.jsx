import { Link } from "react-router-dom";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { useLegalesContext } from "../../../context/LegalesProvider";
import { ModalEliminarLegales } from "../../../components/Modales/ModalEliminarLegales";
import { ModalCrearLegales } from "../../../components/Modales/ModalCrearLegales";
import { ModalEditarLegales } from "../../../components/Modales/ModalEditarLegales";
import { ModalVerClienteRemuneracion } from "../../../components/Modales/ModalVerClienteRemuneracion";
import { FaEye, FaHouseChimneyUser } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

export const Legales = () => {
  const { legalesReal } = useLegalesContext();

  const [searchTermCliente, setSearchTermCliente] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  // Obtener lista de usuarios únicos
  const uniqueUsers = Array.from(
    new Set(
      legalesReal.map((remuneracion) => remuneracion.usuario.toLowerCase())
    )
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

    const matchesUser =
      selectedUser === "" ||
      item.usuario.toLowerCase() === selectedUser.toLowerCase();

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

  return (
    <section className="min-h-screen max-h-full w-full h-full max-w-full">
      <ToastContainer />

      <div className="bg-white mb-4 h-10 flex">
        <Link
          to={"/"}
          className="bg-blue-100 flex h-full px-4 justify-center items-center font-bold text-blue-600"
        >
          Inicio
        </Link>{" "}
        <Link
          to={"/legales"}
          className="bg-blue-500 flex h-full px-4 justify-center items-center font-bold text-white"
        >
          Legales
        </Link>
      </div>
      <div className="mx-5 my-10 bg-white py-6 px-6">
        <p className="font-bold text-blue-500 text-xl">
          Crea tus ordenes legales en esta sección y lleva el control de ellas.
        </p>
      </div>
      <div className="bg-white py-5 px-5 mx-5 my-10 flex gap-3">
        <div className="dropdown dropdown-bottom">
          <button className="font-bold text-sm bg-rose-400 py-2 px-4 text-white rounded">
            Ver estadisticas de las ordenes legales
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 mt-2 bg-white w-[800px] border"
          >
            <div className="py-5 px-5 grid grid-cols-3 gap-5 w-full">
              <div className="flex flex-col gap-1 border border-blue-500 py-3 px-3">
                <p className="font-medium text-sm text-center">
                  Total en ordenes legales del mes.
                </p>
                <p className="font-bold text-lg text-red-500 text-center">
                  {totalRecaudacionMensual.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </p>
              </div>
              <div className="flex flex-col gap-1 border border-blue-500 py-3 px-3">
                <p className="font-medium text-sm text-center">
                  Total en ordenes legales de la semana.
                </p>
                <p className="font-bold text-lg text-red-500 text-center">
                  {totalRecaudacionSemanal.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </p>
              </div>
              <div
                className="flex flex-col gap-1 border border-blue-500 py-3 px-3"
                onClick={handleClick}
              >
                <p className="font-medium text-sm text-center">
                  Total en ordenes legales anualmente.
                </p>
                {mostrarValor ? (
                  <p className="font-bold text-lg text-red-500 text-center cursor-pointer">
                    {totalRemuneracionesAnualmente.toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </p>
                ) : (
                  <div className="flex gap-2 items-center justify-center font-bold cursor-pointer">
                    <FaEye className="text-red-500 text-xl" /> Ver monto
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1 border border-blue-500 py-3 px-3">
                <p className="font-medium text-sm text-center">
                  Total viviendas entregadas/contratos.
                </p>
                <p className="font-bold text-lg text-blue-500 text-center">
                  {totalContratosEntregados}
                </p>
              </div>
              <div className="flex flex-col gap-1 border border-blue-500 py-3 px-3">
                <p className="font-medium text-sm text-center">
                  Total metros cuadrados entregados.
                </p>
                <p className="font-bold text-lg text-blue-500 text-center">
                  {totalMetrosCuadrados?.toFixed(2)} mts.
                </p>
              </div>
            </div>
          </ul>
        </div>
      </div>

      <div className="flex max-md:flex-col max-md:gap-2 max-md:items-start gap-5 mx-5 my-5 bg-white py-4 px-5">
        <Link
          onClick={() => openModal()}
          className="bg-orange-400 hover:bg-blue-500 transition-all flex py-1.5 px-4 rounded-full text-white font-semibold text-sm gap-2 items-center"
        >
          Crear nueva orden legal
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
      </div>

      <div className="flex gap-2 items-center w-2/3 max-md:w-full max-md:flex-col my-5 mx-5">
        <div className="bg-white py-2 px-3 text-sm font-bold w-full border border-blue-500 cursor-pointer flex items-center">
          <input
            value={searchTermCliente}
            onChange={handleSearchClienteChange}
            type="text"
            className="outline-none text-slate-600 w-full max-md:text-sm uppercase bg-white"
            placeholder="Buscar por cliente"
          />
          <FaSearch className="text-blue-500" />
        </div>
        <div className="bg-white py-2 px-3 text-sm font-bold w-full border border-blue-500 cursor-pointer">
          <select
            value={selectedUser}
            onChange={handleUserChange}
            className="outline-none text-slate-600 bg-white w-full uppercase"
          >
            <option className="uppercase font-bold text-orange-400" value="">
              Seleccionar usuario...
            </option>
            {uniqueUsers.map((user) => (
              <option
                className="uppercase font-semibold"
                key={user}
                value={user}
              >
                {user}
              </option>
            ))}
          </select>
        </div>
        <div className="bg-white py-2 px-3 text-sm font-bold w-full border border-blue-500 cursor-pointer flex items-center">
          <input
            value={fechaInicio}
            onChange={handleFechaInicioChange}
            type="date"
            className="outline-none text-slate-600 w-full max-md:text-sm uppercase bg-white"
            placeholder="Fecha de inicio"
          />
        </div>
        <div className="bg-white py-2 px-3 text-sm font-bold w-full border border-blue-500 cursor-pointer flex items-center">
          <input
            value={fechaFin}
            onChange={handleFechaFinChange}
            type="date"
            className="outline-none text-slate-600 w-full max-md:text-sm uppercase bg-white"
            placeholder="Fecha fin"
          />
        </div>
      </div>

      {/* tabla de datos  */}
      <div className="bg-white mx-5 my-5">
        <table className="w-full divide-y-2 divide-gray-200 text-xs table">
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
            {filteredData.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-3 font-bold text-gray-900 uppercase">
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
                    className="bg-blue-500 py-1 px-4 rounded text-white font-bold flex gap-2 items-center"
                  >
                    VER CLIENTE/LOCALIDAD{" "}
                    <FaHouseChimneyUser className="text-2xl" />
                  </button>
                </td>
                <td className="px-4 py-3 font-bold text-gray-900 uppercase">
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
                <td className="px-1 py-3 font-medium text-gray-900 uppercase cursor-pointer space-x-2 flex">
                  <div className="dropdown dropdown-left">
                    <div
                      tabIndex={0}
                      role="button"
                      className="bg-blue-500 py-2 px-2 rounded-full text-white m-1"
                    >
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
                          d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                        />
                      </svg>
                    </div>
                    <ul
                      tabIndex={0}
                      className="text-xs font-bold dropdown-content z-[1] menu p-2 shadow-md border-[1px] border-slate-200 bg-base-100 rounded-box w-52"
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
                        <Link className="capitalize" to={`/legales/${s.id}`}>
                          Ver la orden legal
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
