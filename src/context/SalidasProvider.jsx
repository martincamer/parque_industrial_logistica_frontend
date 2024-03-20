//imports
import { createContext, useContext, useEffect, useState } from "react";
import { obtenerSalidaMensual, obtenerUnicaSalida } from "../api/ingresos";

//context
export const SalidasContext = createContext();

//use context
export const useSalidasContext = () => {
  const context = useContext(SalidasContext);
  if (!context) {
    throw new Error("Use Salidas Propvider");
  }
  return context;
};

//
export const SalidasProvider = ({ children }) => {
  const [salidasMensuales, setSalidasMensuales] = useState([]);
  const [choferes, setChoferes] = useState([]);

  useEffect(() => {
    async function loadData() {
      const respuesta = await obtenerSalidaMensual();

      setSalidasMensuales(respuesta.data);
    }

    loadData();
  }, []);

  return (
    <SalidasContext.Provider
      value={{ salidasMensuales, setSalidasMensuales, choferes, setChoferes }}
    >
      {children}
    </SalidasContext.Provider>
  );
};
