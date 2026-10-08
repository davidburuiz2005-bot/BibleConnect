const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

export async function getVerse(reference: string) {
  const url =
    `${API_URL}/api/bible/verse?reference=${encodeURIComponent(reference)}`;

  const response = await fetch(url);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "No se pudo obtener el versículo"
    );
  }

  if (!data.success) {
    throw new Error("La API no pudo obtener el versículo");
  }

  return data.data;
}