import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { Link, useLocation } from "react-router-dom";

export const SideBar = () => {
  const [click, setClick] = useState(false);
  const { signout } = useAuth();

  const toggleSidebar = () => {
    setClick(!click);
  };

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const navbar = document.getElementById("navbar");
      if (navbar) {
        if (scrollY > 0) {
          navbar.style.opacity = "0.5"; // Cambiar la opacidad cuando se hace scroll
        } else {
          navbar.style.opacity = "1"; // Restaurar la opacidad cuando se encuentra en la parte superior
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div
        id="navbar" // ID para identificar el elemento
        className="fixed left-0 top-0 z-[1] p-1 px-4 max-md:px-4"
        onClick={() => toggleSidebar()}
      >
        <div className="py-4">
          <a
            onClick={() => toggleSidebar()}
            href="#"
            className="t group relative flex justify-center rounded bg-slate-200 px-2 py-1.5 text-black-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7 max-md:h-6 max-md:w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
              />
            </svg>

            <span className="invisible absolute start-full w-[120px] text-center top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
              Abrir Navegación
            </span>
          </a>
        </div>
      </div>
      <div
        className={`${
          !click
            ? "hidden max-h-full min-h-full h-full"
            : "block fixed z-[100] shadow-black/10 shadow-md h-full max-h-full min-h-full"
        } flex transition-all ease-in-out duration-300 z-50`}
      >
        <div className="flex w-16  max-md:w-14 flex-col justify-between border-e bg-white h-full max-h-full min-h-full">
          <div className="">
            <div className="border-t border-slate-300 ">
              <div className="px-2">
                <div className="py-4">
                  <a
                    onClick={() => toggleSidebar()}
                    href="#"
                    className="t group relative flex justify-center rounded bg-slate-200 px-2 py-1.5 text-black-500"
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
                        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>

                    <span className="invisible absolute start-full w-[120px] text-center top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                      Cerrar Navegacion
                    </span>
                  </a>
                </div>

                <ul className="space-y-1 flex flex-col border-t border-slate-300 pt-4 ">
                  <Link to={"/"} onClick={() => toggleSidebar()}>
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
                        className="w-6 h-6"
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
                        className="w-6 h-6"
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
                        className="w-6 h-6"
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
                        className="w-6 h-6"
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

                  <Link to={"/transportes"} onClick={() => toggleSidebar()}>
                    <a
                      href="#"
                      className={`${
                        location.pathname === "/transportes"
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
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                        />
                      </svg>

                      <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible w-[200px] text-center">
                        Orden de llegada transportes
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
