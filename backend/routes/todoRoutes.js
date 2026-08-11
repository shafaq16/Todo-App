import express from "express";
import { createTode,getTodos,getSingleTodo,updateTodo,deleteTodo } from "../controllers/todoController.js";
import protect from "../middleware/auth.js";


const router = express.Router();

// All routes below this line are protected no need to write protect everywhere
router.use(protect);

router.post("/", createTode);

router.get("/", getTodos);

router.get("/:id", getSingleTodo);

router.put("/:id", updateTodo);

router.delete("/:id", deleteTodo);

export default router;