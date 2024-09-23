import {
  Document,
  Text,
  View,
  StyleSheet,
  Page,
  Image,
  Font,
} from "@react-pdf/renderer";
import logo from "../../../public/logo.png";
import normal from "../../fonts/Montserrat-Light.ttf";
import semibold from "../../fonts/Montserrat-SemiBold.ttf";
import bold from "../../fonts/Montserrat-Bold.ttf";
import React from "react";
import { formatearDinero } from "../../helpers/FormatearDinero";

Font.register({
  family: "Montserrat",
  fonts: [
    {
      src: normal,
    },
    {
      src: semibold,
      fontWeight: "semibold",
    },
    {
      src: bold,
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  container: {
    padding: "10px 30px",
  },
  section: {
    marginBottom: 10,
    borderBottom: "1px solid black",
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    fontFamily: "Montserrat",
  },
  titleTotal: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
    fontFamily: "Montserrat",
    borderBottom: "1px solid black",
  },
  subtitle: {
    fontSize: 11,
    fontWeight: "semibold",
    color: "#007BFF",
    textTransform: "uppercase",
    fontFamily: "Montserrat",
  },
  title_paragraph: {
    fontSize: 11,
    fontWeight: "semibold",
    textTransform: "uppercase",
    fontFamily: "Montserrat",
    display: "flex",
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  totalRow: {
    marginTop: 15,
    paddingTop: 10,
  },
  totalText: {
    fontWeight: "semibold",
    fontFamily: "Montserrat",
    fontSize: 14,
    textTransform: "uppercase",
  },
  positive: {
    color: "green",
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
    fontFamily: "Montserrat",
  },
  negative: {
    color: "red",
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
    fontFamily: "Montserrat",
  },
  positiveTotal: {
    color: "green",
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
    fontFamily: "Montserrat",
    textTransform: "uppercase",
  },
  negativeTotal: {
    color: "red",
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
    fontFamily: "Montserrat",
    textTransform: "uppercase",
  },
  total: {
    fontWeight: "semibold",
    fontFamily: "Montserrat",
    fontSize: 14,
    textTransform: "uppercase",
  },
});

export const ImprimirContable = ({
  groupedData,
  totalFletes,
  totalFleteroEspera,
  totalViaticos,
  totalRefuerzos,
  totalRecaudacion,
  allClientes,
  totalMetrosCuadrados,
  fecha,
}) => {
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const year = fecha.split("-")[0]; // Extract the year
  const monthIndex = parseInt(fecha.split("-")[1], 10) - 1; // Extract the month index (0-based)
  return (
    <Document>
      <Page orientation="landscape" size="A4" style={styles.container}>
        <View
          style={{
            padding: "20px 20px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Image style={{ width: "100px" }} src={logo} />
          <Text style={styles.title}>
            {`${monthNames[monthIndex]} ${year}`}
          </Text>
        </View>
        {Object.keys(groupedData).map((fecha, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.title}>Fecha de entrega {fecha}</Text>
            {groupedData[fecha].map((item, idx) => (
              <View key={idx} style={styles.row}>
                <View>
                  <Text style={styles.subtitle}>Contrato</Text>
                  <View style={styles.title_paragraph}>
                    {" "}
                    {item.datos_cliente.datosCliente.map(
                      (cliente, clientIndex) => (
                        <Text key={clientIndex} className="uppercase">
                          {cliente.cliente} ({cliente.numeroContrato})
                        </Text>
                      )
                    )}
                  </View>
                </View>
                <View>
                  <Text style={styles.subtitle}>Total fletes</Text>
                  <View style={styles.title_paragraph}>
                    {item.datos_cliente.datosCliente.map(
                      (cliente, clientIndex) => (
                        <Text key={clientIndex} className="uppercase">
                          {formatearDinero(cliente.totalFlete)}
                        </Text>
                      )
                    )}
                  </View>
                </View>
                <View>
                  <Text style={styles.subtitle}>Pago a Fletero + Espera</Text>
                  <Text style={styles.title_paragraph}>
                    {formatearDinero(Number(item.pago_fletero_espera))}
                  </Text>
                </View>
                <View>
                  <Text style={styles.subtitle}>Viaticos</Text>
                  <Text style={styles.title_paragraph}>
                    {formatearDinero(Number(item.viaticos))}
                  </Text>
                </View>
                <View>
                  <Text style={styles.subtitle}>Refuerzo</Text>
                  <Text style={styles.title_paragraph}>
                    {formatearDinero(Number(item.refuerzo))}
                  </Text>
                </View>
                <View>
                  <Text style={styles.subtitle}>Recaudación</Text>
                  <Text
                    style={
                      item.recaudacion >= 0 ? styles.positive : styles.negative
                    }
                  >
                    {formatearDinero(Number(item.recaudacion))}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.totalRow}>
          <Text style={styles.titleTotal}>Totales Generales</Text>
          <View style={styles.row}>
            <Text style={styles.totalText}>Total Fletes</Text>
            <Text style={styles.total}>{formatearDinero(totalFletes)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.totalText}>Pago a Fletero + Espera</Text>
            <Text style={styles.total}>
              {formatearDinero(totalFleteroEspera)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.totalText}>Viáticos</Text>
            <Text style={styles.total}>{formatearDinero(totalViaticos)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.totalText}>Refuerzos</Text>
            <Text style={styles.total}>{formatearDinero(totalRefuerzos)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.totalText}>Recaudación</Text>
            <Text
              style={
                totalRecaudacion >= 0
                  ? styles.positiveTotal
                  : styles.negativeTotal
              }
            >
              {formatearDinero(totalRecaudacion)}
            </Text>
          </View>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.titleTotal}>Contratos y metros cuadrados</Text>
          <View style={styles.row}>
            <Text style={styles.totalText}>Total de contratos</Text>
            <Text style={styles.total}>{allClientes.length}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.totalText}>Total de metros cuadrados</Text>
            <Text style={styles.total}>
              {Number(totalMetrosCuadrados).toFixed(2)} mtrs.
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
