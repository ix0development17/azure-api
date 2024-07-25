import axios from "axios";
import express from "express";
import dotenv from "dotenv";
import cors from 'cors'

function extractTextBetweenWords(text, wordBefore, wordAfter) {
    const startIndex = text.indexOf(wordBefore);
    const endIndex = text.indexOf(wordAfter);
    if (startIndex !== -1 && endIndex !== -1) {
      const extractedText = text
        .substring(startIndex + wordBefore.length, endIndex)
        .trim();
      return extractedText;
    } else {
      return "error";
    }
}

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

const port = 999;

app.use(express.json());

app.post("/", (req, res) => {
  let e = req.body;
  axios
    .post(
      process.env.url,
      { image: e.image },
      {
        headers: {
          "Content-Type": "application/json",
          "azureml-model-deployment": "det2-debug-4",
          Authorization: `Bearer ${process.env.api}`,
        },
      }
    )
    .then((response) => {
      const result = response.data;
      const jsonObject = JSON.parse(result);
      const non_defetected = extractTextBetweenWords(
        jsonObject.generated_text,
        ": Non-defected: ",
        ", Corrosion:"
      );
      const corrosion = extractTextBetweenWords(
        jsonObject.generated_text,
        " Corrosion: ",
        "\nImage shape"
      );
      const image_shape_before_crackdent_model = extractTextBetweenWords(
        jsonObject.generated_text,
        "Image shape before crack/dent model: ",
        ")"
      ).concat(")");
      res.json({
        generated_text: {
          corrosion,
          non_defetected,
          image_shape_before_crackdent_model,
        },
        image: jsonObject.image,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error");
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://127.0.0.1:${port}`);
});
