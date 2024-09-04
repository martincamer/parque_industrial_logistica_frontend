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

export const Salidas = () => {
  const { salidas } = useSalidasContext();
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
    new Set(salidas.map((salida) => salida.usuario.toLowerCase()))
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
      parseFloat(salida.espera) +
      parseFloat(salida.gastos || 0),
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
      parseFloat(salida.espera) +
      parseFloat(salida.gastos || 0),
    0
  );

  const totalEnSalidasAnual = filteredData.reduce(
    (total, salida) =>
      total +
      parseFloat(salida.total_flete) +
      parseFloat(salida.total_control) +
      parseFloat(salida.total_viaticos) +
      parseFloat(salida.espera) +
      parseFloat(salida.gastos || 0),
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
          Crear nuevas salidas de viviendas.
        </p>
        <button
          onClick={() =>
            document.getElementById("my_modal_crear_salida").showModal()
          }
          type="button"
          className="bg-primary py-1 px-4 rounded-md text-white font-semibold text-sm"
        >
          Crear nueva salida
        </button>
      </div>

      <div className="flex gap-3 mx-5 justify-between mt-10 mb-2 max-md:mt-3">
        <div className="flex items-center gap-3 max-md:flex-col">
          <div className="flex gap-2">
            <div className="border border-gray-300 flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md">
              <input
                value={searchTermCliente}
                onChange={handleSearchClienteChange}
                type="text"
                className="outline-none font-medium w-full"
                placeholder="Buscar por clientes.."
              />
              <FaSearch className="text-gray-700" />
            </div>

            <select
              value={selectedUser}
              onChange={handleUserChange}
              className="border border-gray-300 flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md outline-none font-semibold capitalize"
            >
              <option className="font-bold capitalize text-primary" value="">
                Seleccionar usuario...
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
              <th className="">Numero</th>
              <th className="">Fecha de la salida</th>
              <th className="">Fabrica de salida</th>
              <th className="">Total</th>
              <th className="">Clientes/Localidad/Ver</th>
              <th className="">Usuario</th>
              <th className="">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-xs capitalize font-medium">
            {filteredData
              .filter((s) => s.localidad === user.localidad) // Filtrar por localidad del usuario
              .map((s) => (
                <tr key={s.id}>
                  <td className="">{s.id}</td>
                  <td className="">{formatearFecha(s.created_at)}</td>
                  <td className="">{s.sucursal}</td>
                  <td className="text-primary font-bold">
                    {Number(
                      parseFloat(s.total_flete) +
                        parseFloat(s.total_control) +
                        parseFloat(s.total_viaticos) +
                        parseFloat(s.espera) +
                        parseFloat(s.gastos || 0)
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
                  <td className="">{s.usuario}</td>
                  <td className="md:hidden">
                    <div className="flex gap-1">
                      <FaEdit
                        onClick={() => {
                          handleObtenerId(s.id),
                            document
                              .getElementById("my_modal_actualizar_salida")
                              .showModal();
                        }}
                        className="text-xl text-blue-500"
                      />
                      <FaDeleteLeft
                        onClick={() => {
                          handleObtenerId(s.id),
                            document
                              .getElementById("my_modal_eliminar")
                              .showModal();
                        }}
                        className="text-xl text-red-500"
                      />
                      <Link className="capitalize" to={`/resumen/${s.id}`}>
                        <FaArrowAltCircleRight className="text-xl text-gray-700" />
                      </Link>
                    </div>
                  </td>
                  <td className="max-md:hidden">
                    <div className="dropdown dropdown-left">
                      <div
                        tabIndex={0}
                        role="button"
                        className="bg-gray-700 py-2 px-2 rounded-full text-white m-1"
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
                        className="font-bold text-xs dropdown-content z-[1] menu p-1 shadow-xl bg-white rounded-md w-52 border border-gray-200"
                      >
                        <li className="hover:bg-gray-700 hover:text-white rounded-md">
                          <button
                            type="button"
                            onClick={() => {
                              handleObtenerId(s.id),
                                document
                                  .getElementById("my_modal_actualizar_salida")
                                  .showModal();
                            }}
                          >
                            Editar
                          </button>
                        </li>
                        <li className="hover:bg-gray-700 hover:text-white rounded-md">
                          <button
                            onClick={() => {
                              handleObtenerId(s.id),
                                document
                                  .getElementById("my_modal_eliminar")
                                  .showModal();
                            }}
                            type="button"
                          >
                            Eliminar
                          </button>
                        </li>
                        <li className="hover:bg-gray-700 hover:text-white rounded-md">
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

      <ModalEliminar idObtenida={idObtenida} />
      <ModalVerClienteLocalidad
        isOpen={isOpenVerCliente}
        closeOpen={closeVerCliente}
        obtenerId={obtenerID}
      />
      <ModalCrearSalida />
      <ModalActualizarSalida obtenerID={idObtenida} />
    </section>
  );
};

const ModalCrearSalida = () => {
  const { user } = useAuth();

  const [error, setError] = useState("");

  //useContext
  const { setSalidas } = useSalidasContext();
  const { choferes, setChoferes } = useSalidasContext();

  //obtenerChoferes
  useEffect(() => {
    async function loadData() {
      const res = await client.get("/chofer");

      setChoferes(res.data);
    }

    loadData();
  }, []);

  //daots del cliente
  const [datosCliente, setDatosCliente] = useState([]);
  //eliminar cliente
  const eliminarCliente = (nombreClienteAEliminar) => {
    // Filtrar la lista de clientes para obtener una nueva lista sin el cliente a eliminar
    const nuevaListaClientes = datosCliente.filter(
      (cliente) => cliente.cliente !== nombreClienteAEliminar
    );
    // Actualizar el estado con la nueva lista de clientes
    setDatosCliente(nuevaListaClientes);
  };

  //estados del formulario
  const [chofer, setChofer] = useState("");
  const [km_viaje_control, setKmViajeControl] = useState(0);
  const [km_viaje_control_precio, setKmViajeControlPrecio] = useState(0);
  const [fletes_km, setKmFletes] = useState(0);
  const [fletes_km_precio, setKmFletesPrecio] = useState(0);
  const [armadores, setArmadores] = useState("");
  const [total_viaticos, setTotalViaticos] = useState(0);
  const [motivo, setMotivo] = useState("");
  const [fabrica, setFabrica] = useState("");
  const [salida, setSalida] = useState("");
  const [espera, setEspera] = useState(0);
  const [gastos, setGastos] = useState(0);
  const [chofer_vehiculo, setChoferVehiculo] = useState("");
  const [detalle_iveco, setDetalleIveco] = useState("");

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_URL, {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("nueva-salida", (nuevaSalida) => {
      setSalidas(nuevaSalida);
    });

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    setSalida(user.localidad);
    setFabrica(user.sucursal);
  }, []);

  const onSubmit = async () => {
    try {
      const res = await crearNuevaSalida({
        chofer,
        km_viaje_control,
        km_viaje_control_precio,
        fletes_km,
        fletes_km_precio,
        armadores,
        total_viaticos,
        motivo,
        salida,
        fabrica,
        total_control: Number(km_viaje_control * km_viaje_control_precio),
        total_flete: Number(
          chofer !== "Iveco Tecnohouse"
            ? fletes_km * fletes_km_precio
            : fletes_km_precio
        ),
        espera,
        chofer_vehiculo,
        datos_cliente: { datosCliente },
        gastos,
        detalle_iveco,
      });

      if (socket) {
        socket.emit("nueva-salida", res.data);
      }

      showSuccessToast("Creado correctamente");

      setChofer("");
      setKmViajeControl(0);
      setKmViajeControlPrecio(0);
      setKmFletes(0);
      setKmFletesPrecio(0);
      setArmadores("");
      setTotalViaticos(0);
      setMotivo("");
      setSalida("");
      setFabrica("");
      setEspera(0);
      setChoferVehiculo("");
      setGastos(0);
      setDetalleIveco("");

      setDatosCliente([]);

      document.getElementById("my_modal_crear_salida").close();
    } catch (error) {
      setError(error.response.data.message);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  const [usuario, setUsuario] = useState("");

  const handleUsuario = (usuario) => setUsuario(usuario);

  const [isEditable, setIsEditable] = useState(false);

  const handleInputClick = (index) => {
    setIsEditable(true);
  };

  return (
    <dialog id="my_modal_crear_salida" className="modal">
      <div className="modal-box rounded-md max-w-full h-full scroll-bar max-md:w-full max-md:max-h-full max-md:rounded-none">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-xl">
          Crear nueva salida de una vivienda .
        </h3>
        <p className="py-0.5 text-sm font-medium">
          En esta ventana podras crear una nuevas salidas de
          contratos/viviendas.
        </p>

        {error && error.length > 0 && (
          <div className="flex justify-center">
            <p className="bg-red-100 text-sm font-medium py-2 px-4 rounded-md text-red-800">
              {error}
            </p>
          </div>
        )}

        <form className="flex flex-col gap-4">
          <div className="flex gap-2 max-md:gap-2 my-4">
            <button
              type="button"
              onClick={() =>
                document.getElementById("my_modal_crear_chofer").showModal()
              }
              className="bg-blue-500 px-4 text-white rounded-md font-bold text-sm py-1.5"
            >
              Crear choferes
            </button>
            <button
              type="button"
              onClick={() =>
                document.getElementById("my_modal_ver_choferes").showModal()
              }
              c
              className="bg-primary px-4 text-white rounded-md font-bold text-sm py-1.5"
            >
              Ver choferes creados
            </button>
          </div>
          <article>
            <div className="flex flex-col gap-3 max-md:gap-5">
              <h3 className="font-bold max-md:text-sm text-gray-800 text-base">
                Seleccionar Fabrica de Salida y Localidad.
              </h3>
              <div className="grid grid-cols-4 items-center gap-2 max-md:grid-cols-1 max-md:gap-5">
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm">
                    Seleccionar fabrida de la salida
                  </label>
                  <select
                    onChange={(e) => setFabrica(e.target.value)}
                    value={fabrica}
                    type="text"
                    className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none"
                  >
                    <option className="font-bold text-primary" value="">
                      Selecciona la fabrica
                    </option>
                    <option className="font-semibold" value={user?.sucursal}>
                      {user?.sucursal}
                    </option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm">
                    Localidad o Provincia de salida
                  </label>
                  <input
                    onChange={(e) => setSalida(e.target.value)}
                    value={salida}
                    type="text"
                    className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none"
                  />
                </div>
              </div>
            </div>
          </article>
          <article className="flex flex-col gap-3">
            <div>
              <h3 className="font-bold text-base text-gray-800 max-md:text-sm">
                Ingresar datos de la salida.
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2 items-start">
                <label className="font-bold text-sm">Chofer de la salida</label>
                <select
                  onChange={(e) => setChofer(e.target.value)}
                  value={chofer}
                  type="text"
                  className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none"
                >
                  <option className="font-bold text-primary" value="">
                    Seleccionar chofer
                  </option>
                  {choferes.map((c) => (
                    <option className="font-semibold" key={c.id}>
                      {c.chofer}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2 items-start mt-3">
                <button
                  onClick={() =>
                    document
                      .getElementById("my_modal_crear_cliente")
                      .showModal()
                  }
                  type="button"
                  className="bg-primary hover:shadow-md py-1.5 px-4 gap-2 flex items-center text-white font-semibold text-sm rounded-md"
                >
                  Crear Clientes
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
                      d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                    />
                  </svg>
                </button>

                <div className="max-md:overflow-x-auto w-full max-w-full">
                  <table className="table ">
                    <thead className="text-left">
                      <tr>
                        <th className="font-bold text-gray-800 text-sm">
                          Cliente
                        </th>
                        <th className="font-bold text-gray-800 text-sm">
                          Localidad
                        </th>
                        <th className="font-bold text-gray-800 text-sm">
                          N° contrato
                        </th>{" "}
                        <th className="font-bold text-gray-800 text-sm">
                          Metros cuadrados
                        </th>
                        <th className="font-bold text-gray-800 text-sm">
                          Acciones
                        </th>
                      </tr>
                    </thead>

                    <tbody className="text-xs uppercase">
                      {datosCliente.map((datos) => (
                        <tr key={datos.id}>
                          <td>{datos.cliente}</td>
                          <td>{datos.localidad}</td>
                          <td>{datos.numeroContrato}</td>
                          <td>{datos.metrosCuadrados} mtrs</td>
                          <td>
                            <div className="flex space-x-3">
                              <button
                                onClick={() => eliminarCliente(datos.cliente)}
                                type="button"
                                className="bg-red-100 py-1 px-3 text-xs font-semibold text-center rounded-xl text-red-800 uppercase"
                              >
                                Eliminar
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  handleUsuario(datos.cliente),
                                    document
                                      .getElementById("my_modal_editar_cliente")
                                      .showModal();
                                }}
                                className="bg-green-100 py-1 px-3 text-xs font-semibold text-center rounded-xl uppercase text-green-700"
                              >
                                Editar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </article>
          <article className="flex flex-col gap-3 w-full items-start">
            <div>
              <h3 className="font-bold">Chofer/Vehiculo.</h3>
            </div>
            <div className="max-md:w-full">
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">Chofer Vehiculo</label>
                <input
                  value={chofer_vehiculo}
                  onChange={(e) => setChoferVehiculo(e.target.value)}
                  type="text"
                  className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 max-md:grid-cols-1">
              <div className="max-md:w-full">
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm">KM de viaje</label>
                  <input
                    value={km_viaje_control}
                    onChange={(e) => setKmViajeControl(e.target.value)}
                    type="text"
                    className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
                  />
                </div>
              </div>
              <div onClick={handleInputClick}>
                {isEditable ? (
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm">KM precio</label>
                    <input
                      value={km_viaje_control_precio}
                      onChange={(e) => setKmViajeControlPrecio(e.target.value)}
                      onBlur={() => {
                        setIsEditable(false);
                      }}
                      type="text"
                      className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm">KM precio</label>

                    <p className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto">
                      {formatearDinero(Number(km_viaje_control_precio) || 0)}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {" "}
                <label className="font-bold text-sm">Total km * precio</label>
                <p className="border border-gray-300 py-2 px-2 rounded-md capitalize text-sm outline-none w-auto font-bold">
                  {Number(
                    km_viaje_control * km_viaje_control_precio
                  ).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </article>

          <article className="flex flex-col gap-3 items-start">
            <div>
              <h3 className="font-bold text-base text-slate-700 max-md:text-sm">
                Fletes.
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-3 max-md:grid-cols-1">
              <div className="max-md:w-full">
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm">KM de viaje</label>
                  <input
                    value={fletes_km}
                    onChange={(e) => setKmFletes(e.target.value)}
                    type="text"
                    className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
                  />
                </div>
              </div>
              <div onClick={handleInputClick}>
                {isEditable ? (
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm">KM precio</label>
                    <input
                      value={fletes_km_precio}
                      onBlur={() => {
                        setIsEditable(false);
                      }}
                      onChange={(e) => setKmFletesPrecio(e.target.value)}
                      type="text"
                      className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm">KM precio</label>

                    <p className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto">
                      {formatearDinero(Number(fletes_km_precio) || 0)}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {" "}
                <label className="font-bold text-sm">Total km * precio</label>
                <p className="border border-gray-300 py-2 px-2 rounded-md capitalize text-sm outline-none w-auto font-bold">
                  {chofer !== "Iveco Tecnohouse"
                    ? Number(fletes_km * fletes_km_precio).toLocaleString(
                        "es-AR",
                        {
                          style: "currency",
                          currency: "ARS",
                          minimumIntegerDigits: 2,
                        }
                      )
                    : Number(fletes_km_precio).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        minimumIntegerDigits: 2,
                      })}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
              <div onClick={handleInputClick}>
                {isEditable ? (
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm">
                      Espera del fletero
                    </label>
                    <input
                      value={espera}
                      onChange={(e) => setEspera(e.target.value)}
                      onBlur={() => {
                        setIsEditable(false);
                      }}
                      type="text"
                      className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm">
                      Espera del fletero
                    </label>

                    <p className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto">
                      {formatearDinero(Number(espera) || 0)}
                    </p>
                  </div>
                )}
              </div>
            </div>{" "}
          </article>
          {chofer === "Iveco Tecnohouse" && (
            <article className="flex items-start flex-col gap-2">
              <div>
                <h3 className="font-bold text-base text-gray-900 max-md:text-sm">
                  Otros gastós aparte, solo si tiene.
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                <div onClick={handleInputClick}>
                  {isEditable ? (
                    <div className="flex flex-col gap-2">
                      <label className="font-bold text-sm">Otros gastós</label>
                      <input
                        value={gastos}
                        onChange={(e) => setGastos(e.target.value)}
                        onBlur={() => {
                          setIsEditable(false);
                        }}
                        type="text"
                        className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <label className="font-bold text-sm">Otros Gastós</label>

                      <p className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto">
                        {formatearDinero(Number(gastos) || 0)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </article>
          )}
          {chofer === "Iveco Tecnohouse" && (
            <article className="flex items-start flex-col gap-2">
              <div>
                <h3 className="font-bold text-base text-gray-900 max-md:text-sm">
                  Detalle de la salida o adjuntar descripción, motivos de la
                  salida.
                </h3>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">Escribir aca</label>
                <textarea
                  value={detalle_iveco}
                  placeholder="Escribir algo para detallar.."
                  onChange={(e) => setDetalleIveco(e.target.value)}
                  type="text"
                  className="border border-gray-300 py-2 px-2 rounded-md font-medium  text-sm outline-none w-auto"
                />
              </div>
            </article>
          )}
          <article className="flex flex-col gap-3 items-start">
            <div>
              <h3 className="font-bold text-base text-gray-900 max-md:text-sm">
                Viaticos Armadores.
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-3 max-md:grid-cols-1">
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">
                  Armador / Nombre y apellido.
                </label>
                <input
                  value={armadores}
                  onChange={(e) => setArmadores(e.target.value)}
                  type="text"
                  className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
                />
              </div>

              <div onClick={handleInputClick}>
                {isEditable ? (
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm">
                      Total en viaticos
                    </label>
                    <input
                      value={total_viaticos}
                      onChange={(e) => setTotalViaticos(e.target.value)}
                      onBlur={() => {
                        setIsEditable(false);
                        if (onBlur) onBlur();
                      }}
                      type="text"
                      className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm">
                      Total en Viaticos
                    </label>

                    <p className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto">
                      {formatearDinero(Number(total_viaticos) || 0)}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div>
              <p className="text-gray-900  font-bold">Motivo del refuerzo.</p>
              <div className="mt-2">
                <select
                  className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                >
                  <option className="text-primary font-bold" value="">
                    Seleccionar motivo
                  </option>
                  <option className="font-semibold" value="refuerzo">
                    Refuerzo
                  </option>
                  <option className="font-semibold" value="no cobra en base">
                    No cobra en base
                  </option>
                </select>
              </div>
              <div className="flex gap-2 mt-2 max-md:text-sm">
                {motivo === "refuerzo" ? (
                  <p className="py-2 px-2 rounded-md text-white bg-green-600 font-bold text-sm">
                    Refuerzo
                  </p>
                ) : motivo === "no cobra en base" ? (
                  <p className="py-2 px-2 rounded-md text-white bg-red-600 font-bold text-sm">
                    No cobra en base
                  </p>
                ) : null}
              </div>
            </div>
          </article>

          <div>
            <button
              className="py-1.5 px-6 bg-primary hover:shadow-md text-white transition-all rounded-md font-semibold text-sm"
              type="button"
              onClick={() => onSubmit()}
            >
              Crear nueva salida
            </button>
          </div>
        </form>

        <ModalCrearCliente
          setDatosCliente={setDatosCliente}
          datosCliente={datosCliente}
        />

        <ModalCrearChoferes />

        <ModalVerChoferes />

        <ModalEditarClienteSalida
          usuario={usuario}
          datosCliente={datosCliente}
          setDatosCliente={setDatosCliente}
        />
      </div>
    </dialog>
  );
};

//actualizar
const ModalActualizarSalida = ({ obtenerID }) => {
  const { user } = useAuth();

  const fechaActual = new Date();

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

  const nombresDias = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  const numeroDiaActual = fechaActual.getDay(); // Obtener el día del mes actual

  const numeroMesActual = fechaActual.getMonth() + 1; // Obtener el mes actual

  //useContext
  const { setSalidas: setSalidasReales } = useSalidasContext();
  const { choferes, setChoferes } = useSalidasContext();

  // const [salidas, setSalidas] = useState([]);

  //obtenerDatoUnico
  useEffect(() => {
    async function loadData() {
      const res = await client.get(`/salidas/${obtenerID}`);

      // setSalidas(res.data);

      setChofer(res.data.chofer || "");
      setFabrica(res.data.fabrica || "");
      setSalida(res.data.salida || "");
      setKmViajeControl(res.data.km_viaje_control);
      setKmViajeControlPrecio(res.data.km_viaje_control_precio);
      setKmFletes(res.data.fletes_km);
      setKmFletesPrecio(res.data.fletes_km_precio);
      setArmadores(res.data.armadores);
      setTotalViaticos(res.data.total_viaticos);
      setMotivo(res.data.motivo);
      setSalida(res.data.salida);
      setFabrica(res.data.fabrica);
      setEspera(res.data.espera);
      setGastos(res.data.gastos);
      setDetalleIveco(res.data.detalle_iveco);

      setChoferVehiculo(res.data.chofer_vehiculo);

      setDatosCliente(res.data.datos_cliente?.datosCliente);
    }

    loadData();
  }, [obtenerID]);

  //obtenerChoferes
  useEffect(() => {
    async function loadData() {
      const res = await client.get("/chofer");

      setChoferes(res.data);
    }

    loadData();
  }, []);

  //datos del cliente
  const [datosCliente, setDatosCliente] = useState([]);

  // //eliminar cliente
  const eliminarCliente = (nombreClienteAEliminar) => {
    // Filtrar la lista de clientes para obtener una nueva lista sin el cliente a eliminar
    const nuevaListaClientes = datosCliente.filter(
      (cliente) => cliente.cliente !== nombreClienteAEliminar
    );
    // Actualizar el estado con la nueva lista de clientes
    setDatosCliente(nuevaListaClientes);
  };

  //estados del formulario
  const [chofer, setChofer] = useState("");
  const [km_viaje_control, setKmViajeControl] = useState(0);
  const [km_viaje_control_precio, setKmViajeControlPrecio] = useState(0);
  const [fletes_km, setKmFletes] = useState(0);
  const [fletes_km_precio, setKmFletesPrecio] = useState(0);
  const [armadores, setArmadores] = useState("");
  const [total_viaticos, setTotalViaticos] = useState(0);
  const [motivo, setMotivo] = useState("");
  const [fabrica, setFabrica] = useState("");
  const [salida, setSalida] = useState("");
  const [espera, setEspera] = useState(0);
  const [chofer_vehiculo, setChoferVehiculo] = useState("");
  const [gastos, setGastos] = useState(0);
  const [detalle_iveco, setDetalleIveco] = useState("");

  const [socket, setSocket] = useState(null);

  const onSubmit = async () => {
    const salidasNuevas = {
      chofer,
      km_viaje_control,
      km_viaje_control_precio,
      fletes_km,
      fletes_km_precio,
      armadores,
      total_viaticos,
      motivo,
      salida,
      fabrica,
      total_control: Number(km_viaje_control * km_viaje_control_precio),
      total_flete: Number(
        chofer !== "Iveco Tecnohouse"
          ? fletes_km * fletes_km_precio
          : fletes_km_precio
      ),
      espera,
      chofer_vehiculo,
      datos_cliente: { datosCliente },
      gastos,
      detalle_iveco,
    };

    try {
      const res = await client.put(`/salidas/${obtenerID}`, salidasNuevas);

      socket.emit("editar-salida", res.data);

      document.getElementById("my_modal_actualizar_salida").close();

      showSuccessToast("Actualizado correctamente");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_URL, {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("editar-salida", (nuevaSalida) => {
      setSalidasReales(nuevaSalida);
    });

    return () => newSocket.close();
  }, [obtenerID]);

  const [usuario, setUsuario] = useState("");

  const handleUsuario = (usuario) => setUsuario(usuario);

  const [isEditable, setIsEditable] = useState(false);

  const handleInputClick = (index) => {
    setIsEditable(true);
  };

  return (
    <dialog id="my_modal_actualizar_salida" className="modal">
      <div className="modal-box rounded-md max-w-full h-full scroll-bar max-md:w-full max-md:max-h-full max-md:rounded-none">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-xl">
          Crear nueva salida de una vivienda .
        </h3>
        <p className="py-0.5 text-sm font-medium">
          En esta ventana podras crear una nuevas salidas de
          contratos/viviendas.
        </p>

        <form className="flex flex-col gap-4">
          <div className="flex gap-2 max-md:gap-2 my-4">
            <button
              type="button"
              onClick={() =>
                document.getElementById("my_modal_crear_chofer").showModal()
              }
              className="bg-blue-500 px-4 text-white rounded-md font-bold text-sm py-1.5"
            >
              Crear choferes
            </button>
            <button
              type="button"
              onClick={() =>
                document.getElementById("my_modal_ver_choferes").showModal()
              }
              c
              className="bg-primary px-4 text-white rounded-md font-bold text-sm py-1.5"
            >
              Ver choferes creados
            </button>
          </div>
          <article>
            <div className="flex flex-col gap-3 max-md:gap-5">
              <h3 className="font-bold max-md:text-sm text-gray-800 text-base">
                Seleccionar Fabrica de Salida y Localidad.
              </h3>
              <div className="grid grid-cols-4 items-center gap-2 max-md:grid-cols-1 max-md:gap-5">
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm">
                    Seleccionar fabrida de la salida
                  </label>
                  <select
                    onChange={(e) => setFabrica(e.target.value)}
                    value={fabrica}
                    type="text"
                    className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none"
                  >
                    <option className="font-bold text-primary" value="">
                      Selecciona la fabrica
                    </option>
                    <option className="font-semibold" value={user?.sucursal}>
                      {user?.sucursal}
                    </option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm">
                    Localidad o Provincia de salida
                  </label>
                  <input
                    onChange={(e) => setSalida(e.target.value)}
                    value={salida}
                    type="text"
                    className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none"
                  />
                </div>
              </div>
            </div>
          </article>
          <article className="flex flex-col gap-3">
            <div>
              <h3 className="font-bold text-base text-gray-800 max-md:text-sm">
                Ingresar datos de la salida.
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2 items-start">
                <label className="font-bold text-sm">Chofer de la salida</label>
                <select
                  onChange={(e) => setChofer(e.target.value)}
                  value={chofer}
                  type="text"
                  className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none"
                >
                  <option className="font-bold text-primary" value="">
                    Seleccionar chofer
                  </option>
                  {choferes.map((c) => (
                    <option className="font-semibold" key={c.id}>
                      {c.chofer}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2 items-start mt-3">
                <button
                  onClick={() =>
                    document
                      .getElementById("my_modal_crear_cliente")
                      .showModal()
                  }
                  type="button"
                  className="bg-primary hover:shadow-md py-1.5 px-4 gap-2 flex items-center text-white font-semibold text-sm rounded-md"
                >
                  Crear Clientes
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
                      d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                    />
                  </svg>
                </button>

                <div className="max-md:overflow-x-auto w-full max-w-full">
                  <table className="table ">
                    <thead className="text-left">
                      <tr>
                        <th className="font-bold text-gray-800 text-sm">
                          Cliente
                        </th>
                        <th className="font-bold text-gray-800 text-sm">
                          Localidad
                        </th>
                        <th className="font-bold text-gray-800 text-sm">
                          N° contrato
                        </th>
                        <th className="font-bold text-gray-800 text-sm">
                          Acciones
                        </th>
                      </tr>
                    </thead>

                    <tbody className="text-xs uppercase">
                      {datosCliente.map((datos) => (
                        <tr key={datos.id}>
                          <td>{datos.cliente}</td>
                          <td>{datos.localidad}</td>
                          <td>{datos.numeroContrato}</td>
                          <td>
                            <div className="flex space-x-3">
                              <button
                                onClick={() => eliminarCliente(datos.cliente)}
                                type="button"
                                className="bg-red-100 py-1 px-3 text-xs font-semibold text-center rounded-xl text-red-800 uppercase"
                              >
                                Eliminar
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  handleUsuario(datos.cliente),
                                    document
                                      .getElementById("my_modal_editar_cliente")
                                      .showModal();
                                }}
                                className="bg-green-100 py-1 px-3 text-xs font-semibold text-center rounded-xl uppercase text-green-700"
                              >
                                Editar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </article>
          <article className="flex flex-col gap-3 w-full items-start">
            <div>
              <h3 className="font-bold">Chofer/Vehiculo.</h3>
            </div>
            <div className="max-md:w-full">
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">Chofer Vehiculo</label>
                <input
                  value={chofer_vehiculo}
                  onChange={(e) => setChoferVehiculo(e.target.value)}
                  type="text"
                  className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 max-md:grid-cols-1">
              <div className="max-md:w-full">
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm">KM de viaje</label>
                  <input
                    value={km_viaje_control || 0}
                    onChange={(e) => setKmViajeControl(e.target.value)}
                    type="text"
                    className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
                  />
                </div>
              </div>
              <div onClick={handleInputClick}>
                {isEditable ? (
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm">KM precio</label>
                    <input
                      value={km_viaje_control_precio || 0}
                      onChange={(e) => setKmViajeControlPrecio(e.target.value)}
                      onBlur={() => {
                        setIsEditable(false);
                      }}
                      type="text"
                      className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm">KM precio</label>

                    <p className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto">
                      {formatearDinero(Number(km_viaje_control_precio) || 0)}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {" "}
                <label className="font-bold text-sm">Total km * precio</label>
                <p className="border border-gray-300 py-2 px-2 rounded-md capitalize text-sm outline-none w-auto font-bold">
                  {Number(
                    km_viaje_control * km_viaje_control_precio
                  ).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </article>

          <article className="flex flex-col gap-3 items-start">
            <div>
              <h3 className="font-bold text-base text-slate-700 max-md:text-sm">
                Fletes.
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-3 max-md:grid-cols-1">
              <div className="max-md:w-full">
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm">KM de viaje</label>
                  <input
                    value={fletes_km || 0}
                    onChange={(e) => setKmFletes(e.target.value)}
                    type="text"
                    className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
                  />
                </div>
              </div>
              <div onClick={handleInputClick}>
                {isEditable ? (
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm">KM precio</label>
                    <input
                      value={fletes_km_precio || 0}
                      onBlur={() => {
                        setIsEditable(false);
                      }}
                      onChange={(e) => setKmFletesPrecio(e.target.value)}
                      type="text"
                      className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm">KM precio</label>

                    <p className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto">
                      {formatearDinero(Number(fletes_km_precio) || 0)}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {" "}
                <label className="font-bold text-sm">Total km * precio</label>
                <p className="border border-gray-300 py-2 px-2 rounded-md capitalize text-sm outline-none w-auto font-bold">
                  {chofer !== "Iveco Tecnohouse"
                    ? Number(fletes_km * fletes_km_precio).toLocaleString(
                        "es-AR",
                        {
                          style: "currency",
                          currency: "ARS",
                          minimumIntegerDigits: 2,
                        }
                      )
                    : Number(fletes_km_precio).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        minimumIntegerDigits: 2,
                      })}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
              <div onClick={handleInputClick}>
                {isEditable ? (
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm">
                      Espera del fletero
                    </label>
                    <input
                      value={espera || 0}
                      onChange={(e) => setEspera(e.target.value)}
                      onBlur={() => {
                        setIsEditable(false);
                      }}
                      type="text"
                      className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm">
                      Espera del fletero
                    </label>

                    <p className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto">
                      {formatearDinero(Number(espera) || 0)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </article>

          {chofer === "Iveco Tecnohouse" && (
            <article className="flex items-start flex-col gap-2">
              <div>
                <h3 className="font-bold text-base text-gray-900 max-md:text-sm">
                  Otros gastós aparte, solo si tiene.
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                <div onClick={handleInputClick}>
                  {isEditable ? (
                    <div className="flex flex-col gap-2">
                      <label className="font-bold text-sm">Otros gastós</label>
                      <input
                        value={gastos}
                        onChange={(e) => setGastos(e.target.value)}
                        onBlur={() => {
                          setIsEditable(false);
                        }}
                        type="text"
                        className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <label className="font-bold text-sm">Otros Gastós</label>

                      <p className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto">
                        {formatearDinero(Number(gastos) || 0)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </article>
          )}
          {chofer === "Iveco Tecnohouse" && (
            <article className="flex flex-col gap-2">
              <div>
                <h3 className="font-bold text-base text-gray-900 max-md:text-sm">
                  Detalle de la salida o adjuntar descripción, motivos de la
                  salida.
                </h3>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">Escribir aca</label>
                <textarea
                  value={detalle_iveco}
                  placeholder="Escribir algo para detallar.."
                  onChange={(e) => setDetalleIveco(e.target.value)}
                  type="text"
                  className="border border-gray-300 py-2 px-2 rounded-md font-medium  text-sm outline-none w-1/3"
                />
              </div>
            </article>
          )}

          <article className="flex flex-col gap-3 items-start">
            <div>
              <h3 className="font-bold text-base text-gray-900 max-md:text-sm">
                Viaticos Armadores.
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-3 max-md:grid-cols-1">
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">
                  Armador / Nombre y apellido.
                </label>
                <input
                  value={armadores}
                  onChange={(e) => setArmadores(e.target.value)}
                  type="text"
                  className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
                />
              </div>

              <div onClick={handleInputClick}>
                {isEditable ? (
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm">
                      Total en viaticos
                    </label>
                    <input
                      value={total_viaticos || 0}
                      onChange={(e) => setTotalViaticos(e.target.value)}
                      onBlur={() => {
                        setIsEditable(false);
                        if (onBlur) onBlur();
                      }}
                      type="text"
                      className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm">
                      Total en Viaticos
                    </label>

                    <p className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto">
                      {formatearDinero(Number(total_viaticos) || 0)}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div>
              <p className="text-gray-900  font-bold">Motivo del refuerzo.</p>
              <div className="mt-2">
                <select
                  className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                >
                  <option className="text-primary font-bold" value="">
                    Seleccionar motivo
                  </option>
                  <option className="font-semibold" value="refuerzo">
                    Refuerzo
                  </option>
                  <option className="font-semibold" value="no cobra en base">
                    No cobra en base
                  </option>
                </select>
              </div>
              <div className="flex gap-2 mt-2 max-md:text-sm">
                {motivo === "refuerzo" ? (
                  <p className="py-2 px-2 rounded-md text-white bg-green-600 font-bold text-sm">
                    Refuerzo
                  </p>
                ) : motivo === "no cobra en base" ? (
                  <p className="py-2 px-2 rounded-md text-white bg-red-600 font-bold text-sm">
                    No cobra en base
                  </p>
                ) : null}
              </div>
            </div>
          </article>

          <div>
            <button
              className="py-1.5 px-6 bg-primary hover:shadow-md text-white transition-all rounded-md font-semibold text-sm"
              type="button"
              onClick={() => onSubmit()}
            >
              Actualizar la salida
            </button>
          </div>
        </form>

        <ModalCrearCliente
          setDatosCliente={setDatosCliente}
          datosCliente={datosCliente}
        />

        <ModalCrearChoferes />

        <ModalVerChoferes />

        <ModalEditarClienteSalida
          usuario={usuario}
          datosCliente={datosCliente}
          setDatosCliente={setDatosCliente}
        />
      </div>
    </dialog>
  );
};

const ModalEliminar = ({ idObtenida }) => {
  const { handleSubmit } = useForm();

  const { setSalidas } = useSalidasContext();

  const onSubmit = async (formData) => {
    try {
      const ordenData = {
        datos: {
          ...formData,
        },
      };

      const res = await client.delete(`/salidas/${idObtenida}`, ordenData);

      setSalidas(res.data);

      document.getElementById("my_modal_eliminar").close();

      showSuccessToastError("Eliminado correctamente");
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <dialog id="my_modal_eliminar" className="modal">
      <div className="modal-box rounded-md max-w-md">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <img
              className="w-44 mx-auto"
              src="https://app.holded.com/assets/img/document/doc_delete.png"
            />
          </div>
          <div className="font-semibold text-sm text-gray-400 text-center">
            REFERENCIA {idObtenida}
          </div>
          <div className="font-semibold text-[#FD454D] text-lg text-center">
            Eliminar la salida cargada..
          </div>
          <div className="text-sm text-gray-400 text-center mt-1">
            El documento no podra ser recuperado nunca mas...
          </div>
          <div className="mt-4 text-center w-full px-16">
            <button
              type="submit"
              className="bg-red-500 py-1 px-4 text-center font-bold text-white text-sm rounded-md w-full"
            >
              Confirmar
            </button>{" "}
            <button
              type="button"
              onClick={() =>
                document.getElementById("my_modal_eliminar").close()
              }
              className="bg-orange-100 py-1 px-4 text-center font-bold text-orange-600 mt-2 text-sm rounded-md w-full"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
