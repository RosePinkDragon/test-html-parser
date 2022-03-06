import express from "express";
import { PORT, NODE_ENV, ORIGIN } from "./config.js";
import getUrlData from "./getRecipe.js";
import cors from "cors";

const app = express();

const corsOptions = () => {
  if (process.env.NODE_ENV === "prod") {
    return {
      origin: function (origin, callback) {
        if (origin === process.env.ORIGIN) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
    };
  } else {
    return {};
  }
};

app.use(cors(corsOptions()));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("*", (req, res, next) => {
  console.log("first");
  next();
});

app.get("/hello", (req, res) => {
  res.send({ success: true });
});

app.post("/getRecipe", getUrlData);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
