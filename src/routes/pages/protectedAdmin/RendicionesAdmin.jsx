import { useEffect, useState } from "react";
import { useRendicionesContext } from "../../../context/RendicionesProvider";
import { FaSearch } from "react-icons/fa";
import { formatearFecha } from "../../../helpers/formatearFecha";
import { formatearDinero } from "../../../helpers/FormatearDinero";
import { crearRendicion } from "../../../api/ingresos";
import { useAuth } from "../../../context/AuthProvider";
import io from "socket.io-client";
import {
  showSuccessToast,
  showSuccessToastError,
} from "../../../helpers/toast";
import client from "../../../api/axios";
import { useObtenerId } from "../../../helpers/obtenerId";
import { useForm } from "react-hook-form";
import { FaDeleteLeft } from "react-icons/fa6";

export const RendicionesAdmin = () => {
  const [rendiciones, setRendiciones] = useState([]);

  useEffect(() => {
    async function loadRendicionesAdmin() {
      const respuesta = await client.get("/rendiciones-admin");
      setRendiciones(respuesta.data);
    }

    loadRendicionesAdmin();
  }, []);

  const { user } = useAuth();

  const [searchTermCliente, setSearchTermCliente] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  // Obtener el primer día del mes actual
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // Convertir las fechas en formato YYYY-MM-DD para los inputs tipo date
  const fechaInicioPorDefecto = firstDayOfMonth.toISOString().split("T")[0];
  const fechaFinPorDefecto = lastDayOfMonth.toISOString().split("T")[0];

  const [fechaInicio, setFechaInicio] = useState(fechaInicioPorDefecto);
  const [fechaFin, setFechaFin] = useState(fechaFinPorDefecto);

  const uniqueUsers = Array.from(
    new Set(rendiciones.map((rendicion) => rendicion.localidad.toLowerCase()))
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

  let filteredData = rendiciones.filter((item) => {
    const matchesSearchTerm = item.armador
      .toLowerCase()
      .includes(searchTermCliente.toLowerCase());

    const matchesUser = selectedUser === "" || item.localidad.toLowerCase();

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
  filteredData?.sort((a, b) => {
    const fechaA = new Date(a.created_at);
    const fechaB = new Date(b.created_at);
    return fechaB - fechaA; // Ordena de mayor a menor (fecha más reciente primero)
  });

  // Filtrar pedidos del mes actual
  const currentMonth = new Date().getMonth() + 1;

  const filteredByMonth = rendiciones.filter((salida) => {
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
  const filteredByWeek = rendiciones.filter((salida) => {
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

  const totalCobroRendicionesFinal = filteredData.reduce(
    (total, item) => total + parseFloat(item.rendicion_final),
    0
  );

  const { handleObtenerId, idObtenida } = useObtenerId();

  return (
    <section className="w-full h-full min-h-screen max-h-full">
      <div className="bg-gray-100 py-10 px-10 flex justify-between items-center max-md:flex-col max-md:gap-3">
        <p className="font-bold text-gray-900 text-xl">
          Rendiciones cargadas por los usuarios, viaticos a favor, devuelto por
          armadores.
        </p>
      </div>

      <div className="flex gap-3 mx-5 justify-between mt-10 mb-2 max-md:mt-5">
        <div className="flex items-center gap-3 max-md:flex-col">
          <div className="flex gap-2 max-md:flex-col max-md:w-full">
            <div className="border border-gray-300 flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md">
              <input
                value={searchTermCliente}
                onChange={handleSearchClienteChange}
                type="text"
                className="outline-none font-medium w-full"
                placeholder="Buscar por armador.."
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

        <div className="max-md:hidden">
          <div className="dropdown dropdown-left dropdown-hover">
            <button className="font-bold text-sm bg-primary py-2 px-4 text-white rounded">
              Ver estadisticas de las rendiciones
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 mt-2 rounded-md bg-gray-800 w-[300px] mr-2"
            >
              <div className="py-5 px-5 grid grid-cols-1 gap-5 w-full max-md:grid-cols-1">
                <div className="flex flex-col gap-1 bg-white rounded-md py-3 px-3">
                  <p className="font-medium text-sm text-center text-gray-900">
                    Total en rendiciones del mes.
                  </p>
                  <p className="font-bold text-lg text-green text-center">
                    {totalCobroRendicionesFinal.toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </p>
                </div>
              </div>
            </ul>
          </div>
        </div>
      </div>

      {/* tabla de datos  */}
      <div className="max-md:overflow-x-auto mx-5 mt-10 max-md:mt-5 scrollbar-hidden">
        <table className="table">
          <thead className="text-left font-bold text-gray-900 text-sm">
            <tr>
              <th>Numero</th>
              <th>Detalle/clientes/etc</th>
              <th>Armador/Entrega </th>
              <th>Fecha de creación</th>
              <th>Monto de las rendiciones</th>
              <th>Usuario</th>
              <th>Fabrica usuario</th>
              <th>Localidad usuario</th>
            </tr>
          </thead>

          <tbody className="text-xs capitalize font-medium">
            {filteredData.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.detalle}</td>
                <td>{s.armador}</td>
                <td>{formatearFecha(s.created_at)}</td>
                <td className="">
                  <div className="flex">
                    <p className="bg-green-100/90 text-green-700 py-1 px-2 font-bold rounded-md">
                      {Number(s.rendicion_final).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        minimumIntegerDigits: 2,
                      })}
                    </p>
                  </div>
                </td>
                <td>{s.usuario}</td>
                <td>{s.sucursal}</td>
                <td>{s.localidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalCrearRendicion />
      <ModalEliminar idObtenida={idObtenida} />
    </section>
  );
};

export const ModalCrearRendicion = () => {
  const { setRendiciones } = useRendicionesContext();

  const [armador, setArmador] = useState("");
  const [detalle, setDetalle] = useState("");
  const [rendicion_final, setRendicion] = useState("");

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_URL, {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("crear-rendicion", (nuevaSalida) => {
      setRendiciones(nuevaSalida);
    });

    return () => newSocket.close();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await crearRendicion({
        armador,
        detalle,
        rendicion_final,
      });

      if (socket) {
        socket.emit("crear-rendicion", res.data);
      }

      showSuccessToast("Rendicion cargada correctamente");

      document.getElementById("my_modal_crear_rendicion").close();

      setArmador("");
      setDetalle("");
      setRendicion("");
    } catch (error) {
      console.log(error);
    }
  };

  const [isEditable, setIsEditable] = useState(false);

  const handleInputClick = (index) => {
    setIsEditable(true);
  };

  return (
    <dialog id="my_modal_crear_rendicion" className="modal">
      <div className="modal-box rounded-md">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <h3 className="font-bold text-xl">Crear nueva rendición</h3>
        <p className="py-0.5 text-sm font-medium">
          En esta ventana podras crear una nueva rendición para la caja.
        </p>

        <form
          onSubmit={onSubmit}
          className="py-5 flex flex-col gap-5 max-md:py-2 max-md:px-2 max-md:border-none max-md:shadow-none"
        >
          <article className="flex flex-col gap-4 max-md:gap-8">
            <div>
              <h3 className="font-bold text-base text-gray-800 max-md:text-sm">
                Ingresar datos de la rendición.
              </h3>
            </div>
            {/* datos del formulario  */}
            <div className="flex flex-col gap-6 max-md:gap-6">
              <div className="max-md:w-full">
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-sm">Armador</label>
                  <input
                    value={armador}
                    placeholder="Nombre y apellido del armador.."
                    onChange={(e) => setArmador(e.target.value)}
                    type="text"
                    className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto"
                  />
                </div>
              </div>
            </div>

            <div className="max-md:w-full">
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">
                  Detalle de la rendición..
                </label>
                <textarea
                  placeholder="Escribir detalles de la rendición..."
                  value={detalle}
                  onChange={(e) => setDetalle(e.target.value)}
                  className="border border-gray-300 py-2 px-2 rounded-md font-medium text-sm outline-none w-auto"
                />
              </div>
            </div>
          </article>

          <div onClick={handleInputClick}>
            {isEditable ? (
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">
                  Monto de la rendición
                </label>
                <input
                  onChange={(e) => setRendicion(e.target.value)}
                  value={rendicion_final}
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
                  Monto de la rendición
                </label>

                <p className="border border-gray-300 py-2 px-2 rounded-md font-medium capitalize text-sm outline-none w-auto">
                  {formatearDinero(Number(rendicion_final) || 0)}
                </p>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="py-1.5 px-6 bg-primary hover:shadow-md text-white transition-all rounded-md font-semibold text-sm flex gap-3s"
            >
              Crear nueva rendicion
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
                  d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

const ModalEliminar = ({ idObtenida }) => {
  const { handleSubmit } = useForm();

  const { setRendiciones } = useRendicionesContext();

  const onSubmit = async (formData) => {
    try {
      const ordenData = {
        datos: {
          ...formData,
        },
      };

      const res = await client.delete(`/rendiciones/${idObtenida}`, ordenData);

      setRendiciones(res.data);

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
            Eliminar la rendición cargada..
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
