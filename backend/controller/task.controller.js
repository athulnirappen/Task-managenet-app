import prisma from "../configuration/prisma.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title || !description || !status) {
      return res.status(400).json({
        msg: "title, description, and status are required",
      });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        userId: req.userId,
      },
    });

    return res.status(200).json({
      msg: "task created successfully",
      data: task,
    });
  } catch (error) {
    console.error("Create task error:", error);
    return res
      .status(500)
      .json({ msg: "Something went wrong while creating the task" });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const search = req.query.search?.trim();
    const status = req.query.status;

    
    const where = {
      ...(req.role !== "ADMIN" && { userId: req.userId }),

      ...(search && {
        title: {
          contains: search,
          
        },
      }),

      ...(status && { status }),
    };

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
       
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      }),

      prisma.task.count({ where }),
    ]);

    return res.status(200).json({
      msg: "Tasks fetched successfully",
      data: tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
   
   

    return res.status(500).json({
      msg: error.message || "Something went wrong",
    });
  }
};

export const getSingleTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!task) {
      return res.status(402).json({
        msg: "task with this id is not found",
      });
    }

    if (task.userId !== req.userId && req.role !== "ADMIN") {
      return res.status(403).json({
        msg: "you do not have the access to this task",
      });
    }

    return res.status(200).json({
      msg: "task fetched successfully",
      data: task,
    });
  } catch (error) {
    console.error("Create task error:", error);
    return res
      .status(500)
      .json({ msg: "Something went wrong while getting the single task" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const existingTask = await prisma.task.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existingTask) {
      return res.status(404).json({ msg: "task not found" });
    }

    if (existingTask.userId !== req.userId && req.role !== "ADMIN") {
      return res
        .status(403)
        .json({ msg: "you do not have access to this task" });
    }

    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status }),
      },
    });

    return res.status(200).json({
      msg: "task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Create task error:", error);
    return res
      .status(500)
      .json({ msg: "Something went wrong while update the task" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const existingTask = await prisma.task.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existingTask) {
      return res.status(404).json({ msg: "task not found" });
    }

    if (existingTask.userId !== req.userId && req.role !== "ADMIN") {
      return res
        .status(403)
        .json({ msg: "you do not have access to this task" });
    }

    await prisma.task.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({ msg: "task deleted successfully" });
  } catch (error) {
    console.error("Create task error:", error);
    return res
      .status(500)
      .json({ msg: "Something went wrong while delete the task" });
  }
};

export const getAllTaskByAdmin = async (req, res) => {
  try {
    if (req.role !== "ADMIN") {
      return res.status(403).json({ msg: "admin access required" });
    }

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const search = req.query.search?.trim();
    const status = req.query.status;

    const where = {
      ...(search && {
        title: { contains: search },
      }),
      ...(status && { status }),
    };

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy: { createdDate: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
      }),
      prisma.task.count({ where }),
    ]);

    return res.status(200).json({
      msg: "all tasks fetched successfully",
      data: tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Create task error:", error);
    return res
      .status(500)
      .json({ msg: "Something went wrong while get all task by admin" });
  }
};
