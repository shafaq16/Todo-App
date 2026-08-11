import Todo from "../models/Todo.js";

export const createTode = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }
    const todo = await Todo.create({
      title,
      description,
      priority,
      dueDate,
      userId: req.user.id,
    });
    res.status(201).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get single todo

export const getSingleTodo = async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      req.body, //insted of writing manually everything { title, description, completed, priority, dueDate },
      {
        new: true,//without it db k pass purana data hi rhega 
        runValidators: true,
      },
    );

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    res.status(200).json({
      message: "Todo deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};