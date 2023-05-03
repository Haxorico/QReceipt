import express from "express";
import cors from "cors";
import { MongoConnect } from "./libs/mongodb.js";
import { CreateHttpError } from "./services/utility-services.js";
import apiRouter from "./routes/api-routes.js";
import { CheckToken,UsersOnly } from "./middlewares/auth.js";
import { ErrorHandler } from "./middlewares/error-handler.js";

const SERVER_PORT = 9000;
const app = express();

MongoConnect();

app.use(cors());
app.use(express.json());
app.use(CheckToken);
app.use("/api", apiRouter);

app.get("*", (req, res, next) => res.status(500).send("TBA Prod app"));
app.use("*", (req, res, next) => next(CreateHttpError(404, `Router not found: ${req.path}`)), ErrorHandler);

app.use(ErrorHandler);

app.listen(SERVER_PORT, () => console.log(`server is listening on port ${SERVER_PORT}`));
