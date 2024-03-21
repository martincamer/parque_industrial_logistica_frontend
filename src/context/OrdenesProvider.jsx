//imports
import { createContext, useContext, useEffect, useState } from "react";
import { obtenerOrdenMensual } from "../api/ordenes.api";

//context
export const OrdenesContext = createContext();

//use context
export const useOrdenesContext = () => {
  const context = useContext(OrdenesContext);
  if (!context) {
    throw new Error("Use Salidas Propvider");
  }
  return context;
};

//
export const OrdenesProvider = ({ children }) => {
  const [ordenesMensuales, setOrdenesMensuales] = useState([]);

  useEffect(() => {
    async function loadData() {
      const respuesta = await obtenerOrdenMensual();

      setOrdenesMensuales(respuesta.data);
    }

    loadData();
  }, []);

  return (
    <OrdenesContext.Provider value={{ ordenesMensuales, setOrdenesMensuales }}>
      {children}
    </OrdenesContext.Provider>
  );
};
