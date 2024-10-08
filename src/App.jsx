import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthProvider";
import { NotFound } from "./routes/pages/protected/NotFound";
import { Login } from "./routes/pages/Login";
import { Register } from "./routes/pages/Register";
import { Home } from "./routes/pages/protected/Home";
import { SalidasProvider } from "./context/SalidasProvider";
import { Salidas } from "./routes/pages/protected/Salidas";
import { CrearSalida } from "./routes/pages/protected/CrearSalida";
import { ResumenView } from "./routes/pages/protected/ResumenView";
import { ViewPdf } from "./routes/pages/protected/ViewPdf";
import { EditarSalida } from "./routes/pages/protected/EditarSalida";
import { ViewPdfFletes } from "./routes/pages/protected/ViewPdfFletes";
import { ViewPdfArmadores } from "./routes/pages/protected/ViewPdfArmadores";
import { SalidasRegistradas } from "./routes/pages/protected/SalidasRegistradas";
import { Remuneraciones } from "./routes/pages/protected/Remuneraciones";
import { RemuneracionProvider } from "./context/RemuneracionesProvider";
import { CrearRemuneracion } from "./routes/pages/protected/CrearRemuneracion";
import { EditarRemuneracion } from "./routes/pages/protected/EditarRemuneracion";
import { ResumenViewRecaudacion } from "./routes/pages/protected/ResumenViewRecaudacion";
import { ViewPdfRemuneracion } from "./routes/pages/protected/ViewPdfRemuneracion";
import { RemuneracionesRegistradas } from "./routes/pages/protected/RemuneracionesRegistradas";
import { Transportes } from "./routes/pages/protected/Transportes";
import { OrdenesProvider } from "./context/OrdenesProvider";
import { OrdenesRegistradas } from "./routes/pages/protected/OrdenesRegistradas";
import { Legales } from "./routes/pages/protected/Legales";
import { LegalesProvider } from "./context/LegalesProvider";
import { CrearLegales } from "./routes/pages/protected/CrearLegales";
import { EditarLegales } from "./routes/pages/protected/EditarLegales";
import { ResumenViewLegales } from "./routes/pages/protected/ResumenViewLegales";
import { LegalesRegistrados } from "./routes/pages/protected/LegalesRegistrados";
import { Rendicones } from "./routes/pages/protected/Rendiciones";
import { RendicionesProvider } from "./context/RendicionesProvider";
import { ResumenViewRendicion } from "./routes/pages/protected/ResumenViewRendicion";
import { RendicionesRegistradas } from "./routes/pages/protected/RendicionesRegistradas";
import { MenuMobile } from "./components/ui/MenuMobile";
import { HomeEstadistica } from "./routes/pages/protected/HomeEstadistica.jsx";
import { Cuentas } from "./routes/pages/protected/Cuentas.jsx";
import { Configuraciones } from "./routes/pages/protected/Configuraciones.jsx";
import { useEffect, useState } from "react";
import { PageRegistros } from "./routes/pages/protected/PageRegistros.jsx";
import { Contratos } from "./routes/pages/protected/Contratos.jsx";
import { Navbar } from "./components/ui/Navbar.jsx";
//import normales
import RutaProtegida from "./layouts/RutaProtejida";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.min.css";
//Import admin
import { HomeAdmin } from "./routes/pages/protectedAdmin/HomeAdmin.jsx";
import { SalidasAdmin } from "./routes/pages/protectedAdmin/SalidasAdmin.jsx";
import { RemuneracionesAdmin } from "./routes/pages/protectedAdmin/RemuneracionesAdmin.jsx";
import { LegalesAdmin } from "./routes/pages/protectedAdmin/LegalesAdmin.jsx";
import { ContratosAdmin } from "./routes/pages/protectedAdmin/ContratosAdmin.jsx";
import { RendicionesAdmin } from "./routes/pages/protectedAdmin/RendicionesAdmin.jsx";
import { CajaLogistica } from "./routes/pages/protected/CajaLogistica.jsx";
import { Egresos } from "./routes/pages/protected/Egresos.jsx";
import { EgresosProvider } from "./context/EgresosProvider.jsx";
import { Ingresos } from "./routes/pages/protected/Ingresos.jsx";

function App() {
  const { isAuth, user } = useAuth();

  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  // Simula un tiempo de carga de 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Desactiva la pantalla de carga después de 5 segundos
    }, 3000);

    return () => clearTimeout(timer); // Limpia el temporizador cuando se desmonta
  }, []);

  if (isLoading) {
    // Muestra la pantalla de carga mientras se está cargando
    return <LoadingScreen />;
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            element={<RutaProtegida isAllowed={!isAuth} redirectTo={"/"} />}
          >
            <Route index path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route
            element={<RutaProtegida isAllowed={isAuth} redirectTo={"/login"} />}
          >
            <Route
              element={
                <SalidasProvider>
                  <RemuneracionProvider>
                    <OrdenesProvider>
                      <LegalesProvider>
                        <RendicionesProvider>
                          <EgresosProvider>
                            <main className="min-h-full max-h-full h-full flex flex-col">
                              <Navbar />
                              <MenuMobile />
                              <Outlet />
                            </main>
                          </EgresosProvider>
                        </RendicionesProvider>
                      </LegalesProvider>
                    </OrdenesProvider>
                  </RemuneracionProvider>
                </SalidasProvider>
              }
            >
              {user?.tipo === "admin" && (
                <>
                  <Route index path="/" element={<HomeAdmin />} />
                  <Route index path="/salidas" element={<SalidasAdmin />} />
                  <Route
                    path="/remuneraciones"
                    element={<RemuneracionesAdmin />}
                  />
                  <Route path="/legales" element={<LegalesAdmin />} />
                  <Route path="/contratos" element={<ContratosAdmin />} />
                  <Route path="/rendiciones" element={<RendicionesAdmin />} />
                </>
              )}
              {user?.tipo !== "admin" && (
                <>
                  <Route index path="/" element={<Home />} />
                  <Route path="/salidas" element={<Salidas />} />
                  <Route path="/registros" element={<PageRegistros />} />
                  <Route path="/remuneraciones" element={<Remuneraciones />} />
                  <Route path="/rendiciones" element={<Rendicones />} />
                  <Route path="/legales" element={<Legales />} />
                  <Route path="/contratos" element={<Contratos />} />
                  <Route path="/caja-logistica" element={<CajaLogistica />} />
                  <Route
                    path="/configuraciones"
                    element={<Configuraciones />}
                  />
                  <Route
                    path="/salidas-registradas"
                    element={<SalidasRegistradas />}
                  />
                  <Route path="/egresos" element={<Egresos />} />
                  <Route path="/ingresos" element={<Ingresos />} />
                  <Route index path="/transportes" element={<Transportes />} />
                  <Route
                    path="/remuneraciones-registradas"
                    element={<RemuneracionesRegistradas />}
                  />
                  <Route
                    path="/rendiciones-registradas"
                    element={<RendicionesRegistradas />}
                  />
                  <Route
                    path="/ordenes-registradas"
                    element={<OrdenesRegistradas />}
                  />
                  <Route
                    path="/legales-registrados"
                    element={<LegalesRegistrados />}
                  />
                  <Route path="/crear-salida" element={<CrearSalida />} />
                  <Route
                    path="/crear-remuneracion"
                    element={<CrearRemuneracion />}
                  />

                  <Route path="/crear-legal" element={<CrearLegales />} />

                  <Route path="/editar/:id" element={<EditarSalida />} />
                  <Route
                    path="/editar-remuneracion/:id"
                    element={<EditarRemuneracion />}
                  />
                  <Route
                    path="/editar-legales/:id"
                    element={<EditarLegales />}
                  />
                  <Route path="/resumen/:id" element={<ResumenView />} />
                  <Route
                    path="/recaudacion/:id"
                    element={<ResumenViewRecaudacion />}
                  />
                  <Route
                    path="/rendicion/:id"
                    element={<ResumenViewRendicion />}
                  />
                  <Route path="/legales/:id" element={<ResumenViewLegales />} />
                  <Route
                    path="/control-redencion-de-viajes/:id"
                    element={<ViewPdf />}
                  />
                  <Route path="/fletes/:id" element={<ViewPdfFletes />} />
                  <Route
                    path="/remuneracion-pdf/:id"
                    element={<ViewPdfRemuneracion />}
                  />
                  <Route
                    path="/viaticos-armadores/:id"
                    element={<ViewPdfArmadores />}
                  />

                  <Route path="/estadistica" element={<HomeEstadistica />} />

                  {user?.localidad === "admin" && (
                    <Route path="/cuentas" element={<Cuentas />} />
                  )}
                </>
              )}
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

const LoadingScreen = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-primary border-b-transparent"></div>
        <p className="mt-4 text-lg font-bold text-gray-700">Cargando...</p>
      </div>
    </div>
  );
};
