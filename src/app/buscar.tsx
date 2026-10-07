import { StyleSheet, Text, View } from "react-native";

export default function BuscarScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔎</Text>

      <Text style={styles.title}>
        Buscar versículos
      </Text>

      <Text style={styles.text}>
        Aquí podrás buscar versículos por palabras,
        temas o referencias bíblicas.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },

  icon: {
    fontSize: 55,
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E3A5F",
    marginBottom: 15,
  },

  text: {
    fontSize: 17,
    color: "#444",
    textAlign: "center",
    lineHeight: 26,
  },
});