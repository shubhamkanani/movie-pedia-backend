import { Router } from "express";

/* Controller */
import Movies from "../controllers/movieController.js";

/* Middleware */
import { authenticateToken } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";

const router = Router();

/* Method */
router.post("/getList", authenticateToken, Movies.getList);
router.get("/getMovie/:id", authenticateToken, Movies.getMovie);
router.post("/add", authenticateToken, upload.single("file"), Movies.add);
router.put(
  "/update/:id",
  authenticateToken,
  upload.single("file"),
  Movies.update
);
router.delete("/delete/:id", authenticateToken, Movies.delete);

export default router;
