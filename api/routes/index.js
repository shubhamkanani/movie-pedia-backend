import { Router } from "express";

/* All Routes */
import userRoutes from "./userRoutes.js";
import movieRoutes from "./movieRoutes.js";

const rootRouter = Router();
/* Assign Routes */
rootRouter.use("/", userRoutes);
rootRouter.use("/movie", movieRoutes);

export default rootRouter;
