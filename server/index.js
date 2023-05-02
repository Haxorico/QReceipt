import express from "express";
import cors from "cors";
import { MongoConnect } from "./libs/mongodb.js";
import { CreateHttpError } from "./services/utility-services.js";
// import apiRouter from "./routes/api-routes.js";
// import { CheckToken } from "./middleware/auth.js";

const SERVER_PORT = 9000;
const app = express();

MongoConnect();

app.use(cors());
app.use(express.json());
// app.use(CheckToken);
// app.use("/api", apiRouter);
app.get("*", (req, res, next) => res.status(500).send("TBA Prod app"));
app.use("*", (req, res, next) => next(CreateHttpError(404, `Route not found: ${req.path}`)));
app.use((err, req, res, next) => {
	console.warn("path >>| ", req.path);
	if (err.code === 404) err.message += req.path
	return res.status(err.code || 505).json({ message: err.message });
});

app.listen(SERVER_PORT, () => console.log(`server is listening on port ${SERVER_PORT}`));
