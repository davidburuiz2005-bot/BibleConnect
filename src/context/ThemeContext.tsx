import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type ThemeContextType = {
  modoOscuro: boolean;
  cambiarModoOscuro: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  modoOscuro: false,
  cambiarModoOscuro: () => {},
});

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [modoOscuro, setModoOscuro] = useState(false);

  useEffect(() => {
    cargarTema();
  }, []);

  const cargarTema = async () => {
    try {
      const temaGuardado =
        await AsyncStorage.getItem("modoOscuro");

      if (temaGuardado !== null) {
        setModoOscuro(
          JSON.parse(temaGuardado)
        );
      }
    } catch (error) {
      console.error(
        "ERROR CARGANDO TEMA:",
        error
      );
    }
  };

  const cambiarModoOscuro = async () => {
    try {
      const nuevoValor = !modoOscuro;

      setModoOscuro(nuevoValor);

      await AsyncStorage.setItem(
        "modoOscuro",
        JSON.stringify(nuevoValor)
      );
    } catch (error) {
      console.error(
        "ERROR GUARDANDO TEMA:",
        error
      );
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        modoOscuro,
        cambiarModoOscuro,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}