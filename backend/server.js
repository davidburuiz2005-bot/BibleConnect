const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

// Ruta principal
app.get("/", (req, res) => {
  res.json({
    mensaje: "BibleConnect Backend funcionando 🚀",
  });
});

// Obtener un versículo
app.get("/api/bible/verse", async (req, res) => {
  try {
    const { reference } = req.query;

    if (!reference) {
      return res.status(400).json({
        error: "Debes proporcionar una referencia bíblica",
      });
    }

    const url =
      `https://api.apibiblia.com/v1/passage?ref=${encodeURIComponent(reference)}` +
      `&version=RVR1960`;

    const response = await fetch(url, {
      headers: {
        "X-API-Key": process.env.BIBLE_API_KEY,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);

  } catch (error) {
    console.error("Error consultando ApiBiblia:", error);

    res.status(500).json({
      error: "Error al consultar la Biblia",
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend ejecutándose en http://localhost:${PORT}`);
});