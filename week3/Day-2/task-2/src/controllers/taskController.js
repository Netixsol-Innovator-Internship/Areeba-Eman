const Task = require("../models/Task")

// @desc    Get all tasks for the authenticated user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = req.query

    // Build filter object
    const filter = { user: req.user._id }

    if (status) {
      filter.status = status
    }

    if (priority) {
      filter.priority = priority
    }

    // Build sort object
    const sort = {}
    sort[sortBy] = sortOrder === "desc" ? -1 : 1

    // Calculate pagination
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    // Get tasks with pagination
    const tasks = await Task.find(filter)
      .sort(sort)
      .limit(Number.parseInt(limit))
      .skip(skip)
      .populate("user", "name email")

    // Get total count for pagination info
    const totalTasks = await Task.countDocuments(filter)
    const totalPages = Math.ceil(totalTasks / Number.parseInt(limit))

    res.status(200).json({
      status: "success",
      data: {
        tasks,
        pagination: {
          currentPage: Number.parseInt(page),
          totalPages,
          totalTasks,
          hasNextPage: Number.parseInt(page) < totalPages,
          hasPrevPage: Number.parseInt(page) > 1,
        },
      },
    })
  } catch (error) {
    console.error("Get tasks error:", error)

    res.status(500).json({
      status: "error",
      message: "Server error getting tasks",
    })
  }
}

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id, // Ensure user can only access their own tasks
    }).populate("user", "name email")

    if (!task) {
      return res.status(404).json({
        status: "error",
        message: "Task not found",
      })
    }

    res.status(200).json({
      status: "success",
      data: {
        task,
      },
    })
  } catch (error) {
    console.error("Get task by ID error:", error)

    // Handle invalid ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({
        status: "error",
        message: "Invalid task ID format",
      })
    }

    res.status(500).json({
      status: "error",
      message: "Server error getting task",
    })
  }
}

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body

    // Create task with authenticated user
    const task = new Task({
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      user: req.user._id,
    })

    await task.save()

    // Populate user info before sending response
    await task.populate("user", "name email")

    res.status(201).json({
      status: "success",
      message: "Task created successfully",
      data: {
        task,
      },
    })
  } catch (error) {
    console.error("Create task error:", error)

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }))

      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors,
      })
    }

    res.status(500).json({
      status: "error",
      message: "Server error creating task",
    })
  }
}

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body

    // Find task and ensure it belongs to the authenticated user
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!task) {
      return res.status(404).json({
        status: "error",
        message: "Task not found",
      })
    }

    // Update task fields
    task.title = title || task.title
    task.description = description !== undefined ? description : task.description
    task.status = status || task.status
    task.priority = priority || task.priority
    task.dueDate = dueDate ? new Date(dueDate) : task.dueDate

    await task.save()

    // Populate user info before sending response
    await task.populate("user", "name email")

    res.status(200).json({
      status: "success",
      message: "Task updated successfully",
      data: {
        task,
      },
    })
  } catch (error) {
    console.error("Update task error:", error)

    // Handle invalid ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({
        status: "error",
        message: "Invalid task ID format",
      })
    }

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }))

      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors,
      })
    }

    res.status(500).json({
      status: "error",
      message: "Server error updating task",
    })
  }
}

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    // Find and delete task, ensuring it belongs to the authenticated user
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!task) {
      return res.status(404).json({
        status: "error",
        message: "Task not found",
      })
    }

    res.status(200).json({
      status: "success",
      message: "Task deleted successfully",
      data: {
        deletedTask: {
          id: task._id,
          title: task.title,
        },
      },
    })
  } catch (error) {
    console.error("Delete task error:", error)

    // Handle invalid ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({
        status: "error",
        message: "Invalid task ID format",
      })
    }

    res.status(500).json({
      status: "error",
      message: "Server error deleting task",
    })
  }
}

// @desc    Get task statistics for the authenticated user
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res) => {
  try {
    const userId = req.user._id

    // Get task counts by status
    const statusStats = await Task.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ])

    // Get task counts by priority
    const priorityStats = await Task.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ])

    // Get total tasks
    const totalTasks = await Task.countDocuments({ user: userId })

    // Get overdue tasks
    const overdueTasks = await Task.countDocuments({
      user: userId,
      dueDate: { $lt: new Date() },
      status: { $ne: "completed" },
    })

    res.status(200).json({
      status: "success",
      data: {
        totalTasks,
        overdueTasks,
        statusBreakdown: statusStats.reduce((acc, item) => {
          acc[item._id] = item.count
          return acc
        }, {}),
        priorityBreakdown: priorityStats.reduce((acc, item) => {
          acc[item._id] = item.count
          return acc
        }, {}),
      },
    })
  } catch (error) {
    console.error("Get task stats error:", error)

    res.status(500).json({
      status: "error",
      message: "Server error getting task statistics",
    })
  }
}

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
}
