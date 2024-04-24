import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { Link, useLocation } from "react-router-dom";

export const SideBar = () => {
  const { signout } = useAuth();
  const [visible, setVisible] = useState(false);

  const menuRef = useRef(null); // Para referenciar el menú
  const sidebarAreaRef = useRef(null); // Para referenciar el área sensible al mouse

  const location = useLocation();

  const toggleSidebar = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Asegurarse de que las referencias no sean null
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        sidebarAreaRef.current && // Verificar si no es null
        !sidebarAreaRef.current.contains(event.target)
      ) {
        setVisible(false); // Cerrar menú si el clic es fuera de su área
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleMouseEnter = () => {
      setVisible(true);
    };

    const handleMouseLeave = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.relatedTarget) // Verificar si no es null
      ) {
        setVisible(false);
      }
    };

    if (sidebarAreaRef.current) {
      sidebarAreaRef.current.addEventListener("mouseenter", handleMouseEnter);
    }

    if (menuRef.current) {
      menuRef.current.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (sidebarAreaRef.current) {
        sidebarAreaRef.current.removeEventListener(
          "mouseenter",
          handleMouseEnter
        );
      }
      if (menuRef.current) {
        menuRef.current.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []); // Efectos dependientes de la referencia

  return (
    <>
      <div
        id="navbar" // ID para identificar el elemento
        className="fixed left-0 top-0 z-[1] p-1 px-4 max-md:px-4"
        onClick={() => toggleSidebar()}
      >
        <div
          ref={sidebarAreaRef} // Referencia para el área sensible al mouse
          className="fixed left-0 top-0 z-[100] h-full w-5 bg-transparent bg-white"
        ></div>
      </div>
      <div
        ref={menuRef}
        className={`${
          visible
            ? "translate-x-0 w-20 opacity-1"
            : "-translate-x-full w-[-100px] opacity-0"
        } fixed left-0 top-0 z-[100] bg-white h-full shadow-lg transition-transform duration-300 ease-in-out`}
      >
        <div className="flex  flex-col justify-between bg-white h-full max-h-full min-h-full">
          <div className="">
            <div>
              <div className="px-2">
                <ul className="space-y-1 flex flex-col pt-4">
                  <Link onClick={() => toggleSidebar()} to={"/"}>
                    <a
                      href="#"
                      className={`${
                        location.pathname === "/"
                          ? "bg-slate-100 text-black-500"
                          : "bg-white"
                      } group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-slate-200 hover:text-gray-700`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-8 h-8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                        />
                      </svg>

                      <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                        Inicio
                      </span>
                    </a>
                  </Link>

                  <Link to={"/salidas"} onClick={() => toggleSidebar()}>
                    <a
                      href="#"
                      className={`${
                        location.pathname === "/salidas"
                          ? "bg-slate-100 text-black-500"
                          : "bg-white"
                      } group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-slate-200 hover:text-gray-700`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-8 h-8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m-6 3.75 3 3m0 0 3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
                        />
                      </svg>

                      <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                        Salidas
                      </span>
                    </a>
                  </Link>
                  <Link to={"/remuneraciones"} onClick={() => toggleSidebar()}>
                    <a
                      href="#"
                      className={`${
                        location.pathname === "/remuneraciones"
                          ? "bg-slate-100 text-black-500"
                          : "bg-white"
                      } group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-slate-200 hover:text-gray-700`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-8 h-8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>

                      <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                        Remuneraciones
                      </span>
                    </a>
                  </Link>

                  <Link to={"/legales"} onClick={() => toggleSidebar()}>
                    <a
                      href="#"
                      className={`${
                        location.pathname === "/legales"
                          ? "bg-slate-100 text-black-500"
                          : "bg-white"
                      } group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-slate-200 hover:text-gray-700`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-8 h-8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z"
                        />
                      </svg>

                      <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible w-[200px] text-center">
                        Legales
                      </span>
                    </a>
                  </Link>

                  <Link to={"/rendiciones"} onClick={() => toggleSidebar()}>
                    <a
                      href="#"
                      className={`${
                        location.pathname === "/rendiciones"
                          ? "bg-slate-100 text-black-500"
                          : "bg-white"
                      } group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-slate-200 hover:text-gray-700`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-8 h-8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
                        />
                      </svg>

                      <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible w-[200px] text-center">
                        Rendiciones
                      </span>
                    </a>
                  </Link>

                  <Link to={"/estadistica"} onClick={() => toggleSidebar()}>
                    <a
                      href="#"
                      className={`${
                        location.pathname === "/estadistica"
                          ? "bg-slate-100 text-black-500"
                          : "bg-white"
                      } group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-slate-200 hover:text-gray-700`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-8 h-8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                        />
                      </svg>

                      <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible w-[200px] text-center">
                        Datos mensuales/estadisticas
                      </span>
                    </a>
                  </Link>
                </ul>
              </div>
            </div>
          </div>

          <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 bg-white p-2 ">
            <form action="#">
              <button
                //   type="submit"
                type="button"
                onClick={() => signout()}
                className="group relative flex w-full justify-center rounded-lg px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
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
                    d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                  />
                </svg>

                <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                  Salir de la aplicación
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
