const express = require("express")
const { body, query } = require("express-validator")
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} = require("../controllers/taskController")
const auth = require("../middleware/auth")
const validateRequest = require("../middleware/validateRequest")

const router = express.Router()

// All routes are protected - require authentication
router.use(auth)

// Validation rules
const createTaskValidation = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Title is required and must be between 1 and 100 characters"),

  body("description").optional().trim().isLength({ max: 500 }).withMessage("Description cannot exceed 500 characters"),

  body("status")
    .optional()
    .isIn(["pending", "in-progress", "completed"])
    .withMessage("Status must be one of: pending, in-progress, completed"),

  body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Priority must be one of: low, medium, high"),

  body("dueDate").optional().isISO8601().withMessage("Due date must be a valid date"),
]

const updateTaskValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Title must be between 1 and 100 characters"),

  body("description").optional().trim().isLength({ max: 500 }).withMessage("Description cannot exceed 500 characters"),

  body("status")
    .optional()
    .isIn(["pending", "in-progress", "completed"])
    .withMessage("Status must be one of: pending, in-progress, completed"),

  body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Priority must be one of: low, medium, high"),

  body("dueDate").optional().isISO8601().withMessage("Due date must be a valid date"),
]

const getTasksValidation = [
  query("status")
    .optional()
    .isIn(["pending", "in-progress", "completed"])
    .withMessage("Status must be one of: pending, in-progress, completed"),

  query("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be one of: low, medium, high"),

  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),

  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),

  query("sortBy")
    .optional()
    .isIn(["createdAt", "updatedAt", "title", "dueDate", "priority", "status"])
    .withMessage("SortBy must be one of: createdAt, updatedAt, title, dueDate, priority, status"),

  query("sortOrder").optional().isIn(["asc", "desc"]).withMessage("SortOrder must be asc or desc"),
]

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks for authenticated user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in-progress, completed]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", getTasksValidation, validateRequest, getTasks)

/**
 * @swagger
 * /api/tasks/stats:
 *   get:
 *     summary: Get task statistics for authenticated user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/stats", getTaskStats)

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", getTaskById)

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Complete project documentation
 *               description:
 *                 type: string
 *                 example: Write comprehensive API documentation
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *                 example: pending
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: high
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-12-31T23:59:59.000Z
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/", createTaskValidation, validateRequest, createTask)

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", updateTaskValidation, validateRequest, updateTask)

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", deleteTask)

module.exports = router
