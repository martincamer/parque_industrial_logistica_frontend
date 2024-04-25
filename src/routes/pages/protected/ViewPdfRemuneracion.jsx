import { PDFViewer } from "@react-pdf/renderer";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { obtenerUnicaRemuneracion } from "../../../api/ingresos";
import { ImprimirPdfRemuneracion } from "../../../components/pdf/ImprirmirPdfRemuneracion";

export const ViewPdfRemuneracion = () => {
  const [unicaSalida, setUnicaSalida] = useState([]);

  const params = useParams();

  console.log(unicaSalida);
  useEffect(() => {
    async function loadData() {
      const respuesta = await obtenerUnicaRemuneracion(params.id);

      setUnicaSalida(respuesta.data);
    }

    loadData();
  }, []);

  return (
    <PDFViewer style={{ width: "100%", height: "100vh", zIndex: "101" }}>
      <ImprimirPdfRemuneracion unicaSalida={unicaSalida} />
    </PDFViewer>
  );
};
