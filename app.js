import express from "express";
import router from "./routes/serverRoute.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);



app.listen(8800, () => {
  console.log("Server is running on port 8800");
});