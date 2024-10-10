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
import { useRemuneracionContext } from "../../../context/RemuneracionesProvider";
import { CgMenuLeftAlt } from "react-icons/cg";
import { MdDelete } from "react-icons/md";

export const Legales = () => {
  const { legalesReal } = useLegalesContext();

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
    new Set(legalesReal.map((legal) => legal.usuario.toLowerCase()))
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
      const fechaOrden = new Date(item.fecha_entrega);
      return fechaOrden >= fechaInicioObj && fechaOrden <= fechaFinObj;
    });
  }

  filteredData.sort((a, b) => {
    return Number(b.id) - Number(a.id); // Ordena de mayor a menor por id
  });

  // Filtrar pedidos del mes actual
  const currentMonth = new Date().getMonth() + 1;

  const filteredByMonth = legalesReal.filter((salida) => {
    const createdAtMonth = new Date(salida.fecha_entrega).getMonth() + 1;
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
        <p className="font-extrabold text-2xl bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent ">
          Sector de contratos legales.
        </p>
        <button
          onClick={() =>
            document.getElementById("my_modal_crear_orden_legal").showModal()
          }
          type="button"
          className="bg-gradient-to-r from-primary to-indigo-600 py-1 px-4 rounded-md text-white font-semibold text-sm outline-none"
        >
          Cargar nuevo contrato legal
        </button>
      </div>
      <div className="px-5 pt-10 grid grid-cols-4 gap-2 max-md:grid-cols-1">
        <div className="bg-gray-800 py-5 px-10 rounded-xl shadow">
          <div className="flex flex-col gap-1 items-center">
            <p className="font-extrabold text-lg bg-gradient-to-l from-blue-200 to-primary bg-clip-text text-transparent">
              Total en legales.
            </p>
            <p className="text-white font-medium text-xl">
              {formatearDinero(totalRemuneracionesAnualmente)}
            </p>
          </div>
        </div>{" "}
        <div className="bg-gray-800 py-5 px-10 rounded-xl shadow">
          <div className="flex flex-col gap-1 items-center">
            <p className="font-extrabold text-lg bg-gradient-to-l from-green-200 to-blue-500 bg-clip-text text-transparent">
              Total contratos entregados.
            </p>
            <p className="text-white font-medium text-xl">
              {totalContratosEntregados}
            </p>
          </div>
        </div>{" "}
        <div className="bg-gray-800 py-5 px-10 rounded-xl shadow">
          <div className="flex flex-col gap-1 items-center">
            <p className="font-extrabold text-lg bg-gradient-to-l from-green-200 to-blue-500 bg-clip-text text-transparent">
              Total metros cuadrados.
            </p>
            <p className="text-white font-medium text-xl">
              {totalMetrosCuadrados.toFixed(2)} mtrs.
            </p>
          </div>
        </div>
      </div>
      <div className="py-10 px-5 flex justify-between max-md:flex-col max-md:gap-3 max-md:pb-5">
        <div className="flex items-center gap-3 max-md:flex-col max-md:items-stretch">
          <div className="flex gap-2 max-md:flex-col max-md:items-stretch">
            <div className="border border-gray-300 flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md max-md:items-stretch">
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
      </div>

      {/* tabla de datos  */}
      <div className="px-5 max-md:overflow-x-auto scrollbar-hidden max-md:pb-10">
        <table className="table bg-gray-200 rounded-t-xl">
          <thead className="text-left font-bold text-gray-900 text-sm">
            <tr>
              <th>Numero</th>
              <th>Contratos</th>
              <th>Armador</th>
              <th>Usuario</th>
              <th>Fabrica</th>
              <th>Fecha de carga</th>
              <th>Fecha de entrega</th>
              <th>Refuerzo</th>
              <th>Recaudado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody className="text-xs font-medium capitalize bg-white ">
            {filteredData
              .filter((s) => s.localidad === user.localidad) // Filtrar por localidad del usuario
              .map((s) => (
                <tr
                  className="hover:bg-gray-100/40 transition-all cursor-pointer"
                  key={s.id}
                >
                  <td>{s.id}</td>
                  <td className="">
                    <div className="flex gap-1 uppercase">
                      {s?.datos_cliente?.datosCliente?.map((p) => (
                        <p className="font-bold border border-gray-300 py-1 px-4 rounded-md">
                          {p.cliente} ({p.numeroContrato})
                        </p>
                      ))}
                    </div>
                  </td>
                  <td>
                    <p className="border border-gray-300 py-1 px-2 rounded-md font-bold uppercase">
                      {s.armador}
                    </p>
                  </td>
                  <td>{s.usuario}</td>
                  <td>{s.sucursal}</td>
                  <td>{formatearFecha(s.fecha_carga)}</td>
                  <td>
                    {s.fecha_entrega === "" ? (
                      <p className="font-bold text-red-500 bg-red-100 px-1 rounded-md py-1 text-center">
                        No hay una fecha ahún
                      </p>
                    ) : (
                      formatearFecha(s.fecha_entrega)
                    )}
                  </td>
                  <td>
                    <div className="flex">
                      <p
                        className={`${
                          s.refuerzo == 0
                            ? "font-bold text-green-700 bg-green-100"
                            : "font-bold text-red-700 bg-red-100"
                        } px-1 rounded-md py-1 text-center`}
                      >
                        {s.refuerzo == 0
                          ? "No tiene ahún"
                          : Number(s.refuerzo).toLocaleString("es-AR", {
                              style: "currency",
                              currency: "ARS",
                              minimumIntegerDigits: 2,
                            })}
                      </p>
                    </div>
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

                  <td className="md:hidden">
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => {
                          handleID(s.id), openVerCliente();
                        }}
                        type="button"
                        className="bg-primary py-1 px-2 rounded text-white font-bold flex gap-2 items-center outline-none"
                      >
                        <FaHouseChimneyUser className="text-xl" />
                      </button>
                      <FaEdit
                        onClick={() => {
                          handleObtenerId(s.id),
                            document
                              .getElementById(
                                "my_modal_actualizar_remuneracion"
                              )
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
                      <Link className="capitalize" to={`/legales/${s.id}`}>
                        <FaArrowAltCircleRight className="text-xl text-gray-700" />
                      </Link>
                    </div>
                  </td>
                  <td className="px-1 py-3 font-medium text-gray-900 uppercase cursor-pointer max-md:hidden">
                    <div className="dropdown dropdown-left">
                      <div
                        tabIndex={0}
                        role="button"
                        className="bg-gray-700 py-1 px-1 rounded-md text-white m-1"
                      >
                        <CgMenuLeftAlt className="text-white text-xl" />
                      </div>
                      <ul
                        tabIndex={0}
                        className="font-bold text-xs dropdown-content z-[1] menu p-1 shadow-xl border-[1px] border-gray-200 bg-base-100 rounded-md w-52"
                      >
                        <li className="hover:bg-gray-700 hover:text-white rounded-md">
                          <button
                            type="button"
                            onClick={() => {
                              handleID(s.id), openVerCliente();
                            }}
                          >
                            Obs contratos{" "}
                            <FaHouseChimneyUser className="text-xl" />
                          </button>
                        </li>
                        <li className="hover:bg-gray-700 hover:text-white rounded-md">
                          <button
                            type="button"
                            onClick={() => {
                              handleObtenerId(s.id),
                                document
                                  .getElementById(
                                    "my_modal_actualizar_remuneracion"
                                  )
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
                          <Link className="capitalize" to={`/legales/${s.id}`}>
                            Ver la orden completa
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

      <ModalVerClienteRemuneracion
        isOpen={isOpenVerCliente}
        closeOpen={closeVerCliente}
        obtenerId={obtenerID}
      />

      <ModalCrearRemuneracion />
      <ModalEliminar idObtenida={idObtenida} />

      <ModalActualizarRemuneracion obtenerID={idObtenida} />
    </section>
  );
};

export const ModalCrearRemuneracion = () => {
  const { setLegalesReal } = useLegalesContext();
  const { setCaja } = useRemuneracionContext();
  const [error, setError] = useState("");

  //useContext
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
  const [armador, setArmador] = useState("");
  const [fecha_carga, setFechaCarga] = useState("");
  const [fecha_entrega, setFechaEntrega] = useState("");
  const [km_lineal, setKmLineal] = useState(0);
  const [pago_fletero_espera, setPagoFletero] = useState(0);
  const [viaticos, setViaticos] = useState(0);
  const [refuerzo, setRefuerzo] = useState(0);
  const [auto, setAuto] = useState(0);

  // Utilizar reduce para calcular la suma total de la propiedad totalFlete
  const totalSuma = datosCliente.reduce((acumulador, elemento) => {
    // Convertir la propiedad totalFlete a número y sumarla al acumulador
    return acumulador + parseFloat(elemento.totalFlete);
  }, 0);

  const totalSumaMetros = datosCliente.reduce((acumulador, elemento) => {
    // Convertir la propiedad totalFlete a número y sumarla al acumulador
    return acumulador + parseFloat(elemento.metrosCuadrados);
  }, 0); // Iniciar el acumulador en 0

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_URL, {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("nuevo-legal", (nuevaSalida) => {
      // setLegalesReal(nuevaSalida);
      setLegalesReal(nuevaSalida.legales);
      setCaja(nuevaSalida.caja);
    });

    return () => newSocket.close();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    const recaudacion =
      Number(totalSuma) -
      Number(pago_fletero_espera) -
      Number(viaticos) -
      Number(auto) -
      Number(refuerzo);

    try {
      const res = await crearNuevoLegal({
        armador,
        fecha_carga,
        fecha_entrega,
        pago_fletero_espera, // Corregido el nombre del campo aquí
        km_lineal,
        viaticos,
        auto,
        refuerzo,
        recaudacion,
        chofer,
        datos_cliente: { datosCliente },
      });

      if (socket) {
        socket.emit("nuevo-legal", res.data);
      }

      showSuccessToast("Cargado correctamente");

      document.getElementById("my_modal_crear_orden_legal").close();
    } catch (error) {
      setError(error.response.data.message);

      setTimeout(() => {
        setError("");
      }, 1500);
    }
  };

  const [usuario, setUsuario] = useState("");

  const handleUsuario = (usuario) => setUsuario(usuario);

  const [isEditable, setIsEditable] = useState(false);

  const handleInputClick = () => {
    setIsEditable(true);
  };

  const [nuevoCliente, setNuevoCliente] = useState({
    cliente: "",
    numeroContrato: "",
    localidad: "",
    metrosCuadrados: "",
    totalFlete: "",
  });

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;

    // Update existing client data for inline editing
    if (index !== undefined) {
      const updatedClientes = [...datosCliente];
      updatedClientes[index][name] = value;
      setDatosCliente(updatedClientes);
    } else {
      // Update new client data
      setNuevoCliente({ ...nuevoCliente, [name]: value });
    }
  };

  const handleAddClient = () => {
    // Validate numeric fields
    if (
      isNaN(Number(nuevoCliente.metrosCuadrados)) ||
      isNaN(Number(nuevoCliente.totalFlete))
    ) {
      setError(
        "Los campos 'Metros Cuadrados' y 'Total de Flete' deben ser numéricos."
      );
      return;
    }

    const clientWithNumbers = {
      ...nuevoCliente,
      metrosCuadrados: Number(nuevoCliente.metrosCuadrados),
      totalFlete: Number(nuevoCliente.totalFlete),
    };

    // Add new client to the list
    setDatosCliente([...datosCliente, clientWithNumbers]);
    setNuevoCliente({
      cliente: "",
      numeroContrato: "",
      localidad: "",
      metrosCuadrados: "",
      totalFlete: "",
    });
    setError(""); // Clear error message
  };

  const [isEditableMetros, setIsEditableMetros] = useState(false);

  const handleInputClickMetros = () => {
    setIsEditableMetros(true);
  };

  return (
    <dialog id="my_modal_crear_orden_legal" className="modal">
      <div className="modal-box rounded-md max-w-full h-full scroll-bar max-md:w-full max-md:max-h-full max-md:rounded-none">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-xl">
          Cargar nueva orden, perdida legal.
        </h3>
        <p className="py-0.5 text-sm font-medium">
          En esta ventana podras crear nueva orden legal, perdida de los
          clientes, fletes ,etc.
        </p>

        {error && error.length > 0 && (
          <div className="flex justify-center">
            <p className="bg-red-100 text-sm font-medium py-2 px-4 rounded-md text-red-800">
              {error}
            </p>
          </div>
        )}

        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-5 max-md:py-2 max-md:px-2 max-md:border-none max-md:shadow-none mt-5"
        >
          <article className="flex flex-col gap-2">
            <div>
              <h3 className="font-bold text-lg">
                Ingresar datos del chofer del flete y armador.
              </h3>
            </div>
            {/* datos del formulario  */}
            <div className="flex flex-col items-start gap-6">
              <div className="grid grid-cols-3 gap-2 max-md:w-full max-md:grid-cols-1 max-md:gap-5">
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm">
                    Seleccionar Transportista
                  </label>
                  <select
                    onChange={(e) => setChofer(e.target.value)}
                    value={chofer}
                    type="text"
                    className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none"
                  >
                    <option value="">Seleccionar transportista</option>
                    {choferes.map((c) => (
                      <option key={c.id}>{c.chofer}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm">Armador</label>
                  <input
                    placeholder="Armador del viaje"
                    onChange={(e) => setArmador(e.target.value)}
                    value={armador}
                    type="text"
                    className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 items-start">
                <button
                  onClick={() =>
                    document
                      .getElementById("my_modal_crear_cliente_remuneracion")
                      .showModal()
                  }
                  type="button"
                  className="bg-gradient-to-r from-primary to-indigo-600 py-1 px-4 rounded-md text-white font-semibold text-sm outline-none flex gap-2 items-center"
                >
                  Cargar los cliente por ventana{" "}
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
              </div>
            </div>
            <div className="max-w-full min-w-full w-full max-md:overflow-x-auto">
              <table className="table w-full max-w-full min-w-full">
                <thead className="text-gray-900 text-sm">
                  <tr>
                    <th>Cliente</th>
                    <th>Localidad</th>
                    <th>Total mtrs</th>
                    <th>Total del flete</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="uppercase text-xs">
                  {datosCliente.map((datos, index) => (
                    <tr key={index}>
                      <td className="flex flex-col gap-2">
                        <input
                          placeholder="Nombre y apellido"
                          type="text"
                          name="cliente"
                          value={datos.cliente}
                          onChange={(e) => handleInputChange(e, index)}
                          className="border rounded p-2 outline-none font-bold placeholder:font-normal uppercase"
                        />
                        <input
                          placeholder="Numero del contrato"
                          type="text"
                          name="numeroContrato"
                          value={datos.numeroContrato}
                          onChange={(e) => handleInputChange(e, index)}
                          className="border rounded p-2 outline-none font-bold placeholder:font-normal uppercase"
                        />
                      </td>
                      <td>
                        <input
                          placeholder="Localidad del cliente"
                          type="text"
                          name="localidad"
                          value={datos.localidad}
                          onChange={(e) => handleInputChange(e, index)}
                          className="border rounded p-2 outline-none font-bold placeholder:font-normal uppercase w-full"
                        />
                      </td>
                      <td>
                        <div
                          onClick={handleInputClickMetros}
                          className="cursor-pointer"
                        >
                          {isEditableMetros ? (
                            <input
                              placeholder="Total de metros cuadrados"
                              type="text"
                              name="metrosCuadrados"
                              value={datos.metrosCuadrados}
                              onChange={(e) => handleInputChange(e, index)}
                              onBlur={() => {
                                setIsEditableMetros(false);
                              }}
                              className="border rounded p-2 outline-none font-bold placeholder:font-normal uppercase w-full"
                            />
                          ) : (
                            <div>
                              <p className="border rounded p-2 outline-none font-bold placeholder:font-normal uppercase w-full">
                                {datos.metrosCuadrados} mtrs.
                              </p>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div
                          onClick={handleInputClickMetros}
                          className="cursor-pointer"
                        >
                          {isEditableMetros ? (
                            <input
                              placeholder="Total del flete"
                              type="text"
                              name="totalFlete"
                              value={datos.totalFlete}
                              onChange={(e) => handleInputChange(e, index)}
                              onBlur={() => {
                                setIsEditableMetros(false);
                              }}
                              className="border rounded p-2 outline-none font-bold placeholder:font-normal uppercase w-full"
                            />
                          ) : (
                            <div>
                              <p className="border rounded p-2 outline-none font-bold placeholder:font-normal uppercase w-full">
                                {formatearDinero(Number(datos.totalFlete))}
                              </p>
                            </div>
                          )}
                        </div>
                        {/* <input
                          placeholder="Total del flete"
                          type="text"
                          name="totalFlete"
                          value={datos.totalFlete}
                          onChange={(e) => handleInputChange(e, index)}
                          className="border rounded p-2 outline-none font-bold placeholder:font-normal uppercase w-full"
                        /> */}
                      </td>
                      <td>
                        <button
                          onClick={() => eliminarCliente(datos.cliente)}
                          className="bg-red-500 py-1.5 px-2 text-xs font-semibold text-center rounded-md text-white"
                        >
                          <MdDelete className="text-2xl" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    {/* <td className="flex flex-col gap-2">
                      <input
                        type="text"
                        name="cliente"
                        value={nuevoCliente.cliente}
                        onChange={(e) => handleInputChange(e)}
                        placeholder="Nuevo Cliente"
                        className="border rounded p-2 outline-none font-bold placeholder:font-normal uppercase"
                      />
                      <input
                        type="text"
                        name="numeroContrato"
                        value={nuevoCliente.numeroContrato}
                        onChange={(e) => handleInputChange(e)}
                        placeholder="Número de Contrato"
                        className="border rounded p-2 outline-none font-bold placeholder:font-normal uppercase"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="localidad"
                        value={nuevoCliente.localidad}
                        onChange={(e) => handleInputChange(e)}
                        placeholder="Localidad"
                        className="border rounded p-2 outline-none font-bold placeholder:font-normal uppercase w-full"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="metrosCuadrados"
                        value={nuevoCliente.metrosCuadrados}
                        onChange={(e) => handleInputChange(e)}
                        placeholder="Metros Cuadrados"
                        className="border rounded p-2 outline-none font-bold placeholder:font-normal uppercase w-full"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="totalFlete"
                        value={nuevoCliente.totalFlete}
                        onChange={(e) => handleInputChange(e)}
                        placeholder="Total del Flete"
                        className="border rounded p-2 outline-none font-bold placeholder:font-normal uppercase w-full"
                      />
                    </td> */}
                    <td>
                      <button
                        type="button"
                        onClick={handleAddClient}
                        className="bg-gradient-to-r from-blue-400 to-violet-600 py-1.5 px-4 rounded-full text-white font-semibold text-sm outline-none flex gap-2 items-center"
                      >
                        Agregar cliente{" "}
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
                    </td>
                  </tr>
                </tbody>
              </table>
              {error && <p className="text-red-500">{error}</p>}
            </div>
          </article>

          <article className="flex flex-col items-start gap-5">
            <div>
              <h3 className="font-bold text-lg text-slate-700 max-md:text-sm">
                Fechas de carga/entrega.
              </h3>
            </div>
            <div className="flex gap-3 max-md:w-full max-md:flex-col">
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">Fecha de carga</label>
                <input
                  onChange={(e) => setFechaCarga(e.target.value)}
                  value={fecha_carga}
                  type="date"
                  className="border border-gray-300 py-2 px-2 rounded-md font-medium text-sm outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">Fecha de entrega</label>
                <input
                  onChange={(e) => setFechaEntrega(e.target.value)}
                  value={fecha_entrega}
                  type="date"
                  className="border border-gray-300 py-2 px-2 rounded-md font-medium text-sm outline-none"
                />
              </div>
            </div>
          </article>

          <article className="flex flex-col items-start gap-5">
            <div className="flex flex-col gap-2 items-start">
              <div>
                <h3 className="font-bold text-lg text-slate-700 max-md:text-sm">
                  Totales del viaje.
                </h3>
              </div>
              <div className="flex gap-5 ">
                <div className="flex gap-2 items-center border border-gray-300 rounded-md py-2 px-3">
                  <p className="text-gray-900 font-medium max-md:text-sm">
                    Total en fletes
                  </p>
                  <p className="font-bold text-slate-700 max-md:text-sm">
                    {Number(totalSuma).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      minimumIntegerDigits: 2,
                    })}
                  </p>
                </div>
                <div className="flex gap-2 items-center border border-gray-300 rounded-md py-2 px-3">
                  <p className="text-gray-900 font-medium max-md:text-sm">
                    Total en metros cuadrados
                  </p>
                  <p className="font-bold text-slate-700 max-md:text-sm">
                    {Number(totalSumaMetros).toFixed(2)} Mtrs.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-5 items-start justify-start gap-5 max-md:w-full max-md:grid-cols-1">
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">KM Lineal</label>
                <input
                  value={km_lineal}
                  onChange={(e) => setKmLineal(e.target.value)}
                  onBlur={() => {
                    setIsEditable(false);
                  }}
                  type="text"
                  className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
                />
              </div>

              <div className="cursor-pointer" onClick={handleInputClick}>
                {isEditable ? (
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm">
                      {" "}
                      Pago fletero + espera
                    </label>
                    <input
                      onChange={(e) => setPagoFletero(e.target.value)}
                      value={pago_fletero_espera}
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
                      {" "}
                      Pago fletero + espera
                    </label>

                    <p className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto">
                      {formatearDinero(Number(pago_fletero_espera) || 0)}
                    </p>
                  </div>
                )}
              </div>

              <div className="cursor-pointer" onClick={handleInputClick}>
                {isEditable ? (
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm">
                      {" "}
                      Total en viaticos
                    </label>
                    <input
                      onChange={(e) => setViaticos(e.target.value)}
                      value={viaticos}
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
                      {" "}
                      Total en viaticos
                    </label>

                    <p className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto">
                      {formatearDinero(Number(viaticos) || 0)}
                    </p>
                  </div>
                )}
              </div>

              <div className="cursor-pointer" onClick={handleInputClick}>
                {isEditable ? (
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm"> Total Auto</label>
                    <input
                      onChange={(e) => setAuto(e.target.value)}
                      value={auto}
                      onBlur={() => {
                        setIsEditable(false);
                      }}
                      type="text"
                      className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm"> Total Auto</label>

                    <p className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto">
                      {formatearDinero(Number(auto) || 0)}
                    </p>
                  </div>
                )}
              </div>

              <div className="cursor-pointer" onClick={handleInputClick}>
                {isEditable ? (
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm"> Total refuerzo</label>
                    <input
                      onChange={(e) => setRefuerzo(e.target.value)}
                      value={refuerzo}
                      onBlur={() => {
                        setIsEditable(false);
                      }}
                      type="text"
                      className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm"> Total refuerzo</label>

                    <p className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto">
                      {formatearDinero(Number(refuerzo) || 0)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex">
              <div className="flex max-md:flex-col max-md:w-full max-md:gap-1 max-md:py-1 max-md:items-start gap-3 bg-white border border-gray-300 rounded-md py-2 px-4 mt-5 items-center">
                <span className="font-bold text-slate-700">Remunerado</span>

                <p
                  className={
                    totalSuma -
                      pago_fletero_espera -
                      viaticos -
                      auto -
                      refuerzo <
                    0
                      ? "text-red-600 font-bold"
                      : "text-blue-500 font-bold"
                  }
                >
                  {Number(
                    totalSuma - pago_fletero_espera - viaticos - auto - refuerzo
                  ).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </article>

          <div>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-800 to-green-500 py-2 px-6 rounded-md text-white font-semibold text-sm outline-none"
            >
              Cargar nueva orden legal
            </button>
          </div>
        </form>

        <ModalCrearClienteRemuneracion
          datosCliente={datosCliente}
          setDatosCliente={setDatosCliente}
        />
        <ModalEditarClienteRemuneracion
          datosCliente={datosCliente}
          setDatosCliente={setDatosCliente}
          usuario={usuario}
        />
      </div>
    </dialog>
  );
};
// export const ModalCrearRemuneracion = () => {
//   const { setLegalesReal } = useLegalesContext();
//   const { setCaja } = useRemuneracionContext();
//   const [error, setError] = useState("");

//   //useContext
//   const { choferes, setChoferes } = useSalidasContext();

//   //obtenerChoferes
//   useEffect(() => {
//     async function loadData() {
//       const res = await client.get("/chofer");

//       setChoferes(res.data);
//     }

//     loadData();
//   }, []);

//   //daots del cliente
//   const [datosCliente, setDatosCliente] = useState([]);
//   //eliminar cliente
//   const eliminarCliente = (nombreClienteAEliminar) => {
//     // Filtrar la lista de clientes para obtener una nueva lista sin el cliente a eliminar
//     const nuevaListaClientes = datosCliente.filter(
//       (cliente) => cliente.cliente !== nombreClienteAEliminar
//     );
//     // Actualizar el estado con la nueva lista de clientes
//     setDatosCliente(nuevaListaClientes);
//   };

//   //estados del formulario
//   const [chofer, setChofer] = useState("");
//   const [armador, setArmador] = useState("");
//   const [fecha_carga, setFechaCarga] = useState("");
//   const [fecha_entrega, setFechaEntrega] = useState("");
//   const [km_lineal, setKmLineal] = useState(0);
//   const [pago_fletero_espera, setPagoFletero] = useState(0);
//   const [viaticos, setViaticos] = useState(0);
//   const [refuerzo, setRefuerzo] = useState(0);
//   const [auto, setAuto] = useState(0);

//   // Utilizar reduce para calcular la suma total de la propiedad totalFlete
//   const totalSuma = datosCliente.reduce((acumulador, elemento) => {
//     // Convertir la propiedad totalFlete a número y sumarla al acumulador
//     return acumulador + parseFloat(elemento.totalFlete);
//   }, 0);

//   const totalSumaMetros = datosCliente.reduce((acumulador, elemento) => {
//     // Convertir la propiedad totalFlete a número y sumarla al acumulador
//     return acumulador + parseFloat(elemento.metrosCuadrados);
//   }, 0); // Iniciar el acumulador en 0

//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     const newSocket = io(import.meta.env.VITE_URL, {
//       withCredentials: true,
//     });

//     setSocket(newSocket);

//     newSocket.on("nuevo-legal", (nuevaSalida) => {
//       // setLegalesReal(nuevaSalida);
//       setLegalesReal(nuevaSalida.legales);
//       setCaja(nuevaSalida.caja);
//     });

//     return () => newSocket.close();
//   }, []);

//   const onSubmit = async (e) => {
//     e.preventDefault();

//     const recaudacion =
//       Number(totalSuma) -
//       Number(pago_fletero_espera) -
//       Number(viaticos) -
//       Number(auto) -
//       Number(refuerzo);

//     try {
//       const res = await crearNuevoLegal({
//         armador,
//         fecha_carga,
//         fecha_entrega,
//         pago_fletero_espera, // Corregido el nombre del campo aquí
//         km_lineal,
//         viaticos,
//         auto,
//         refuerzo,
//         recaudacion,
//         chofer,
//         datos_cliente: { datosCliente },
//       });

//       if (socket) {
//         socket.emit("nuevo-legal", res.data);
//       }

//       showSuccessToast("Cargado correctamente");

//       document.getElementById("my_modal_crear_orden_legal").close();
//     } catch (error) {
//       setError(error.response.data.message);

//       setTimeout(() => {
//         setError("");
//       }, 1500);
//     }
//   };

//   const [usuario, setUsuario] = useState("");

//   const handleUsuario = (usuario) => setUsuario(usuario);

//   const [isEditable, setIsEditable] = useState(false);

//   const handleInputClick = () => {
//     setIsEditable(true);
//   };

//   return (
//     <dialog id="my_modal_crear_orden_legal" className="modal">
//       <div className="modal-box rounded-md max-w-full h-full scroll-bar max-md:w-full max-md:max-h-full max-md:rounded-none">
//         <form method="dialog">
//           {/* if there is a button in form, it will close the modal */}
//           <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
//             ✕
//           </button>
//         </form>
//         <h3 className="font-bold text-xl">
//           Cargar nueva orden, perdida legal.
//         </h3>
//         <p className="py-0.5 text-sm font-medium">
//           En esta ventana podras crear nueva orden legal, perdida de los
//           clientes, fletes ,etc.
//         </p>

//         {error && error.length > 0 && (
//           <div className="flex justify-center">
//             <p className="bg-red-100 text-sm font-medium py-2 px-4 rounded-md text-red-800">
//               {error}
//             </p>
//           </div>
//         )}

//         <form
//           onSubmit={onSubmit}
//           className="flex flex-col gap-5 max-md:py-2 max-md:px-2 max-md:border-none max-md:shadow-none mt-5"
//         >
//           <article className="flex flex-col gap-2">
//             <div>
//               <h3 className="font-bold text-lg">
//                 Ingresar datos del chofer del flete y armador.
//               </h3>
//             </div>
//             {/* datos del formulario  */}
//             <div className="flex flex-col items-start gap-6">
//               <div className="grid grid-cols-3 gap-2 max-md:w-full max-md:grid-cols-1 max-md:gap-5">
//                 <div className="flex flex-col gap-2">
//                   <label className="font-bold text-sm">
//                     Seleccionar Transportista
//                   </label>
//                   <select
//                     onChange={(e) => setChofer(e.target.value)}
//                     value={chofer}
//                     type="text"
//                     className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none"
//                   >
//                     <option value="">Seleccionar transportista</option>
//                     {choferes.map((c) => (
//                       <option key={c.id}>{c.chofer}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="flex flex-col gap-2">
//                   <label className="font-bold text-sm">Armador</label>
//                   <input
//                     placeholder="Armador del viaje"
//                     onChange={(e) => setArmador(e.target.value)}
//                     value={armador}
//                     type="text"
//                     className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none"
//                   />
//                 </div>
//               </div>
//               <div className="flex flex-col gap-2 items-start">
//                 <button
//                   onClick={() =>
//                     document
//                       .getElementById("my_modal_crear_cliente_remuneracion")
//                       .showModal()
//                   }
//                   type="button"
//                   className="bg-primary text-white flex gap-2 items-center px-4 py-1 rounded-md text-sm font-semibold"
//                 >
//                   Crear Clientes
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth={1.5}
//                     stroke="currentColor"
//                     className="w-6 h-6"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
//                     />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//             <div className="max-w-full min-w-full w-full max-md:overflow-x-auto">
//               <table className="table w-full max-w-full min-w-full">
//                 <thead className="text-gray-900 text-sm">
//                   <tr>
//                     <th className="">Cliente</th>
//                     <th className="">Localidad</th>
//                     <th className="">Total mtrs</th>
//                     <th className="">Total del flete</th>
//                     <th className="">Acciones</th>
//                   </tr>
//                 </thead>

//                 <tbody className="uppercase text-xs">
//                   {datosCliente.map((datos) => (
//                     <tr key={datos.id}>
//                       <td>
//                         {datos.cliente} ({datos.numeroContrato})
//                       </td>
//                       <td>{datos.localidad}</td>
//                       <td>{datos.metrosCuadrados} Mts</td>
//                       <td className="font-bold">
//                         {Number(datos.totalFlete).toLocaleString("es-AR", {
//                           style: "currency",
//                           currency: "ARS",
//                           minimumIntegerDigits: 2,
//                         })}
//                       </td>
//                       <td>
//                         <div className="flex space-x-3">
//                           <button
//                             onClick={() => eliminarCliente(datos.cliente)}
//                             type="button"
//                             className="bg-red-100 py-1 px-3 text-xs font-semibold text-center rounded-md text-red-800"
//                           >
//                             Eliminar
//                           </button>
//                           <button
//                             type="button"
//                             onClick={() => {
//                               handleUsuario(datos.cliente),
//                                 document
//                                   .getElementById(
//                                     "my_modal_editar_cliente_remuneracion"
//                                   )
//                                   .showModal();
//                             }}
//                             className="bg-green-100 py-1 px-3 text-xs font-semibold text-center rounded-md text-green-700"
//                           >
//                             Editar
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </article>

//           <article className="flex flex-col items-start gap-5">
//             <div>
//               <h3 className="font-bold text-lg text-slate-700 max-md:text-sm">
//                 Fechas de carga/entrega.
//               </h3>
//             </div>
//             <div className="flex gap-3 max-md:w-full max-md:flex-col">
//               <div className="flex flex-col gap-2">
//                 <label className="font-bold text-sm">Fecha de carga</label>
//                 <input
//                   onChange={(e) => setFechaCarga(e.target.value)}
//                   value={fecha_carga}
//                   type="date"
//                   className="border border-gray-300 py-2 px-2 rounded-md font-medium text-sm outline-none"
//                 />
//               </div>
//               <div className="flex flex-col gap-2">
//                 <label className="font-bold text-sm">Fecha de entrega</label>
//                 <input
//                   onChange={(e) => setFechaEntrega(e.target.value)}
//                   value={fecha_entrega}
//                   type="date"
//                   className="border border-gray-300 py-2 px-2 rounded-md font-medium text-sm outline-none"
//                 />
//               </div>
//             </div>
//           </article>

//           <article className="flex flex-col items-start gap-5">
//             <div className="flex flex-col gap-2 items-start">
//               <div>
//                 <h3 className="font-bold text-lg text-slate-700 max-md:text-sm">
//                   Totales del viaje.
//                 </h3>
//               </div>
//               <div className="flex gap-5 ">
//                 <div className="flex gap-2 items-center border border-gray-300 rounded-md py-2 px-3">
//                   <p className="text-gray-900 font-medium max-md:text-sm">
//                     Total en fletes
//                   </p>
//                   <p className="font-bold text-slate-700 max-md:text-sm">
//                     {Number(totalSuma).toLocaleString("es-AR", {
//                       style: "currency",
//                       currency: "ARS",
//                       minimumIntegerDigits: 2,
//                     })}
//                   </p>
//                 </div>
//                 <div className="flex gap-2 items-center border border-gray-300 rounded-md py-2 px-3">
//                   <p className="text-gray-900 font-medium max-md:text-sm">
//                     Total en metros cuadrados
//                   </p>
//                   <p className="font-bold text-slate-700 max-md:text-sm">
//                     {Number(totalSumaMetros).toFixed(2)} Mtrs.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-5 items-start justify-start gap-5 max-md:w-full max-md:grid-cols-1">
//               <div className="flex flex-col gap-2">
//                 <label className="font-bold text-sm">KM Lineal</label>
//                 <input
//                   value={km_lineal}
//                   onChange={(e) => setKmLineal(e.target.value)}
//                   onBlur={() => {
//                     setIsEditable(false);
//                   }}
//                   type="text"
//                   className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
//                 />
//               </div>

//               <div className="cursor-pointer" onClick={handleInputClick}>
//                 {isEditable ? (
//                   <div className="flex flex-col gap-2">
//                     <label className="font-bold text-sm">
//                       {" "}
//                       Pago fletero + espera
//                     </label>
//                     <input
//                       onChange={(e) => setPagoFletero(e.target.value)}
//                       value={pago_fletero_espera}
//                       onBlur={() => {
//                         setIsEditable(false);
//                       }}
//                       type="text"
//                       className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
//                     />
//                   </div>
//                 ) : (
//                   <div className="flex flex-col gap-2">
//                     <label className="font-bold text-sm">
//                       {" "}
//                       Pago fletero + espera
//                     </label>

//                     <p className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto">
//                       {formatearDinero(Number(pago_fletero_espera) || 0)}
//                     </p>
//                   </div>
//                 )}
//               </div>

//               <div className="cursor-pointer" onClick={handleInputClick}>
//                 {isEditable ? (
//                   <div className="flex flex-col gap-2">
//                     <label className="font-bold text-sm">
//                       {" "}
//                       Total en viaticos
//                     </label>
//                     <input
//                       onChange={(e) => setViaticos(e.target.value)}
//                       value={viaticos}
//                       onBlur={() => {
//                         setIsEditable(false);
//                       }}
//                       type="text"
//                       className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
//                     />
//                   </div>
//                 ) : (
//                   <div className="flex flex-col gap-2">
//                     <label className="font-bold text-sm">
//                       {" "}
//                       Total en viaticos
//                     </label>

//                     <p className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto">
//                       {formatearDinero(Number(viaticos) || 0)}
//                     </p>
//                   </div>
//                 )}
//               </div>

//               <div className="cursor-pointer" onClick={handleInputClick}>
//                 {isEditable ? (
//                   <div className="flex flex-col gap-2">
//                     <label className="font-bold text-sm"> Total Auto</label>
//                     <input
//                       onChange={(e) => setAuto(e.target.value)}
//                       value={auto}
//                       onBlur={() => {
//                         setIsEditable(false);
//                       }}
//                       type="text"
//                       className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
//                     />
//                   </div>
//                 ) : (
//                   <div className="flex flex-col gap-2">
//                     <label className="font-bold text-sm"> Total Auto</label>

//                     <p className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto">
//                       {formatearDinero(Number(auto) || 0)}
//                     </p>
//                   </div>
//                 )}
//               </div>

//               <div className="cursor-pointer" onClick={handleInputClick}>
//                 {isEditable ? (
//                   <div className="flex flex-col gap-2">
//                     <label className="font-bold text-sm"> Total refuerzo</label>
//                     <input
//                       onChange={(e) => setRefuerzo(e.target.value)}
//                       value={refuerzo}
//                       onBlur={() => {
//                         setIsEditable(false);
//                       }}
//                       type="text"
//                       className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
//                     />
//                   </div>
//                 ) : (
//                   <div className="flex flex-col gap-2">
//                     <label className="font-bold text-sm"> Total refuerzo</label>

//                     <p className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto">
//                       {formatearDinero(Number(refuerzo) || 0)}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="flex">
//               <div className="flex max-md:flex-col max-md:w-full max-md:gap-1 max-md:py-1 max-md:items-start gap-3 bg-white border border-gray-300 rounded-md py-2 px-4 mt-5 items-center">
//                 <span className="font-bold text-slate-700">Remunerado</span>

//                 <p
//                   className={
//                     totalSuma -
//                       pago_fletero_espera -
//                       viaticos -
//                       auto -
//                       refuerzo <
//                     0
//                       ? "text-red-600 font-bold"
//                       : "text-blue-500 font-bold"
//                   }
//                 >
//                   {Number(
//                     totalSuma - pago_fletero_espera - viaticos - auto - refuerzo
//                   ).toLocaleString("es-AR", {
//                     style: "currency",
//                     currency: "ARS",
//                     minimumIntegerDigits: 2,
//                   })}
//                 </p>
//               </div>
//             </div>
//           </article>

//           <div>
//             <button
//               type="submit"
//               className="py-1.5 px-6 bg-primary hover:shadow-md text-white transition-all rounded-md font-semibold text-sm"
//             >
//               Cargar nueva orden legal
//             </button>
//           </div>
//         </form>

//         <ModalCrearClienteRemuneracion
//           datosCliente={datosCliente}
//           setDatosCliente={setDatosCliente}
//         />
//         <ModalEditarClienteRemuneracion
//           datosCliente={datosCliente}
//           setDatosCliente={setDatosCliente}
//           usuario={usuario}
//         />
//       </div>
//     </dialog>
//   );
// };

export const ModalActualizarRemuneracion = ({ obtenerID }) => {
  //useContext
  const { setLegalesReal } = useLegalesContext();
  const { setCaja } = useRemuneracionContext();

  const { choferes, setChoferes } = useSalidasContext();

  //daots del cliente
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

  //obtenerDatoUnico
  useEffect(() => {
    async function loadData() {
      const res = await client.get(`/legales/${obtenerID}`);

      const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      setChofer(res.data.chofer);
      setArmador(res.data.armador);
      setFechaCarga(formatDate(res.data.fecha_carga));
      setFechaEntrega(formatDate(res.data.fecha_entrega));
      setKmLineal(res.data.km_lineal);
      setPagoFletero(res.data.pago_fletero_espera);
      setViaticos(res.data.viaticos);
      setRefuerzo(res.data.refuerzo);
      setAuto(res.data.auto);
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

  // Utilizar reduce para calcular la suma total de la propiedad totalFlete
  const totalSuma = datosCliente.reduce((acumulador, elemento) => {
    // Convertir la propiedad totalFlete a número y sumarla al acumulador
    return acumulador + parseFloat(elemento.totalFlete);
  }, 0); // Iniciar el acumulador en 0

  const totalSumaMetros = datosCliente.reduce((acumulador, elemento) => {
    // Convertir la propiedad totalFlete a número y sumarla al acumulador
    return acumulador + parseFloat(elemento.metrosCuadrados);
  }, 0); // Iniciar el acumulador en 0

  //estados del formulario
  const [chofer, setChofer] = useState("");
  const [armador, setArmador] = useState("");
  const [fecha_carga, setFechaCarga] = useState("");
  const [fecha_entrega, setFechaEntrega] = useState("");
  const [km_lineal, setKmLineal] = useState("");
  const [pago_fletero_espera, setPagoFletero] = useState("");
  const [viaticos, setViaticos] = useState("");
  const [refuerzo, setRefuerzo] = useState("");
  const [auto, setAuto] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_URL, {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("editar-legal", (nuevaSalida) => {
      setLegalesReal(nuevaSalida.legales);
      setCaja(nuevaSalida.caja);
    });

    return () => newSocket.close();
  }, [obtenerID]);

  const onSubmit = async (e) => {
    e.preventDefault();

    const recaudacion =
      Number(totalSuma) -
      Number(pago_fletero_espera) -
      Number(viaticos) -
      Number(auto) -
      Number(refuerzo);

    const editarSalidas = {
      armador,
      fecha_carga,
      fecha_entrega,
      pago_fletero_espera,
      km_lineal,
      viaticos,
      auto,
      refuerzo,
      recaudacion,
      chofer,
      datos_cliente: { datosCliente },
    };

    try {
      const res = await client.put(`/legales/${obtenerID}`, editarSalidas);

      socket.emit("editar-legal", res.data);

      showSuccessToast("Actualizado correctamente");

      document.getElementById("my_modal_actualizar_remuneracion").close();
    } catch (error) {
      console.log(error);
    }
  };

  const [usuario, setUsuario] = useState("");

  const handleUsuario = (usuario) => setUsuario(usuario);

  const [isEditable, setIsEditable] = useState(false);

  const handleInputClick = () => {
    setIsEditable(true);
  };

  const [error, setError] = useState([]);

  const [nuevoCliente, setNuevoCliente] = useState({
    cliente: "",
    numeroContrato: "",
    localidad: "",
    metrosCuadrados: "",
    totalFlete: "",
  });

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;

    // Update existing client data for inline editing
    if (index !== undefined) {
      const updatedClientes = [...datosCliente];
      updatedClientes[index][name] = value;
      setDatosCliente(updatedClientes);
    } else {
      // Update new client data
      setNuevoCliente({ ...nuevoCliente, [name]: value });
    }
  };

  const handleAddClient = () => {
    // Validate numeric fields
    if (
      isNaN(Number(nuevoCliente.metrosCuadrados)) ||
      isNaN(Number(nuevoCliente.totalFlete))
    ) {
      setError(
        "Los campos 'Metros Cuadrados' y 'Total de Flete' deben ser numéricos."
      );
      return;
    }

    const clientWithNumbers = {
      ...nuevoCliente,
      metrosCuadrados: Number(nuevoCliente.metrosCuadrados),
      totalFlete: Number(nuevoCliente.totalFlete),
    };

    // Add new client to the list
    setDatosCliente([...datosCliente, clientWithNumbers]);
    setNuevoCliente({
      cliente: "",
      numeroContrato: "",
      localidad: "",
      metrosCuadrados: "",
      totalFlete: "",
    });
    setError(""); // Clear error message
  };

  const [isEditableMetros, setIsEditableMetros] = useState(false);

  const handleInputClickMetros = () => {
    setIsEditableMetros(true);
  };

  return (
    <dialog id="my_modal_actualizar_remuneracion" className="modal">
      <div className="modal-box rounded-md max-w-full h-full scroll-bar max-md:w-full max-md:max-h-full max-md:rounded-none">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-xl">
          Actualizar la orden, perdida legal.
        </h3>
        <p className="py-0.5 text-sm font-medium">
          En esta ventana podras actualizar la orden legal, perdida de los
          clientes, fletes ,etc.
        </p>

        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-5 max-md:py-2 max-md:px-2 max-md:border-none max-md:shadow-none mt-5"
        >
          <article className="flex flex-col gap-2">
            <div>
              <h3 className="font-bold text-lg">Ingresar datos.</h3>
            </div>
            {/* datos del formulario  */}
            <div className="flex flex-col items-start gap-6">
              <div className="grid grid-cols-3 gap-2 max-md:w-full max-md:grid-cols-1 max-md:gap-5">
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm">
                    Seleccionar Transportista
                  </label>
                  <select
                    onChange={(e) => setChofer(e.target.value)}
                    value={chofer}
                    type="text"
                    className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none"
                  >
                    <option value="">Seleccionar transportista</option>
                    {choferes.map((c) => (
                      <option key={c.id}>{c.chofer}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm">Armador</label>
                  <input
                    onChange={(e) => setArmador(e.target.value)}
                    value={armador}
                    type="text"
                    className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 items-start">
                <button
                  onClick={() =>
                    document
                      .getElementById("my_modal_crear_cliente_remuneracion")
                      .showModal()
                  }
                  type="button"
                  className="bg-gradient-to-r from-primary to-indigo-600 py-1 px-4 rounded-md text-white font-semibold text-sm outline-none flex gap-2 items-center"
                >
                  Cargar clientes por ventana
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
              </div>
            </div>
            <div className="max-w-full min-w-full w-full max-md:overflow-x-auto">
              <table className="table w-full max-w-full min-w-full">
                <thead className="text-gray-900 text-sm">
                  <tr>
                    <th>Cliente</th>
                    <th>Localidad</th>
                    <th>Total mtrs</th>
                    <th>Total del flete</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="uppercase text-xs">
                  {datosCliente.map((datos, index) => (
                    <tr key={index}>
                      <td className="flex flex-col gap-2">
                        <input
                          placeholder="Nombre y apellido"
                          type="text"
                          name="cliente"
                          value={datos.cliente}
                          onChange={(e) => handleInputChange(e, index)}
                          className="border rounded p-2 outline-none font-bold placeholder:font-normal uppercase"
                        />
                        <input
                          placeholder="Numero del contrato"
                          type="text"
                          name="numeroContrato"
                          value={datos.numeroContrato}
                          onChange={(e) => handleInputChange(e, index)}
                          className="border rounded p-2 outline-none font-bold placeholder:font-normal uppercase"
                        />
                      </td>
                      <td>
                        <input
                          placeholder="Localidad del cliente"
                          type="text"
                          name="localidad"
                          value={datos.localidad}
                          onChange={(e) => handleInputChange(e, index)}
                          className="border rounded p-2 outline-none font-bold placeholder:font-normal uppercase w-full"
                        />
                      </td>
                      <td>
                        <div
                          onClick={handleInputClickMetros}
                          className="cursor-pointer"
                        >
                          {isEditableMetros ? (
                            <input
                              placeholder="Total de metros cuadrados"
                              type="text"
                              name="metrosCuadrados"
                              value={datos.metrosCuadrados}
                              onChange={(e) => handleInputChange(e, index)}
                              onBlur={() => {
                                setIsEditableMetros(false);
                              }}
                              className="border rounded p-2 outline-none font-bold placeholder:font-normal uppercase w-full"
                            />
                          ) : (
                            <div>
                              <p className="border rounded p-2 outline-none font-bold placeholder:font-normal uppercase w-full">
                                {datos.metrosCuadrados} mtrs.
                              </p>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div
                          onClick={handleInputClickMetros}
                          className="cursor-pointer"
                        >
                          {isEditableMetros ? (
                            <input
                              placeholder="Total del flete"
                              type="text"
                              name="totalFlete"
                              value={datos.totalFlete}
                              onChange={(e) => handleInputChange(e, index)}
                              onBlur={() => {
                                setIsEditableMetros(false);
                              }}
                              className="border rounded p-2 outline-none font-bold placeholder:font-normal uppercase w-full"
                            />
                          ) : (
                            <div>
                              <p className="border rounded p-2 outline-none font-bold placeholder:font-normal uppercase w-full">
                                {formatearDinero(Number(datos.totalFlete))}
                              </p>
                            </div>
                          )}
                        </div>
                        {/* <input
                          placeholder="Total del flete"
                          type="text"
                          name="totalFlete"
                          value={datos.totalFlete}
                          onChange={(e) => handleInputChange(e, index)}
                          className="border rounded p-2 outline-none font-bold placeholder:font-normal uppercase w-full"
                        /> */}
                      </td>
                      <td>
                        <button
                          onClick={() => eliminarCliente(datos.cliente)}
                          className="bg-red-500 py-1.5 px-2 text-xs font-semibold text-center rounded-md text-white"
                        >
                          <MdDelete className="text-2xl" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    {/* <td className="flex flex-col gap-2">
                      <input
                        type="text"
                        name="cliente"
                        value={nuevoCliente.cliente}
                        onChange={(e) => handleInputChange(e)}
                        placeholder="Nuevo Cliente"
                        className="border rounded p-2 outline-none font-bold placeholder:font-normal uppercase"
                      />
                      <input
                        type="text"
                        name="numeroContrato"
                        value={nuevoCliente.numeroContrato}
                        onChange={(e) => handleInputChange(e)}
                        placeholder="Número de Contrato"
                        className="border rounded p-2 outline-none font-bold placeholder:font-normal uppercase"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="localidad"
                        value={nuevoCliente.localidad}
                        onChange={(e) => handleInputChange(e)}
                        placeholder="Localidad"
                        className="border rounded p-2 outline-none font-bold placeholder:font-normal uppercase w-full"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="metrosCuadrados"
                        value={nuevoCliente.metrosCuadrados}
                        onChange={(e) => handleInputChange(e)}
                        placeholder="Metros Cuadrados"
                        className="border rounded p-2 outline-none font-bold placeholder:font-normal uppercase w-full"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="totalFlete"
                        value={nuevoCliente.totalFlete}
                        onChange={(e) => handleInputChange(e)}
                        placeholder="Total del Flete"
                        className="border rounded p-2 outline-none font-bold placeholder:font-normal uppercase w-full"
                      />
                    </td> */}
                    <td>
                      <button
                        type="button"
                        onClick={handleAddClient}
                        className="bg-gradient-to-r from-blue-400 to-violet-600 py-1.5 px-4 rounded-full text-white font-semibold text-sm outline-none flex gap-2 items-center"
                      >
                        Agregar cliente{" "}
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
                    </td>
                  </tr>
                </tbody>
              </table>
              {error && <p className="text-red-500">{error}</p>}
            </div>
          </article>

          <article className="flex flex-col items-start gap-5">
            <div>
              <h3 className="font-bold text-lg text-slate-700 max-md:text-sm">
                Fechas de carga/entrega.
              </h3>
            </div>
            <div className="flex gap-3 max-md:w-full max-md:flex-col">
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">Fecha de carga</label>
                <input
                  onChange={(e) => setFechaCarga(e.target.value)}
                  value={fecha_carga}
                  type="date"
                  className="border border-gray-300 py-2 px-2 rounded-md font-medium text-sm outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">Fecha de entrega</label>
                <input
                  onChange={(e) => setFechaEntrega(e.target.value)}
                  value={fecha_entrega}
                  type="date"
                  className="border border-gray-300 py-2 px-2 rounded-md font-medium text-sm outline-none"
                />
              </div>
            </div>
          </article>

          <article className="flex flex-col items-start gap-5">
            <div className="flex flex-col gap-2 items-start">
              <div>
                <h3 className="font-bold text-lg text-slate-700 max-md:text-sm">
                  Totales del viaje.
                </h3>
              </div>
              <div className="flex gap-5 ">
                <div className="flex gap-2 items-center border border-gray-300 rounded-md py-2 px-3">
                  <p className="text-gray-900 font-medium max-md:text-sm">
                    Total en fletes
                  </p>
                  <p className="font-bold text-slate-700 max-md:text-sm">
                    {Number(totalSuma).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      minimumIntegerDigits: 2,
                    })}
                  </p>
                </div>
                <div className="flex gap-2 items-center border border-gray-300 rounded-md py-2 px-3">
                  <p className="text-gray-900 font-medium max-md:text-sm">
                    Total en metros cuadrados
                  </p>
                  <p className="font-bold text-slate-700 max-md:text-sm">
                    {Number(totalSumaMetros).toFixed(2)} Mtrs.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-5 items-start justify-start gap-5 max-md:w-full max-md:grid-cols-1">
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">KM Lineal</label>
                <input
                  value={km_lineal || 0}
                  onChange={(e) => setKmLineal(e.target.value)}
                  onBlur={() => {
                    setIsEditable(false);
                  }}
                  type="text"
                  className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
                />
              </div>

              <div className="cursor-pointer" onClick={handleInputClick}>
                {isEditable ? (
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm">
                      {" "}
                      Pago fletero + espera
                    </label>
                    <input
                      onChange={(e) => setPagoFletero(e.target.value)}
                      value={pago_fletero_espera || 0}
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
                      {" "}
                      Pago fletero + espera
                    </label>

                    <p className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto">
                      {formatearDinero(Number(pago_fletero_espera) || 0)}
                    </p>
                  </div>
                )}
              </div>

              <div className="cursor-pointer" onClick={handleInputClick}>
                {isEditable ? (
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm">
                      {" "}
                      Total en viaticos
                    </label>
                    <input
                      onChange={(e) => setViaticos(e.target.value)}
                      value={viaticos || 0}
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
                      {" "}
                      Total en viaticos
                    </label>

                    <p className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto">
                      {formatearDinero(Number(viaticos) || 0)}
                    </p>
                  </div>
                )}
              </div>

              <div className="cursor-pointer" onClick={handleInputClick}>
                {isEditable ? (
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm"> Total Auto</label>
                    <input
                      onChange={(e) => setAuto(e.target.value)}
                      value={auto || 0}
                      onBlur={() => {
                        setIsEditable(false);
                      }}
                      type="text"
                      className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm"> Total Auto</label>

                    <p className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto">
                      {formatearDinero(Number(auto) || 0)}
                    </p>
                  </div>
                )}
              </div>

              <div className="cursor-pointer" onClick={handleInputClick}>
                {isEditable ? (
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm"> Total refuerzo</label>
                    <input
                      onChange={(e) => setRefuerzo(e.target.value)}
                      value={refuerzo || 0}
                      onBlur={() => {
                        setIsEditable(false);
                      }}
                      type="text"
                      className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm"> Total refuerzo</label>

                    <p className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto">
                      {formatearDinero(Number(refuerzo) || 0)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex">
              <div className="flex max-md:flex-col max-md:w-full max-md:gap-1 max-md:py-1 max-md:items-start gap-3 bg-white border border-gray-300 rounded-md py-2 px-4 mt-5 items-center">
                <span className="font-bold text-slate-700">Remunerado</span>

                <p
                  className={
                    totalSuma -
                      pago_fletero_espera -
                      viaticos -
                      auto -
                      refuerzo <
                    0
                      ? "text-red-600 font-bold"
                      : "text-blue-500 font-bold"
                  }
                >
                  {Number(
                    totalSuma - pago_fletero_espera - viaticos - auto - refuerzo
                  ).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumIntegerDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </article>

          <div>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-800 to-green-500 py-2 px-6 rounded-md text-white font-semibold text-sm outline-none"
            >
              Actualizar la orden legal
            </button>
          </div>
        </form>

        <ModalCrearClienteRemuneracion
          datosCliente={datosCliente}
          setDatosCliente={setDatosCliente}
        />
        <ModalEditarClienteRemuneracion
          datosCliente={datosCliente}
          setDatosCliente={setDatosCliente}
          usuario={usuario}
        />
      </div>
    </dialog>
  );
};

// export const ModalActualizarRemuneracion = ({ obtenerID }) => {
//   //useContext
//   const { setLegalesReal } = useLegalesContext();
//   const { setCaja } = useRemuneracionContext();

//   const { choferes, setChoferes } = useSalidasContext();

//   //daots del cliente
//   const [datosCliente, setDatosCliente] = useState([]);
//   // //eliminar cliente
//   const eliminarCliente = (nombreClienteAEliminar) => {
//     // Filtrar la lista de clientes para obtener una nueva lista sin el cliente a eliminar
//     const nuevaListaClientes = datosCliente.filter(
//       (cliente) => cliente.cliente !== nombreClienteAEliminar
//     );
//     // Actualizar el estado con la nueva lista de clientes
//     setDatosCliente(nuevaListaClientes);
//   };

//   //obtenerDatoUnico
//   useEffect(() => {
//     async function loadData() {
//       const res = await client.get(`/legales/${obtenerID}`);

//       const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, "0");
//         const day = String(date.getDate()).padStart(2, "0");
//         return `${year}-${month}-${day}`;
//       };

//       setChofer(res.data.chofer);
//       setArmador(res.data.armador);
//       setFechaCarga(formatDate(res.data.fecha_carga));
//       setFechaEntrega(formatDate(res.data.fecha_entrega));
//       setKmLineal(res.data.km_lineal);
//       setPagoFletero(res.data.pago_fletero_espera);
//       setViaticos(res.data.viaticos);
//       setRefuerzo(res.data.refuerzo);
//       setAuto(res.data.auto);
//       setDatosCliente(res.data.datos_cliente?.datosCliente);
//     }

//     loadData();
//   }, [obtenerID]);

//   //obtenerChoferes
//   useEffect(() => {
//     async function loadData() {
//       const res = await client.get("/chofer");

//       setChoferes(res.data);
//     }

//     loadData();
//   }, []);

//   // Utilizar reduce para calcular la suma total de la propiedad totalFlete
//   const totalSuma = datosCliente.reduce((acumulador, elemento) => {
//     // Convertir la propiedad totalFlete a número y sumarla al acumulador
//     return acumulador + parseFloat(elemento.totalFlete);
//   }, 0); // Iniciar el acumulador en 0

//   const totalSumaMetros = datosCliente.reduce((acumulador, elemento) => {
//     // Convertir la propiedad totalFlete a número y sumarla al acumulador
//     return acumulador + parseFloat(elemento.metrosCuadrados);
//   }, 0); // Iniciar el acumulador en 0

//   //estados del formulario
//   const [chofer, setChofer] = useState("");
//   const [armador, setArmador] = useState("");
//   const [fecha_carga, setFechaCarga] = useState("");
//   const [fecha_entrega, setFechaEntrega] = useState("");
//   const [km_lineal, setKmLineal] = useState("");
//   const [pago_fletero_espera, setPagoFletero] = useState("");
//   const [viaticos, setViaticos] = useState("");
//   const [refuerzo, setRefuerzo] = useState("");
//   const [auto, setAuto] = useState("");
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     const newSocket = io(import.meta.env.VITE_URL, {
//       withCredentials: true,
//     });

//     setSocket(newSocket);

//     newSocket.on("editar-legal", (nuevaSalida) => {
//       setLegalesReal(nuevaSalida.legales);
//       setCaja(nuevaSalida.caja);
//     });

//     return () => newSocket.close();
//   }, [obtenerID]);

//   const onSubmit = async (e) => {
//     e.preventDefault();

//     const recaudacion =
//       Number(totalSuma) -
//       Number(pago_fletero_espera) -
//       Number(viaticos) -
//       Number(auto) -
//       Number(refuerzo);

//     const editarSalidas = {
//       armador,
//       fecha_carga,
//       fecha_entrega,
//       pago_fletero_espera,
//       km_lineal,
//       viaticos,
//       auto,
//       refuerzo,
//       recaudacion,
//       chofer,
//       datos_cliente: { datosCliente },
//     };

//     try {
//       const res = await client.put(`/legales/${obtenerID}`, editarSalidas);

//       socket.emit("editar-legal", res.data);

//       showSuccessToast("Actualizado correctamente");

//       document.getElementById("my_modal_actualizar_remuneracion").close();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const [usuario, setUsuario] = useState("");

//   const handleUsuario = (usuario) => setUsuario(usuario);

//   const [isEditable, setIsEditable] = useState(false);

//   const handleInputClick = () => {
//     setIsEditable(true);
//   };

//   return (
//     <dialog id="my_modal_actualizar_remuneracion" className="modal">
//       <div className="modal-box rounded-md max-w-full h-full scroll-bar max-md:w-full max-md:max-h-full max-md:rounded-none">
//         <form method="dialog">
//           {/* if there is a button in form, it will close the modal */}
//           <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
//             ✕
//           </button>
//         </form>
//         <h3 className="font-bold text-xl">
//           Actualizar la orden, perdida legal.
//         </h3>
//         <p className="py-0.5 text-sm font-medium">
//           En esta ventana podras actualizar la orden legal, perdida de los
//           clientes, fletes ,etc.
//         </p>

//         <form
//           onSubmit={onSubmit}
//           className="flex flex-col gap-5 max-md:py-2 max-md:px-2 max-md:border-none max-md:shadow-none mt-5"
//         >
//           <article className="flex flex-col gap-2">
//             <div>
//               <h3 className="font-bold text-lg">Ingresar datos.</h3>
//             </div>
//             {/* datos del formulario  */}
//             <div className="flex flex-col items-start gap-6">
//               <div className="grid grid-cols-3 gap-2 max-md:w-full max-md:grid-cols-1 max-md:gap-5">
//                 <div className="flex flex-col gap-2">
//                   <label className="font-bold text-sm">
//                     Seleccionar Transportista
//                   </label>
//                   <select
//                     onChange={(e) => setChofer(e.target.value)}
//                     value={chofer}
//                     type="text"
//                     className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none"
//                   >
//                     <option value="">Seleccionar transportista</option>
//                     {choferes.map((c) => (
//                       <option key={c.id}>{c.chofer}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="flex flex-col gap-2">
//                   <label className="font-bold text-sm">Armador</label>
//                   <input
//                     onChange={(e) => setArmador(e.target.value)}
//                     value={armador}
//                     type="text"
//                     className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none"
//                   />
//                 </div>
//               </div>
//               <div className="flex flex-col gap-2 items-start">
//                 <button
//                   onClick={() =>
//                     document
//                       .getElementById("my_modal_crear_cliente_remuneracion")
//                       .showModal()
//                   }
//                   type="button"
//                   className="bg-primary text-white flex gap-2 items-center px-4 py-1 rounded-md text-sm font-semibold"
//                 >
//                   Crear Clientes
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth={1.5}
//                     stroke="currentColor"
//                     className="w-6 h-6"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
//                     />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//             <div className="max-w-full min-w-full w-full max-md:overflow-x-auto">
//               <table className="table w-full max-w-full min-w-full">
//                 <thead className="text-gray-900 text-sm">
//                   <tr>
//                     <th className="">Cliente</th>
//                     <th className="">Localidad</th>
//                     <th className="">Total mtrs</th>
//                     <th className="">Total del flete</th>
//                     <th className="">Acciones</th>
//                   </tr>
//                 </thead>

//                 <tbody className="uppercase text-xs">
//                   {datosCliente.map((datos) => (
//                     <tr key={datos.id}>
//                       <td>
//                         {datos.cliente} ({datos.numeroContrato})
//                       </td>
//                       <td>{datos.localidad}</td>
//                       <td>{datos.metrosCuadrados} Mts</td>
//                       <td className="font-bold">
//                         {Number(datos.totalFlete).toLocaleString("es-AR", {
//                           style: "currency",
//                           currency: "ARS",
//                           minimumIntegerDigits: 2,
//                         })}
//                       </td>
//                       <td>
//                         <div className="flex space-x-3">
//                           <button
//                             onClick={() => eliminarCliente(datos.cliente)}
//                             type="button"
//                             className="bg-red-100 py-1 px-3 text-xs font-semibold text-center rounded-md text-red-800"
//                           >
//                             Eliminar
//                           </button>
//                           <button
//                             type="button"
//                             onClick={() => {
//                               handleUsuario(datos.cliente),
//                                 document
//                                   .getElementById(
//                                     "my_modal_editar_cliente_remuneracion"
//                                   )
//                                   .showModal();
//                             }}
//                             className="bg-green-100 py-1 px-3 text-xs font-semibold text-center rounded-md text-green-700"
//                           >
//                             Editar
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </article>

//           <article className="flex flex-col items-start gap-5">
//             <div>
//               <h3 className="font-bold text-lg text-slate-700 max-md:text-sm">
//                 Fechas de carga/entrega.
//               </h3>
//             </div>
//             <div className="flex gap-3 max-md:w-full max-md:flex-col">
//               <div className="flex flex-col gap-2">
//                 <label className="font-bold text-sm">Fecha de carga</label>
//                 <input
//                   onChange={(e) => setFechaCarga(e.target.value)}
//                   value={fecha_carga}
//                   type="date"
//                   className="border border-gray-300 py-2 px-2 rounded-md font-medium text-sm outline-none"
//                 />
//               </div>
//               <div className="flex flex-col gap-2">
//                 <label className="font-bold text-sm">Fecha de entrega</label>
//                 <input
//                   onChange={(e) => setFechaEntrega(e.target.value)}
//                   value={fecha_entrega}
//                   type="date"
//                   className="border border-gray-300 py-2 px-2 rounded-md font-medium text-sm outline-none"
//                 />
//               </div>
//             </div>
//           </article>

//           <article className="flex flex-col items-start gap-5">
//             <div className="flex flex-col gap-2 items-start">
//               <div>
//                 <h3 className="font-bold text-lg text-slate-700 max-md:text-sm">
//                   Totales del viaje.
//                 </h3>
//               </div>
//               <div className="flex gap-5 ">
//                 <div className="flex gap-2 items-center border border-gray-300 rounded-md py-2 px-3">
//                   <p className="text-gray-900 font-medium max-md:text-sm">
//                     Total en fletes
//                   </p>
//                   <p className="font-bold text-slate-700 max-md:text-sm">
//                     {Number(totalSuma).toLocaleString("es-AR", {
//                       style: "currency",
//                       currency: "ARS",
//                       minimumIntegerDigits: 2,
//                     })}
//                   </p>
//                 </div>
//                 <div className="flex gap-2 items-center border border-gray-300 rounded-md py-2 px-3">
//                   <p className="text-gray-900 font-medium max-md:text-sm">
//                     Total en metros cuadrados
//                   </p>
//                   <p className="font-bold text-slate-700 max-md:text-sm">
//                     {Number(totalSumaMetros).toFixed(2)} Mtrs.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-5 items-start justify-start gap-5 max-md:w-full max-md:grid-cols-1">
//               <div className="flex flex-col gap-2">
//                 <label className="font-bold text-sm">KM Lineal</label>
//                 <input
//                   value={km_lineal || 0}
//                   onChange={(e) => setKmLineal(e.target.value)}
//                   onBlur={() => {
//                     setIsEditable(false);
//                   }}
//                   type="text"
//                   className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
//                 />
//               </div>

//               <div className="cursor-pointer" onClick={handleInputClick}>
//                 {isEditable ? (
//                   <div className="flex flex-col gap-2">
//                     <label className="font-bold text-sm">
//                       {" "}
//                       Pago fletero + espera
//                     </label>
//                     <input
//                       onChange={(e) => setPagoFletero(e.target.value)}
//                       value={pago_fletero_espera || 0}
//                       onBlur={() => {
//                         setIsEditable(false);
//                       }}
//                       type="text"
//                       className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
//                     />
//                   </div>
//                 ) : (
//                   <div className="flex flex-col gap-2">
//                     <label className="font-bold text-sm">
//                       {" "}
//                       Pago fletero + espera
//                     </label>

//                     <p className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto">
//                       {formatearDinero(Number(pago_fletero_espera) || 0)}
//                     </p>
//                   </div>
//                 )}
//               </div>

//               <div className="cursor-pointer" onClick={handleInputClick}>
//                 {isEditable ? (
//                   <div className="flex flex-col gap-2">
//                     <label className="font-bold text-sm">
//                       {" "}
//                       Total en viaticos
//                     </label>
//                     <input
//                       onChange={(e) => setViaticos(e.target.value)}
//                       value={viaticos || 0}
//                       onBlur={() => {
//                         setIsEditable(false);
//                       }}
//                       type="text"
//                       className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
//                     />
//                   </div>
//                 ) : (
//                   <div className="flex flex-col gap-2">
//                     <label className="font-bold text-sm">
//                       {" "}
//                       Total en viaticos
//                     </label>

//                     <p className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto">
//                       {formatearDinero(Number(viaticos) || 0)}
//                     </p>
//                   </div>
//                 )}
//               </div>

//               <div className="cursor-pointer" onClick={handleInputClick}>
//                 {isEditable ? (
//                   <div className="flex flex-col gap-2">
//                     <label className="font-bold text-sm"> Total Auto</label>
//                     <input
//                       onChange={(e) => setAuto(e.target.value)}
//                       value={auto || 0}
//                       onBlur={() => {
//                         setIsEditable(false);
//                       }}
//                       type="text"
//                       className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
//                     />
//                   </div>
//                 ) : (
//                   <div className="flex flex-col gap-2">
//                     <label className="font-bold text-sm"> Total Auto</label>

//                     <p className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto">
//                       {formatearDinero(Number(auto) || 0)}
//                     </p>
//                   </div>
//                 )}
//               </div>

//               <div className="cursor-pointer" onClick={handleInputClick}>
//                 {isEditable ? (
//                   <div className="flex flex-col gap-2">
//                     <label className="font-bold text-sm"> Total refuerzo</label>
//                     <input
//                       onChange={(e) => setRefuerzo(e.target.value)}
//                       value={refuerzo || 0}
//                       onBlur={() => {
//                         setIsEditable(false);
//                       }}
//                       type="text"
//                       className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
//                     />
//                   </div>
//                 ) : (
//                   <div className="flex flex-col gap-2">
//                     <label className="font-bold text-sm"> Total refuerzo</label>

//                     <p className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto">
//                       {formatearDinero(Number(refuerzo) || 0)}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="flex">
//               <div className="flex max-md:flex-col max-md:w-full max-md:gap-1 max-md:py-1 max-md:items-start gap-3 bg-white border border-gray-300 rounded-md py-2 px-4 mt-5 items-center">
//                 <span className="font-bold text-slate-700">Remunerado</span>

//                 <p
//                   className={
//                     totalSuma -
//                       pago_fletero_espera -
//                       viaticos -
//                       auto -
//                       refuerzo <
//                     0
//                       ? "text-red-600 font-bold"
//                       : "text-blue-500 font-bold"
//                   }
//                 >
//                   {Number(
//                     totalSuma - pago_fletero_espera - viaticos - auto - refuerzo
//                   ).toLocaleString("es-AR", {
//                     style: "currency",
//                     currency: "ARS",
//                     minimumIntegerDigits: 2,
//                   })}
//                 </p>
//               </div>
//             </div>
//           </article>

//           <div>
//             <button
//               type="submit"
//               className="py-1.5 px-6 bg-primary hover:shadow-md text-white transition-all rounded-md font-semibold text-sm"
//             >
//               Actualizar la orden legal
//             </button>
//           </div>
//         </form>

//         <ModalCrearClienteRemuneracion
//           datosCliente={datosCliente}
//           setDatosCliente={setDatosCliente}
//         />
//         <ModalEditarClienteRemuneracion
//           datosCliente={datosCliente}
//           setDatosCliente={setDatosCliente}
//           usuario={usuario}
//         />
//       </div>
//     </dialog>
//   );
// };

const ModalEliminar = ({ idObtenida }) => {
  const { handleSubmit } = useForm();

  const { setLegalesReal } = useLegalesContext();
  const { setCaja } = useRemuneracionContext();

  const onSubmit = async (formData) => {
    try {
      const ordenData = {
        datos: {
          ...formData,
        },
      };

      const res = await client.delete(`/legales/${idObtenida}`, ordenData);

      setLegalesReal(res.data.legales);
      setCaja(res.data.caja);

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
            Eliminar la orden legal cargada..
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
