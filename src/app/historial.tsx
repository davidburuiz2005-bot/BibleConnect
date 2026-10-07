import { useCallback, useState } from "react";

import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";

import { useTheme } from "../context/ThemeContext";

export default function HistorialScreen() {
  const [historial, setHistorial] = useState<any[]>([]);

  const { modoOscuro } = useTheme();

  const cargarHistorial = async () => {
    try {
      const datos =
        await AsyncStorage.getItem("historial");

      if (datos) {
        setHistorial(JSON.parse(datos));
      } else {
        setHistorial([]);
      }
    } catch (error) {
      console.error(
        "ERROR CARGANDO HISTORIAL:",
        error
      );

      setHistorial([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarHistorial();
    }, [])
  );

  const eliminarHistorial = async () => {
    Alert.alert(
      "🗑️ Eliminar historial",
      "¿Quieres eliminar todo el historial?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",

          onPress: async () => {
            await AsyncStorage.removeItem(
              "historial"
            );

            setHistorial([]);

            Alert.alert(
              "✅ Historial eliminado",
              "Se eliminó todo el historial."
            );
          },
        },
      ]
    );
  };

  return (
    <View
      style={[
        styles.container,
        modoOscuro && styles.darkContainer,
      ]}
    >

      {/* TÍTULO */}

      <Text
        style={[
          styles.title,
          modoOscuro && styles.darkText,
        ]}
      >
        📚 Historial
      </Text>

      {/* CONTADOR */}

      <Text
        style={[
          styles.counter,
          modoOscuro && styles.darkSecondaryText,
        ]}
      >
        Consultas realizadas: {historial.length}
      </Text>

      {historial.length === 0 ? (

        /* SIN HISTORIAL */

        <View style={styles.emptyContainer}>

          <Text style={styles.icon}>
            📚
          </Text>

          <Text
            style={[
              styles.emptyTitle,
              modoOscuro && styles.darkText,
            ]}
          >
            No tienes historial
          </Text>

          <Text
            style={[
              styles.emptyText,
              modoOscuro &&
                styles.darkSecondaryText,
            ]}
          >
            Los versículos que busques aparecerán aquí.
          </Text>

        </View>

      ) : (

        /* HISTORIAL */

        <>
          <FlatList
            data={historial}
            keyExtractor={(item, index) =>
              `${item.reference}-${index}`
            }
            contentContainerStyle={styles.list}

            renderItem={({ item }) => (

              <View
                style={[
                  styles.card,
                  modoOscuro && styles.darkCard,
                ]}
              >

                <Text
                  style={[
                    styles.reference,
                    modoOscuro && styles.darkText,
                  ]}
                >
                  {item.reference}
                </Text>

                <Text
                  style={[
                    styles.version,
                    modoOscuro &&
                      styles.darkSecondaryText,
                  ]}
                >
                  {item.version || "RVR1960"}
                </Text>

                <Text
                  style={[
                    styles.verse,
                    modoOscuro &&
                      styles.darkSecondaryText,
                  ]}
                >
                  {item.text}
                </Text>

              </View>

            )}
          />

          {/* ELIMINAR HISTORIAL */}

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={eliminarHistorial}
          >
            <Text style={styles.deleteText}>
              🗑️ Eliminar historial
            </Text>
          </TouchableOpacity>
        </>
      )}

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 20,
  },

  darkContainer: {
    backgroundColor: "#111827",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E3A5F",
    marginBottom: 5,
  },

  darkText: {
    color: "#FFFFFF",
  },

  counter: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },

  darkSecondaryText: {
    color: "#D1D5DB",
  },

  list: {
    paddingBottom: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
  },

  darkCard: {
    backgroundColor: "#1F2937",
  },

  reference: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1E3A5F",
    marginBottom: 5,
  },

  version: {
    fontSize: 14,
    color: "#777",
    marginBottom: 12,
  },

  verse: {
    fontSize: 18,
    lineHeight: 28,
    color: "#333",
  },

  deleteButton: {
    backgroundColor: "#EF4444",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  deleteText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },

  icon: {
    fontSize: 60,
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E3A5F",
    marginBottom: 15,
  },

  emptyText: {
    fontSize: 17,
    color: "#555",
    textAlign: "center",
    lineHeight: 26,
  },

});