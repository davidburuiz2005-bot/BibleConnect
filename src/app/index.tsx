import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "../context/ThemeContext";
import { getVerse } from "../services/bibleApi";

export default function HomeScreen() {
  const [verse, setVerse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { modoOscuro } = useTheme();

  const cargarVersiculoDelDia = async () => {
    try {
      setLoading(true);

      const resultado = await getVerse("Juan 3:16");

      console.log(
        "🌟 VERSÍCULO DEL DÍA:",
        resultado
      );

      setVerse(resultado);
    } catch (error) {
      console.error(
        "ERROR VERSÍCULO DEL DÍA:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarVersiculoDelDia();
  }, []);

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
      showsVerticalScrollIndicator={true}
    >

      {/* LOGO */}

      <Text style={styles.logo}>
        📖
      </Text>

      <Text
        style={[
          styles.title,
          modoOscuro && styles.darkText,
        ]}
      >
        BibleConnect
      </Text>

      <Text
        style={[
          styles.subtitle,
          modoOscuro && styles.darkSecondaryText,
        ]}
      >
        Tu espacio para conectar con la Biblia
      </Text>

      {/* VERSÍCULO DEL DÍA */}

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
          🌟 Versículo del día
        </Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            style={styles.loading}
          />
        ) : verse ? (
          <>
            <Text
              style={[
                styles.verse,
                modoOscuro && styles.darkSecondaryText,
              ]}
            >
              "{verse.text}"
            </Text>

            <Text style={styles.reference}>
              — {verse.reference}
            </Text>

            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={guardarFavorito}
            >
              <Text style={styles.favoriteText}>
                ❤️ Guardar en favoritos
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.error}>
            No se pudo cargar el versículo.
          </Text>
        )}

      </View>

      {/* BIBLIA */}

      <Pressable
        style={styles.button}
        onPress={() => router.push("/biblia")}
      >
        <Text style={styles.buttonText}>
          📖 Comenzar a leer
        </Text>
      </Pressable>

      {/* FAVORITOS */}

      <Pressable
        style={styles.secondaryButton}
        onPress={() => router.push("/favoritos")}
      >
        <Text style={styles.secondaryButtonText}>
          ❤️ Mis favoritos
        </Text>
      </Pressable>

      {/* HISTORIAL */}

      <Pressable
        style={styles.secondaryButton}
        onPress={() => router.push("/historial")}
      >
        <Text style={styles.secondaryButtonText}>
          📚 Mi historial
        </Text>
      </Pressable>

      {/* CONFIGURACIÓN */}

      <Pressable
        style={styles.settingsButton}
        onPress={() => router.push("/configuracion")}
      >
        <Text style={styles.settingsButtonText}>
          ⚙️ Configuración
        </Text>
      </Pressable>

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
    alignItems: "center",
    paddingBottom: 40,
  },

  logo: {
    fontSize: 60,
    marginTop: 30,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1E3A5F",
    marginTop: 10,
  },

  darkText: {
    color: "#FFFFFF",
  },

  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 25,
  },

  darkSecondaryText: {
    color: "#D1D5DB",
  },

  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderRadius: 18,
    elevation: 4,
    marginBottom: 20,
  },

  darkCard: {
    backgroundColor: "#1F2937",
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1E3A5F",
    marginBottom: 15,
  },

  verse: {
    fontSize: 18,
    lineHeight: 29,
    color: "#333",
    fontStyle: "italic",
  },

  reference: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2563EB",
    marginTop: 15,
  },

  loading: {
    marginVertical: 30,
  },

  error: {
    color: "red",
    fontSize: 16,
  },

  favoriteButton: {
    marginTop: 20,
    backgroundColor: "#EF4444",
    padding: 13,
    borderRadius: 10,
    alignItems: "center",
  },

  favoriteText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },

  button: {
    width: "100%",
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  secondaryButton: {
    width: "100%",
    backgroundColor: "#1E3A5F",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },

  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  settingsButton: {
    width: "100%",
    backgroundColor: "#6B7280",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },

  settingsButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

});