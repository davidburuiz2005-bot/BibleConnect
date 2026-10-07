import { Stack } from "expo-router";
import { ThemeProvider } from "../context/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack>

        <Stack.Screen
          name="index"
          options={{
            title: "BibleConnect",
          }}
        />

        <Stack.Screen
          name="biblia"
          options={{
            title: "📖 Biblia",
          }}
        />

        <Stack.Screen
          name="buscar"
          options={{
            title: "🔎 Buscar",
          }}
        />

        <Stack.Screen
          name="favoritos"
          options={{
            title: "❤️ Favoritos",
          }}
        />

        <Stack.Screen
          name="historial"
          options={{
            title: "📚 Historial",
          }}
        />

        <Stack.Screen
          name="configuracion"
          options={{
            title: "⚙️ Configuración",
          }}
        />

      </Stack>
    </ThemeProvider>
  );
}