import { Router } from "express";
import {
  createTask,
  getAllTasks,
  getSingleTask,
  updateTask,
  deleteTask,
  getAllTaskByAdmin,
} from "../controller/task.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);


router.get("/admin/all", requireAdmin, getAllTaskByAdmin);

router.post("/", createTask);
router.get("/", getAllTasks);
router.get("/:id", getSingleTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;