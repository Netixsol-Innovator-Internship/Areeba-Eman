const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');


const express = require('express');
const app = express();
const PORT = 3000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());

// In-memory tasks array
let tasks = [
  { id: 1, title: "Learn Express", completed: false }
];

// GET /api/tasks - get all tasks
app.get('/api/tasks', (req, res) => {
  res.json({
    success: true,
    data: tasks,
    message: "Tasks retrieved successfully"
  });
});

// GET /api/tasks/:id - get task by id
app.get('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);
  if (!task) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Task not found"
    });
  }
  res.json({
    success: true,
    data: task,
    message: "Task retrieved successfully"
  });
});

// POST /api/tasks - add new task
app.post('/api/tasks', (req, res) => {
  const { title, completed } = req.body;

  // Validation
  if (!title || typeof title !== 'string') {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Title is required and must be a string"
    });
  }
  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Completed must be a boolean"
    });
  }

  const newTask = {
    id: tasks.length + 1, // simple id
    title,
    completed: completed || false
  };
  tasks.push(newTask);
  res.status(201).json({
    success: true,
    data: newTask,
    message: "Task created successfully"
  });
});

// PUT /api/tasks/:id - update a task
app.put('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const { title, completed } = req.body;
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Task not found"
    });
  }

  // Validation
  if (title !== undefined && typeof title !== 'string') {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Title must be a string"
    });
  }
  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Completed must be a boolean"
    });
  }

  // Update fields if provided
  if (title !== undefined) tasks[taskIndex].title = title;
  if (completed !== undefined) tasks[taskIndex].completed = completed;

  res.json({
    success: true,
    data: tasks[taskIndex],
    message: "Task updated successfully"
  });
});

// DELETE /api/tasks/:id - remove a task
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "Task not found"
    });
  }

  tasks.splice(taskIndex, 1);

  res.json({
    success: true,
    data: null,
    message: "Task deleted successfully"
  });
});

// Error handling middleware for unexpected errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    data: null,
    message: "Something went wrong!"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
