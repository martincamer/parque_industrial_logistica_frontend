import { Link } from "react-router-dom";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { useRendicionesContext } from "../../../context/RendicionesProvider";
import { ModalCrearRendicion } from "../../../components/Modales/ModalCrearRendicion";
import { ModalEliminarRendicion } from "../../../components/Modales/ModalEliminarRendicion";
import { ModalEditarRendiciones } from "../../../components/Modales/ModalEditarRendicion";
import { FaSearch } from "react-icons/fa";

export const Rendicones = () => {
  const { rendiciones } = useRendicionesContext();

  const [searchTermCliente, setSearchTermCliente] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  // Obtener lista de usuarios únicos
  const uniqueUsers = Array.from(
    new Set(
      rendiciones.map((remuneracion) => remuneracion.usuario.toLowerCase())
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

  let filteredData = rendiciones.filter((item) => {
    const matchesSearchTerm = item.armador
      .toLowerCase()
      .includes(searchTermCliente.toLowerCase());

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

  return (
    <section className="w-full h-full  max-w-full max-h-full min-h-screen">
      <ToastContainer />

      <div className="bg-white mb-4 h-10 flex">
        <Link
          to={"/"}
          className="bg-blue-100 flex h-full px-4 justify-center items-center font-bold text-blue-600"
        >
          Inicio
        </Link>{" "}
        <Link
          to={"/rendiciones"}
          className="bg-blue-500 flex h-full px-4 justify-center items-center font-bold text-white"
        >
          Rendiciones
        </Link>
      </div>
      <div className="mx-5 my-10 bg-white py-6 px-6">
        <p className="font-bold text-blue-500 text-xl">
          Crea tus rendiciones en esta sección y lleva el control de ellas.
        </p>
      </div>
      <div className="bg-white py-5 px-5 mx-5 my-10 flex gap-3">
        <div className="dropdown dropdown-bottom">
          <button className="font-bold text-sm bg-rose-400 py-2 px-4 text-white rounded">
            Ver estadisticas de las rendiciones
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 mt-2 bg-white w-[800px] border"
          >
            <div className="py-5 px-5 grid grid-cols-3 gap-5 w-full">
              <div className="flex flex-col gap-1 border border-blue-500 py-3 px-3">
                <p className="font-medium text-sm text-center">
                  Total en rendiciones del mes.
                </p>
                <p className="font-bold text-lg text-red-500 text-center">
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

      <div className="flex max-md:flex-col max-md:gap-2 max-md:items-start gap-5 mx-5 my-5 bg-white py-4 px-5">
        <Link
          onClick={() => openModal()}
          className="bg-orange-400 hover:bg-blue-500 transition-all flex py-1.5 px-4 rounded-full text-white font-semibold text-sm gap-2 items-center"
        >
          Crear nueva rendición
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
                Detalle/clientes/etc
              </th>
              <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                Armador/Entrega{" "}
              </th>
              <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                Fecha de creación
              </th>
              <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                Rendicion total
              </th>

              <th className="px-1 py-4  text-slate-800 font-bold uppercase">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
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
                  {s.detalle}
                </td>
                <td className="px-4 py-3 font-bold text-gray-900 uppercase">
                  {s.armador}
                </td>
                <td className="px-4 py-3 font-bold text-gray-900 uppercase">
                  {s.created_at.split("T")[0]}
                </td>
                <td
                  className={`px-4 py-3 font-bold text-${
                    s.rendicion_final >= 0 ? "blue" : "red"
                  }-500 uppercase`}
                >
                  {Number(s.rendicion_final).toLocaleString("es-AR", {
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
                      className="font-bold text-xs dropdown-content z-[1] menu p-2 shadow-md border-[1px] border-slate-200 bg-base-100 rounded-box w-52"
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
                      {/* <li>
                        <Link className="capitalize" to={`/rendicion/${s.id}`}>
                          Ver la rendición
                        </Link>
                      </li> */}
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalCrearRendicion isOpen={isOpenModal} closeModal={closeModal} />

      <ModalEliminarRendicion
        closeEliminar={closeEliminar}
        eliminarModal={eliminarModal}
        obtenerId={obtenerId}
      />

      <ModalEditarRendiciones
        obtenerID={obtenerID}
        isOpen={isOpenModalEditar}
        closeModal={closeModalDos}
      />
    </section>
  );
};
