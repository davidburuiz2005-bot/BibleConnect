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

export default function FavoritosScreen() {
  const [favoritos, setFavoritos] = useState<any[]>([]);

  const { modoOscuro } = useTheme();

  const cargarFavoritos = async () => {
    console.log("🔵 CARGANDO FAVORITOS...");

    try {
      const datos =
        await AsyncStorage.getItem("favoritos");

      console.log(
        "📦 DATOS EN STORAGE:",
        datos
      );

      if (datos) {
        const favoritosGuardados =
          JSON.parse(datos);

        setFavoritos(favoritosGuardados);
      } else {
        setFavoritos([]);
      }

    } catch (error) {
      console.error(
        "❌ ERROR CARGANDO FAVORITOS:",
        error
      );

      setFavoritos([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarFavoritos();
    }, [])
  );

  const eliminarFavorito = async (
    reference: string
  ) => {
    console.log(
      "🗑️ ELIMINANDO FAVORITO:",
      reference
    );

    try {
      const nuevosFavoritos =
        favoritos.filter(
          (favorito) =>
            favorito.reference !== reference
        );

      await AsyncStorage.setItem(
        "favoritos",
        JSON.stringify(nuevosFavoritos)
      );

      setFavoritos(nuevosFavoritos);

      Alert.alert(
        "🗑️ Eliminado",
        "El versículo fue eliminado de favoritos."
      );

    } catch (error) {
      console.error(
        "❌ ERROR ELIMINANDO:",
        error
      );

      Alert.alert(
        "Error",
        "No se pudo eliminar el favorito."
      );
    }
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
        ❤️ Mis favoritos
      </Text>

      {/* CONTADOR */}

      <Text
        style={[
          styles.counter,
          modoOscuro && styles.darkSecondaryText,
        ]}
      >
        Favoritos guardados: {favoritos.length}
      </Text>

      {/* SIN FAVORITOS */}

      {favoritos.length === 0 ? (
        <View style={styles.emptyContainer}>

          <Text style={styles.icon}>
            ❤️
          </Text>

          <Text
            style={[
              styles.emptyTitle,
              modoOscuro && styles.darkText,
            ]}
          >
            No tienes favoritos
          </Text>

          <Text
            style={[
              styles.emptyText,
              modoOscuro && styles.darkSecondaryText,
            ]}
          >
            Guarda un versículo desde la pantalla
            de Biblia y aparecerá aquí.
          </Text>

        </View>
      ) : (

        /* LISTA DE FAVORITOS */

        <FlatList
          data={favoritos}
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

              {/* ELIMINAR */}

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() =>
                  eliminarFavorito(
                    item.reference
                  )
                }
              >
                <Text style={styles.deleteText}>
                  🗑️ Eliminar
                </Text>
              </TouchableOpacity>

            </View>
          )}
        />

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
    paddingBottom: 30,
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
    marginTop: 20,
    backgroundColor: "#EF4444",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
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
