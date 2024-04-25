import { PDFViewer } from "@react-pdf/renderer";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { obtenerUnicaSalida } from "../../../api/ingresos";
import { ImprimirPdfFletes } from "../../../components/pdf/ImprirmirPdfFletes";

export const ViewPdfFletes = () => {
  const [unicaSalida, setUnicaSalida] = useState([]);

  const params = useParams();

  console.log(unicaSalida);
  useEffect(() => {
    async function loadData() {
      const respuesta = await obtenerUnicaSalida(params.id);

      setUnicaSalida(respuesta.data);
    }

    loadData();
  }, []);

  return (
    <PDFViewer style={{ width: "100%", height: "100vh", zIndex: "101" }}>
      <ImprimirPdfFletes unicaSalida={unicaSalida} />
    </PDFViewer>
  );
};
