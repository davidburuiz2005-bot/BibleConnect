
import { useEffect, useState } from "react";

import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useTheme } from "../context/ThemeContext";

import {
    solicitarPermisosNotificaciones,
} from "../services/notifications";

export default function ConfiguracionScreen() {
  const { modoOscuro, cambiarModoOscuro } = useTheme();

  const [notificaciones, setNotificaciones] =
    useState(false);

  // Cargar configuración guardada
  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const cargarConfiguracion = async () => {
    try {
      const valor =
        await AsyncStorage.getItem("notificaciones");

      if (valor !== null) {
        setNotificaciones(JSON.parse(valor));
      }
    } catch (error) {
      console.error(
        "ERROR CARGANDO CONFIGURACIÓN:",
        error
      );
    }
  };

  // Activar o desactivar notificaciones
  const activarNotificaciones = async (
    valor: boolean
  ) => {
    if (valor) {
      const permiso =
        await solicitarPermisosNotificaciones();

      if (!permiso) {
        Alert.alert(
          "ℹ️ Notificaciones",
          "Las notificaciones reales se podrán probar cuando ejecutemos BibleConnect en Android o iPhone."
        );

        return;
      }

      setNotificaciones(true);

      await AsyncStorage.setItem(
        "notificaciones",
        JSON.stringify(true)
      );

      Alert.alert(
        "🔔 Notificaciones activadas",
        "Ahora BibleConnect puede enviarte recordatorios."
      );
    } else {
      setNotificaciones(false);

      await AsyncStorage.setItem(
        "notificaciones",
        JSON.stringify(false)
      );

      Alert.alert(
        "🔕 Notificaciones desactivadas",
        "Los recordatorios de BibleConnect están desactivados."
      );
    }
  };

  // Probar notificación en Web
  const probarNotificacion = () => {
    Alert.alert(
      "🔔 BibleConnect",
      "¡Recuerda leer un versículo hoy! 📖🙏"
    );
  };

  // Eliminar favoritos
  const eliminarFavoritos = async () => {
    Alert.alert(
      "🗑️ Eliminar favoritos",
      "¿Quieres eliminar todos tus versículos favoritos?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",

          onPress: async () => {
            await AsyncStorage.removeItem("favoritos");

            Alert.alert(
              "✅ Favoritos eliminados",
              "Todos tus favoritos fueron eliminados."
            );
          },
        },
      ]
    );
  };

  // Eliminar historial
  const eliminarHistorial = async () => {
    Alert.alert(
      "🗑️ Eliminar historial",
      "¿Quieres eliminar todo tu historial?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",

          onPress: async () => {
            await AsyncStorage.removeItem("historial");

            Alert.alert(
              "✅ Historial eliminado",
              "Todo tu historial fue eliminado."
            );
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[
        styles.scroll,
        modoOscuro && styles.darkScroll,
      ]}
      contentContainerStyle={styles.container}
    >
      {/* TÍTULO */}

      <Text
        style={[
          styles.title,
          modoOscuro && styles.darkText,
        ]}
      >
        ⚙️ Configuración
      </Text>

      {/* MODO OSCURO */}

      <View
        style={[
          styles.card,
          modoOscuro && styles.darkCard,
        ]}
      >
        <View style={styles.row}>
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.cardTitle,
                modoOscuro && styles.darkText,
              ]}
            >
              🌙 Modo oscuro
            </Text>

            <Text
              style={[
                styles.description,
                modoOscuro &&
                  styles.darkSecondaryText,
              ]}
            >
              Cambiar la apariencia de la aplicación.
            </Text>
          </View>

          <Switch
            value={modoOscuro}
            onValueChange={cambiarModoOscuro}
          />
        </View>
      </View>

      {/* NOTIFICACIONES */}

      <View
        style={[
          styles.card,
          modoOscuro && styles.darkCard,
        ]}
      >
        <View style={styles.row}>
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.cardTitle,
                modoOscuro && styles.darkText,
              ]}
            >
              🔔 Notificaciones
            </Text>

            <Text
              style={[
                styles.description,
                modoOscuro &&
                  styles.darkSecondaryText,
              ]}
            >
              Recibe recordatorios para leer la Biblia.
            </Text>
          </View>

          <Switch
            value={notificaciones}
            onValueChange={activarNotificaciones}
          />
        </View>

        <TouchableOpacity
          style={styles.testButton}
          onPress={probarNotificacion}
        >
          <Text style={styles.testButtonText}>
            🔔 Probar notificación
          </Text>
        </TouchableOpacity>
      </View>

      {/* DATOS */}

      <View
        style={[
          styles.card,
          modoOscuro && styles.darkCard,
        ]}
      >
        <Text
          style={[
            styles.cardTitle,
            modoOscuro && styles.darkText,
          ]}
        >
          🗂️ Datos
        </Text>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={eliminarFavoritos}
        >
          <Text style={styles.deleteText}>
            🗑️ Eliminar favoritos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={eliminarHistorial}
        >
          <Text style={styles.deleteText}>
            🗑️ Eliminar historial
          </Text>
        </TouchableOpacity>
      </View>

      {/* INFORMACIÓN */}

      <View
        style={[
          styles.card,
          modoOscuro && styles.darkCard,
        ]}
      >
        <Text
          style={[
            styles.cardTitle,
            modoOscuro && styles.darkText,
          ]}
        >
          📖 BibleConnect
        </Text>

        <Text
          style={[
            styles.description,
            modoOscuro &&
              styles.darkSecondaryText,
          ]}
        >
          Aplicación para consultar versículos
          bíblicos, guardar favoritos y revisar
          tu historial.
        </Text>

        <Text
          style={[
            styles.version,
            modoOscuro &&
              styles.darkSecondaryText,
          ]}
        >
          Versión 1.0.0
        </Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  darkScroll: {
    backgroundColor: "#111827",
  },

  container: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E3A5F",
    marginBottom: 20,
  },

  darkText: {
    color: "#FFFFFF",
  },

  darkSecondaryText: {
    color: "#D1D5DB",
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

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  textContainer: {
    flex: 1,
    paddingRight: 15,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E3A5F",
    marginBottom: 5,
  },

  description: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },

  testButton: {
    backgroundColor: "#2563EB",
    padding: 13,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 18,
  },

  testButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  deleteButton: {
    backgroundColor: "#EF4444",
    padding: 13,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },

  deleteText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },

  version: {
    marginTop: 12,
    fontSize: 14,
    color: "#777",
  },
});





