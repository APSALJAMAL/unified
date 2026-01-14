import express from "express";
import userRoutes from "./routes/userRoutes.ts"; // Adjust the path as necessary

const app = express();
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());

app.use("/users", userRoutes);

app.get("/", (_req, res) => {
  res.send("System Online ! ");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
