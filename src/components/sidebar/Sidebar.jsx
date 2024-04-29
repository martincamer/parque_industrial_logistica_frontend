import { useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { Link, useLocation } from "react-router-dom";
import { IoMenuOutline, IoCloseOutline } from "react-icons/io5";
import {
  CiAlignBottom,
  CiBag1,
  CiHome,
  CiMemoPad,
  CiMoneyBill,
  CiSettings,
  CiViewList,
} from "react-icons/ci";

export const SideBar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`${
        isOpen ? "w-64 opacity-1" : "w-16 opacity-1"
      } transition-all ease-linear flex flex-col bg-white min-h-[220vh] max-h-full h-full z-[100] border-r max-md:hidden`}
    >
      {/* Botón de menú */}
      <div
        className={`${
          isOpen ? "flex justify-between" : ""
        } transition-all ease-linear duration-300 py-3 px-4 border-b-[2px] border-slate-300`}
      >
        <button className="text-3xl text-orange-500" onClick={handleToggle}>
          {isOpen ? <IoCloseOutline /> : <IoMenuOutline />}
        </button>
        {isOpen && (
          <p className="bg-orange-500 py-1 px-2 rounded-xl text-sm text-white capitalize">
            {user?.username}
          </p>
        )}
      </div>
      {isOpen ? (
        <div className="w-full max-h-full min-h-full h-full flex flex-col gap-0">
          <Link
            to={"/"}
            className={`${
              location.pathname === "/" ? "bg-orange-100" : "bg-none"
            } hover:text-orange-700 text-slate-700 text-sm transition-all py-3 px-3`}
          >
            Inicio/estadistica/compras
          </Link>

          <Link
            to={"/salidas"}
            className={`${
              location.pathname === "/salidas" ? "bg-orange-100" : "bg-none"
            } hover:text-orange-700 text-slate-700 text-sm transition-all py-3 px-3`}
          >
            Crear nuevas salidas/ver/editar
          </Link>
          <Link
            to={"/remuneraciones"}
            className={`${
              location.pathname === "/remuneraciones"
                ? "bg-orange-100"
                : "bg-none"
            } hover:text-orange-700 text-slate-700 text-sm transition-all py-3 px-3`}
          >
            Crear nuevas remuneraciones/ver/editar
          </Link>
          <Link
            to={"/legales"}
            className={`${
              location.pathname === "/legales" ? "bg-orange-100" : "bg-none"
            } hover:text-orange-700 text-slate-700 text-sm transition-all py-3 px-3`}
          >
            Crear nuevas ordenes legales/ver/editar
          </Link>
          <Link
            to={"/rendiciones"}
            className={`${
              location.pathname === "/rendiciones" ? "bg-orange-100" : "bg-none"
            } hover:text-orange-700 text-slate-700 text-sm transition-all py-3 px-3`}
          >
            Crear nuevas rendiciones/editar/ver
          </Link>
          <Link
            to={"/estadistica"}
            className={`${
              location.pathname === "/estadistica" ? "bg-orange-100" : "bg-none"
            } hover:text-orange-700 text-slate-700 text-sm transition-all py-3 px-3`}
          >
            Filtrar estadisticas del mes
          </Link>
          {user.localidad === "admin" && (
            <Link
              to={"/cuentas"}
              className={`${
                location.pathname === "/cuentas" ? "bg-orange-100" : "bg-none"
              } hover:text-orange-700 text-slate-700 text-sm transition-all py-3 px-3`}
            >
              Crear cuentas/editar/administrar
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col justify-center">
          <div
            className={`${
              location.pathname === "/" ? "bg-orange-100" : "bg-none"
            } w-full text-center py-2 items-center transition-all`}
          >
            <div className="w-full text-center py-2 items-center transition-all ">
              <div
                className="tooltip tooltip-right"
                data-tip="INICIO/ESTADISTICAS/ETC"
              >
                <Link to={"/"}>
                  <CiHome className="text-3xl text-orange-700" />
                </Link>
              </div>
            </div>
          </div>

          <div
            className={`${
              location.pathname === "/salidas" ? "bg-orange-100" : "bg-none"
            } w-full text-center py-2 items-center transition-all`}
          >
            <div className="w-full text-center py-2 items-center transition-all ">
              <div
                className="tooltip tooltip-right"
                data-tip="SALIDAS/CREAR/EDITAR"
              >
                <Link to={"/salidas"}>
                  <CiViewList className="text-3xl text-orange-700" />
                </Link>
              </div>
            </div>
          </div>

          <div
            className={`${
              location.pathname === "/remuneraciones"
                ? "bg-orange-100"
                : "bg-none"
            } w-full text-center py-2 items-center transition-all`}
          >
            <div className="w-full text-center py-2 items-center transition-all ">
              <div
                className="tooltip tooltip-right"
                data-tip="CREAR REMUNERACIONES/VER/EDITAR"
              >
                <Link to={"/remuneraciones"}>
                  <CiMoneyBill className="text-3xl text-orange-700" />
                </Link>
              </div>
            </div>
          </div>

          <div
            className={`${
              location.pathname === "/legales" ? "bg-orange-100" : "bg-none"
            } w-full text-center py-2 items-center transition-all`}
          >
            <div className="w-full text-center py-2 items-center transition-all ">
              <div
                className="tooltip tooltip-right"
                data-tip="CREAR NUEVAS ORDENES LEGALES/EDITAR/VER"
              >
                <Link to={"/legales"}>
                  <CiMemoPad className="text-3xl text-orange-700" />
                </Link>
              </div>
            </div>
          </div>

          <div
            className={`${
              location.pathname === "/rendiciones" ? "bg-orange-100" : "bg-none"
            } w-full text-center py-2 items-center transition-all`}
          >
            <div className="w-full text-center py-2 items-center transition-all ">
              <div
                className="tooltip tooltip-right"
                data-tip="CREAR NUEVAS RENDICIONES EDITAR/VER"
              >
                <Link to={"/rendiciones"}>
                  <CiBag1 className="text-3xl text-orange-700" />
                </Link>
              </div>
            </div>
          </div>

          <div
            className={`${
              location.pathname === "/estadistica" ? "bg-orange-100" : "bg-none"
            } w-full text-center py-2 items-center transition-all`}
          >
            <div className="w-full text-center py-2 items-center transition-all ">
              <div
                className="tooltip tooltip-right"
                data-tip="FILTRAR ESTADISTICAS MESES"
              >
                <Link to={"/estadistica"}>
                  <CiAlignBottom className="text-3xl text-orange-700" />
                </Link>
              </div>
            </div>
          </div>

          {user.localidad === "admin" && (
            <div
              className={`${
                location.pathname === "/cuentas" ? "bg-orange-100" : "bg-none"
              } w-full text-center py-2 items-center transition-all`}
            >
              <div className="w-full text-center py-2 items-center transition-all ">
                <div
                  className="tooltip tooltip-right"
                  data-tip="REGISTRAR USUARIOS/EDITARLOS/ETC"
                >
                  <Link to={"/cuentas"}>
                    <CiSettings className="text-3xl text-orange-700" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
