import express from "express";
import pino from "pino-http";
import vueRouter from "./vueRouter.js";
import assetsRouter from "./assetsRouter.js";
import path from "path";
import {router} from "express-file-routing";
import helmet from "helmet";

const port = process.env.PORT || 3000;
const apiRouterPath = path.join(path.resolve(), "build/routes");
const publicPath = path.join(path.resolve(), "public");
const distPath = path.join(path.resolve(), "dist");

const app = express();

app.use(pino({
    level: 'info',
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
            singleLine: true,
            ignore: 'pid,hostname,req,res,responseTime',
            customPrettifiers: {
            },
            messageFormat: '{req.method} {req.url} FROM "{req.remoteAddress}:{req.remotePort}" -> STATUS {res.statusCode} IN {responseTime}ms'
        }
    }
}))
app.use(helmet())

app.use("/api", await router({
    directory: apiRouterPath
}))

if (process.env.ENV === "production") {
    // Mount Dist folder in Production
    app.use("/", express.static(distPath));
}
else {
    // Mount Public & Assets folders in Dev
    app.use("/", express.static(publicPath));
    app.use("/src", assetsRouter);
}

// Wildcard any unknown routes to the Vue Frontend
app.use(vueRouter)

app.listen(port, () => {
    console.log("Server listening on port", port);
});