import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";

import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { useTheme } from "../context/ThemeContext";
import { getVerse } from "../services/bibleApi";

export default function BibliaScreen() {
  const [reference, setReference] = useState("Juan 3:16");
  const [verse, setVerse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { modoOscuro } = useTheme();

  const buscarVersiculo = async () => {
    try {
      setLoading(true);
      setError("");
      setVerse(null);

      const resultado = await getVerse(reference);

      console.log(
        "VERSÍCULO RECIBIDO:",
        resultado
      );

      // 📚 GUARDAR EN HISTORIAL

      const historialGuardado =
        await AsyncStorage.getItem("historial");

      const historial = historialGuardado
        ? JSON.parse(historialGuardado)
        : [];

      const yaExiste = historial.some(
        (item: any) =>
          item.reference === resultado.reference
      );

      if (!yaExiste) {
        historial.unshift({
          reference: resultado.reference,
          version:
            resultado.version?.name || "RVR1960",
          text: resultado.text,
        });

        await AsyncStorage.setItem(
          "historial",
          JSON.stringify(historial)
        );
      }

      setVerse(resultado);

    } catch (error) {
      console.error(
        "ERROR EN LA PANTALLA:",
        error
      );

      setError(
        "No encontramos ese versículo. Verifica la referencia."
      );

    } finally {
      setLoading(false);
    }
  };

  // ❤️ GUARDAR FAVORITO

  const guardarFavorito = async () => {
    if (!verse) {
      return;
    }

    try {
      const favoritosGuardados =
        await AsyncStorage.getItem("favoritos");

      const favoritos = favoritosGuardados
        ? JSON.parse(favoritosGuardados)
        : [];

      const yaExiste = favoritos.some(
        (favorito: any) =>
          favorito.reference === verse.reference
      );

      if (yaExiste) {
        Alert.alert(
          "❤️ Favorito",
          "Este versículo ya está guardado."
        );

        return;
      }

      favoritos.push({
        reference: verse.reference,
        version:
          verse.version?.name || "RVR1960",
        text: verse.text,
      });

      await AsyncStorage.setItem(
        "favoritos",
        JSON.stringify(favoritos)
      );

      Alert.alert(
        "❤️ Guardado",
        "El versículo fue agregado a favoritos."
      );

    } catch (error) {
      console.error(
        "ERROR GUARDANDO FAVORITO:",
        error
      );

      Alert.alert(
        "Error",
        "No se pudo guardar el versículo."
      );
    }
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
        📖 Biblia
      </Text>

      <Text
        style={[
          styles.subtitle,
          modoOscuro && styles.darkSecondaryText,
        ]}
      >
        Busca un versículo por referencia.
      </Text>

      {/* INPUT */}

      <TextInput
        style={[
          styles.input,
          modoOscuro && styles.darkInput,
        ]}
        value={reference}
        onChangeText={setReference}
        placeholder="Ejemplo: Juan 3:16"
        placeholderTextColor={
          modoOscuro ? "#9CA3AF" : "#999"
        }
        autoCapitalize="sentences"
      />

      {/* BUSCAR */}

      <TouchableOpacity
        style={styles.button}
        onPress={buscarVersiculo}
      >
        <Text style={styles.buttonText}>
          🔎 Buscar versículo
        </Text>
      </TouchableOpacity>

      {/* LOADING */}

      {loading && (
        <ActivityIndicator
          size="large"
          style={styles.loading}
        />
      )}

      {/* ERROR */}

      {error !== "" && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}

      {/* VERSÍCULO */}

      {verse && (
        <View
          style={[
            styles.verseContainer,
            modoOscuro && styles.darkCard,
          ]}
        >

          <Text
            style={[
              styles.reference,
              modoOscuro && styles.darkText,
            ]}
          >
            {verse.reference}
          </Text>

          <Text
            style={[
              styles.version,
              modoOscuro && styles.darkSecondaryText,
            ]}
          >
            {verse.version?.name || "RVR1960"}
          </Text>

          <Text
            style={[
              styles.text,
              modoOscuro && styles.darkSecondaryText,
            ]}
          >
            {verse.text}
          </Text>

          {/* FAVORITO */}

          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={guardarFavorito}
          >
            <Text style={styles.favoriteText}>
              ❤️ Guardar en favoritos
            </Text>
          </TouchableOpacity>

          {/* VER FAVORITOS */}

          <TouchableOpacity
            style={styles.viewFavoritesButton}
            onPress={() =>
              router.push("/favoritos")
            }
          >
            <Text style={styles.viewFavoritesText}>
              ❤️ Ver mis favoritos
            </Text>
          </TouchableOpacity>

          {/* HISTORIAL */}

          <TouchableOpacity
            style={styles.historyButton}
            onPress={() =>
              router.push("/historial")
            }
          >
            <Text style={styles.historyText}>
              📚 Ver historial
            </Text>
          </TouchableOpacity>

        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  darkScroll: {
    backgroundColor: "#111827",
  },

  container: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1E3A5F",
    marginBottom: 10,
  },

  darkText: {
    color: "#FFFFFF",
  },

  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: "#555",
  },

  darkSecondaryText: {
    color: "#D1D5DB",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    color: "#222",
    backgroundColor: "#FFFFFF",
  },

  darkInput: {
    backgroundColor: "#1F2937",
    borderColor: "#4B5563",
    color: "#FFFFFF",
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  loading: {
    marginTop: 20,
  },

  error: {
    color: "#EF4444",
    marginTop: 20,
    fontSize: 16,
  },

  verseContainer: {
    marginTop: 25,
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },

  darkCard: {
    backgroundColor: "#1F2937",
  },

  reference: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E3A5F",
    marginBottom: 5,
  },

  version: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },

  text: {
    fontSize: 19,
    lineHeight: 30,
    color: "#333",
  },

  favoriteButton: {
    marginTop: 20,
    backgroundColor: "#EF4444",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  favoriteText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  viewFavoritesButton: {
    marginTop: 12,
    backgroundColor: "#1E3A5F",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  viewFavoritesText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  historyButton: {
    marginTop: 12,
    backgroundColor: "#059669",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  historyText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});