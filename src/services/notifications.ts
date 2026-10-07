import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configuración de las notificaciones
if (Platform.OS !== "web") {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

// Solicitar permisos
export async function solicitarPermisosNotificaciones() {
  // Expo Web no soporta estas notificaciones nativas
  if (Platform.OS === "web") {
    console.log(
      "ℹ️ Las notificaciones nativas no están disponibles en Web."
    );

    return false;
  }

  try {
    const { status } =
      await Notifications.getPermissionsAsync();

    if (status !== "granted") {
      const { status: nuevoStatus } =
        await Notifications.requestPermissionsAsync();

      if (nuevoStatus !== "granted") {
        console.log(
          "❌ Permiso de notificaciones rechazado."
        );

        return false;
      }
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync(
        "default",
        {
          name: "default",
          importance:
            Notifications.AndroidImportance.MAX,
        }
      );
    }

    console.log(
      "✅ Permisos de notificaciones aceptados."
    );

    return true;
  } catch (error) {
    console.error(
      "ERROR CON LAS NOTIFICACIONES:",
      error
    );

    return false;
  }
}

// Crear una notificación de prueba
export async function enviarNotificacionPrueba() {
  // Evitar error en Expo Web
  if (Platform.OS === "web") {
    console.log(
      "ℹ️ La prueba de notificación no está disponible en Web."
    );

    return false;
  }

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "📖 BibleConnect",
        body: "¡Recuerda leer un versículo hoy! 🙏",
        sound: true,
      },

      trigger: null,
    });

    return true;
  } catch (error) {
    console.error(
      "ERROR ENVIANDO NOTIFICACIÓN:",
      error
    );

    return false;
  }
}