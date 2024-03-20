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
import moment from "moment";
import React from "react";

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

const styles = StyleSheet.create({});

// Obtener la fecha actual
const fechaActual = new Date();

// Obtener el día de la semana (0 para domingo, 1 para lunes, ..., 6 para sábado)
const diaDeLaSemana = fechaActual.getDay();

// Obtener el día del mes
const diaDelMes = fechaActual.getDate();

// Obtener el mes (0 para enero, 1 para febrero, ..., 11 para diciembre)
const mes = fechaActual.getMonth();

// Obtener el año
const ano = fechaActual.getFullYear();

// Días de la semana en español
const diasSemana = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];

// Meses en español
const meses = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

// Formatear la fecha
const fechaFormateada = `${diasSemana[diaDeLaSemana]} ${meses[mes]} / ${diaDelMes} / ${ano}`;

export const ImprimirPdfEmpleados = ({ empleados }) => {
  const totalFinalSum = empleados?.reduce((acumulador, empleado) => {
    // Convertir el valor de total_final a número y sumarlo al acumulador
    return acumulador + parseFloat(empleado?.total_final);
  }, 0);

  console.log(empleados);

  // Crear un conjunto para almacenar tipos de fábrica únicos
  const tiposFabricaUnicos = new Set(
    empleados.map((empleado) => empleado.tipo_fabrica)
  );

  // Convertir el conjunto a un array
  const tiposFabricaUnicosArray = Array.from(tiposFabricaUnicos);

  // Aplicar un mapeo a cada tipo de fábrica único
  //   const resultadoDelMap = tiposFabricaUnicosArray.map((tipoFabrica) => {
  //     // Aquí puedes realizar alguna operación o simplemente devolver el tipo de fábrica
  //     return `Tipo de fábrica único: ${tipoFabrica}`;
  //   });

  return (
    <Document>
      <Page
        style={{
          padding: "30x 50px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
        size="A4"
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Image
            style={{
              width: 100,
            }}
            src={logo}
          />
          <Text
            style={{
              textTransform: "capitalize",
              fontSize: "10px",
              fontFamily: "Montserrat",
              fontWeight: "light",
            }}
          >
            {fechaFormateada}
          </Text>
        </View>
        <View
          style={{
            border: "1px solid #000",
            borderRadius: "3px",
            padding: "10px 20px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "3px",
          }}
        >
          <Text
            style={{
              fontSize: "11px",
              fontWeight: "bold",
              fontFamily: "Montserrat",
            }}
          >
            Total empleados resumen
          </Text>

          <Text
            style={{
              fontSize: "10px",
              fontWeight: "normal",
              fontFamily: "Montserrat",
            }}
          >
            {Number(totalFinalSum).toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
          </Text>
        </View>

        <View
          style={{
            border: "1px solid #000",
            borderRadius: "3px",
            padding: "10px 20px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <Text
            style={{
              fontSize: "11px",
              fontWeight: "bold",
              fontFamily: "Montserrat",
            }}
          >
            Fabricas:
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "3px",
            }}
          >
            {tiposFabricaUnicosArray.map((tipoFabrica, index) => (
              <React.Fragment key={index}>
                <Text
                  style={{
                    fontSize: "10px",
                    fontWeight: "normal",
                    fontFamily: "Montserrat",
                    textTransform: "capitalize",
                  }}
                >
                  {tipoFabrica}
                  {index < tiposFabricaUnicosArray.length - 1 && <Text>,</Text>}
                </Text>
              </React.Fragment>
            ))}
          </View>
        </View>
        <View
          style={{
            border: "1px solid #000",
            borderRadius: "3px",
            padding: "10px 20px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: "11px",
              fontWeight: "bold",
              fontFamily: "Montserrat",
            }}
          >
            Total empleados
          </Text>
          <View style={{}}>
            <Text
              style={{
                fontSize: "10px",
                fontWeight: "bold",
                fontFamily: "Montserrat",
              }}
            >
              {empleados.length}
            </Text>
          </View>
        </View>

        <View
          style={{
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          <Text
            style={{
              fontSize: "10px",
              fontWeight: "bold",
              fontFamily: "Montserrat",
              borderBottom: "2px",
            }}
          >
            Empleados Resumen
          </Text>
        </View>

        <View>
          {tiposFabricaUnicosArray.map((tipoFabrica) => (
            <React.Fragment key={tipoFabrica}>
              <Text
                style={{
                  fontSize: "10px",
                  fontWeight: "bold",
                  fontFamily: "Montserrat",
                  textTransform: "capitalize",
                  marginBottom: "10px",
                  marginTop: "10px",
                }}
              >
                {tipoFabrica}
              </Text>
              {empleados
                .filter((empleado) => empleado.tipo_fabrica === tipoFabrica)
                .map((e) => (
                  <React.Fragment key={e.id}>
                    <View
                      style={{
                        borderStyle: "solid",
                        borderWidth: "1px",
                        borderColor: "#000",
                        borderRadius: "15px",
                        padding: "10px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        marginBottom: "10px",
                      }}
                    >
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: "8px",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: "8px",
                            fontWeight: "bold",
                            fontFamily: "Montserrat",
                          }}
                        >
                          Nombre y Apellido{"  "}
                          <Text
                            style={{
                              fontSize: "8px",
                              fontWeight: "normal",
                              textTransform: "capitalize",
                              fontFamily: "Montserrat",
                            }}
                          >
                            {e.empleado}
                          </Text>
                        </Text>
                        <Text
                          style={{
                            fontSize: "8px",
                            fontWeight: "bold",
                            fontFamily: "Montserrat",
                          }}
                        >
                          Antiguedad{"  "}
                          <Text
                            style={{
                              fontSize: "8px",
                              fontWeight: "normal",
                              textTransform: "capitalize",
                              fontFamily: "Montserrat",
                            }}
                          >
                            {e.antiguedad} años
                          </Text>
                        </Text>
                        <Text
                          style={{
                            fontSize: "8px",
                            fontWeight: "bold",
                            fontFamily: "Montserrat",
                          }}
                        >
                          Tipo de sueldo{"  "}
                          <Text
                            style={{
                              fontSize: "8px",
                              fontWeight: "normal",
                              textTransform: "capitalize",
                              fontFamily: "Montserrat",
                            }}
                          >
                            {e.tipo}
                          </Text>
                        </Text>
                        <Text
                          style={{
                            fontSize: "8px",
                            fontWeight: "bold",
                            fontFamily: "Montserrat",
                          }}
                        >
                          Sucursal{"  "}
                          <Text
                            style={{
                              fontSize: "8px",
                              fontWeight: "normal",
                              textTransform: "capitalize",
                              fontFamily: "Montserrat",
                            }}
                          >
                            {e.tipo_fabrica}
                          </Text>
                        </Text>
                      </View>

                      <Text
                        style={{
                          fontSize: "8px",
                          fontWeight: "bold",
                          fontFamily: "Montserrat",
                        }}
                      >
                        Premio Asistencia{"  "}
                        <Text
                          style={{
                            fontSize: "8px",
                            fontWeight: "normal",
                            textTransform: "capitalize",
                            fontFamily: "Montserrat",
                          }}
                        >
                          {Number(e.premio_asistencia).toLocaleString("es-AR", {
                            style: "currency",
                            currency: "ARS",
                          })}
                        </Text>
                      </Text>

                      <React.Fragment>
                        {e.tipo_fabrica !== "administracion" && (
                          <Text
                            style={{
                              fontSize: "8px",
                              fontWeight: "bold",
                              fontFamily: "Montserrat",
                            }}
                          >
                            Premio producción{" "}
                            <Text
                              style={{
                                fontSize: "8px",
                                fontWeight: "normal",
                                textTransform: "capitalize",
                                fontFamily: "Montserrat",
                              }}
                            >
                              {Number(e.premio_produccion).toLocaleString(
                                "es-AR",
                                {
                                  style: "currency",
                                  currency: "ARS",
                                }
                              )}
                            </Text>
                          </Text>
                        )}
                      </React.Fragment>

                      <React.Fragment>
                        {
                          <Text
                            style={{
                              fontSize: "8px",
                              fontWeight: "bold",
                              fontFamily: "Montserrat",
                            }}
                          >
                            Comida/Premio
                            <Text
                              style={{
                                fontSize: "8px",
                                fontWeight: "normal",
                                textTransform: "capitalize",
                                fontFamily: "Montserrat",
                              }}
                            >
                              {Number(e.comida_produccion).toLocaleString(
                                "es-AR",
                                {
                                  style: "currency",
                                  currency: "ARS",
                                }
                              )}
                            </Text>
                          </Text>
                        }
                      </React.Fragment>

                      <Text
                        style={{
                          fontSize: "8px",
                          fontWeight: "bold",
                          fontFamily: "Montserrat",
                        }}
                      >
                        Sin descuentos y premios quincena 5{"  "}
                        <Text
                          style={{
                            fontSize: "8px",
                            fontWeight: "normal",
                            textTransform: "capitalize",
                            fontFamily: "Montserrat",
                          }}
                        >
                          {Number(e.quincena_del_cinco).toLocaleString(
                            "es-AR",
                            {
                              style: "currency",
                              currency: "ARS",
                            }
                          )}
                        </Text>
                      </Text>

                      {e.tipo !== "mensual" && (
                        <Text
                          style={{
                            fontSize: "8px",
                            fontWeight: "bold",
                            fontFamily: "Montserrat",
                          }}
                        >
                          Sin descuentos y premios Quincena 20
                          <Text
                            style={{
                              fontSize: "8px",
                              fontWeight: "normal",
                              textTransform: "capitalize",
                              fontFamily: "Montserrat",
                            }}
                          >
                            {Number(e.total_quincena_veinte).toLocaleString(
                              "es-AR",
                              {
                                style: "currency",
                                currency: "ARS",
                              }
                            )}
                          </Text>
                        </Text>
                      )}

                      <Text
                        style={{
                          fontSize: "8px",
                          fontWeight: "bold",
                          fontFamily: "Montserrat",
                        }}
                      >
                        Total Antiguedad{"  "}
                        <Text
                          style={{
                            fontSize: "8px",
                            fontWeight: "normal",
                            textTransform: "capitalize",
                            fontFamily: "Montserrat",
                          }}
                        >
                          {Number(e.total_antiguedad).toLocaleString("es-AR", {
                            style: "currency",
                            currency: "ARS",
                          })}{" "}
                        </Text>
                      </Text>

                      <Text
                        style={{
                          fontSize: "8px",
                          fontWeight: "bold",
                          fontFamily: "Montserrat",
                        }}
                      >
                        Mes cobro dia 5{"  "}
                        <Text
                          style={{
                            fontSize: "8px",
                            fontWeight: "normal",
                            textTransform: "capitalize",
                            fontFamily: "Montserrat",
                          }}
                        >
                          {Number(e.total_quincena).toLocaleString("es-AR", {
                            style: "currency",
                            currency: "ARS",
                          })}
                        </Text>
                      </Text>

                      {e.tipo !== "mensual" && (
                        <Text
                          style={{
                            fontSize: "8px",
                            fontWeight: "bold",
                            fontFamily: "Montserrat",
                          }}
                        >
                          Mes cobro dia 20{"  "}
                          <Text
                            style={{
                              fontSize: "8px",
                              fontWeight: "normal",
                              textTransform: "capitalize",
                              fontFamily: "Montserrat",
                            }}
                          >
                            {Number(e.total_quincena_veinte).toLocaleString(
                              "es-AR",
                              {
                                style: "currency",
                                currency: "ARS",
                              }
                            )}
                          </Text>
                        </Text>
                      )}

                      <Text
                        style={{
                          fontSize: "8px",
                          fontWeight: "bold",
                          fontFamily: "Montserrat",
                        }}
                      >
                        Descuento{"  "}
                        <Text
                          style={{
                            fontSize: "8px",
                            fontWeight: "normal",
                            textTransform: "capitalize",
                            fontFamily: "Montserrat",
                          }}
                        >
                          {Number(e.descuento).toLocaleString("es-AR", {
                            style: "currency",
                            currency: "ARS",
                          })}
                        </Text>
                      </Text>

                      {/* <Text
                          style={{
                            fontSize: "8px",
                            fontWeight: "bold",
                            fontFamily: "Montserrat",
                          }}
                        >
                          Obs{"  "}
                          <Text
                            style={{
                              fontSize: "8px",
                              fontWeight: "normal",
                              textTransform: "capitalize",
                              fontFamily: "Montserrat",
                            }}
                          >
                            {e.obs}
                          </Text>
                        </Text> */}
                      <Text
                        style={{
                          fontSize: "8px",
                          fontWeight: "bold",
                          fontFamily: "Montserrat",
                        }}
                      >
                        Otros{"  "}
                        <Text
                          style={{
                            fontSize: "8px",
                            fontWeight: "normal",
                            textTransform: "capitalize",
                            fontFamily: "Montserrat",
                          }}
                        >
                          {Number(e.banco).toLocaleString("es-AR", {
                            style: "currency",
                            currency: "ARS",
                          })}
                        </Text>
                      </Text>

                      <Text
                        style={{
                          fontSize: "8px",
                          fontWeight: "bold",
                          fontFamily: "Montserrat",
                        }}
                      >
                        Banco{"  "}
                        <Text
                          style={{
                            fontSize: "8px",
                            fontWeight: "normal",
                            textTransform: "capitalize",
                            fontFamily: "Montserrat",
                          }}
                        >
                          {Number(e.otros).toLocaleString("es-AR", {
                            style: "currency",
                            currency: "ARS",
                          })}
                        </Text>
                      </Text>

                      <Text
                        style={{
                          fontSize: "8px",
                          fontWeight: "bold",
                          fontFamily: "Montserrat",
                        }}
                      >
                        Observaciónes{"  "}
                        <Text
                          style={{
                            fontSize: "8px",
                            fontWeight: "normal",
                            fontFamily: "Montserrat",
                          }}
                        >
                          {e.obs}
                        </Text>
                      </Text>

                      <Text
                        style={{
                          fontSize: "9px",
                          fontWeight: "bold",
                          fontFamily: "Montserrat",
                          marginTop: "5px",
                        }}
                      >
                        Total Final Cobro{"  "}
                        <Text
                          style={{
                            fontSize: "9px",
                            fontWeight: "normal",
                            textTransform: "capitalize",
                            fontFamily: "Montserrat",
                          }}
                        >
                          {Number(e.total_final).toLocaleString("es-AR", {
                            style: "currency",
                            currency: "ARS",
                          })}
                        </Text>
                      </Text>
                    </View>
                  </React.Fragment>
                ))}
            </React.Fragment>
          ))}
        </View>
      </Page>
    </Document>
  );
};
