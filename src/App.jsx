//import {}
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthProvider";
import { NotFound } from "./routes/pages/protected/NotFound";
import { Login } from "./routes/pages/Login";
import { Register } from "./routes/pages/Register";
import { Home } from "./routes/pages/protected/Home";
import { SideBar } from "./components/sidebar/Sidebar";
import { SalidasProvider } from "./context/SalidasProvider";
import { Salidas } from "./routes/pages/protected/Salidas";
import { NavbarStatick } from "./components/ui/NavbarStatick";
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
//import normales
import RutaProtegida from "./layouts/RutaProtejida";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.min.css";

function App() {
  const { isAuth } = useAuth();

  return (
    <>
      <BrowserRouter>
        <NavbarStatick />
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
                        <SideBar />
                        <main className="min-h-full max-h-full h-full">
                          <Outlet />
                        </main>
                      </LegalesProvider>
                    </OrdenesProvider>
                  </RemuneracionProvider>
                </SalidasProvider>
              }
            >
              <Route index path="/" element={<Home />} />
              <Route index path="/salidas" element={<Salidas />} />
              <Route
                index
                path="/remuneraciones"
                element={<Remuneraciones />}
              />
              <Route index path="/legales" element={<Legales />} />
              <Route
                index
                path="/salidas-registradas"
                element={<SalidasRegistradas />}
              />
              <Route index path="/transportes" element={<Transportes />} />
              <Route
                index
                path="/remuneraciones-registradas"
                element={<RemuneracionesRegistradas />}
              />
              <Route
                index
                path="/ordenes-registradas"
                element={<OrdenesRegistradas />}
              />
              <Route
                index
                path="/legales-registrados"
                element={<LegalesRegistrados />}
              />
              <Route index path="/crear-salida" element={<CrearSalida />} />
              <Route
                index
                path="/crear-remuneracion"
                element={<CrearRemuneracion />}
              />

              <Route index path="/crear-legal" element={<CrearLegales />} />

              <Route index path="/editar/:id" element={<EditarSalida />} />
              <Route
                index
                path="/editar-remuneracion/:id"
                element={<EditarRemuneracion />}
              />
              <Route
                index
                path="/editar-legales/:id"
                element={<EditarLegales />}
              />
              <Route index path="/resumen/:id" element={<ResumenView />} />
              <Route
                index
                path="/recaudacion/:id"
                element={<ResumenViewRecaudacion />}
              />
              <Route
                index
                path="/legales/:id"
                element={<ResumenViewLegales />}
              />
              <Route
                index
                path="/control-redencion-de-viajes/:id"
                element={<ViewPdf />}
              />
              <Route index path="/fletes/:id" element={<ViewPdfFletes />} />
              <Route
                index
                path="/remuneracion-pdf/:id"
                element={<ViewPdfRemuneracion />}
              />

              <Route
                index
                path="/viaticos-armadores/:id"
                element={<ViewPdfArmadores />}
              />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
