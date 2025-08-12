import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";
import { categoryValidator, priorityValidator } from "./schema";

// Get all todos for the current user
export const getTodos = query({
  args: {
    completed: v.optional(v.boolean()),
    category: v.optional(categoryValidator),
    priority: v.optional(priorityValidator),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Handle different filter combinations
    if (args.completed !== undefined && args.category !== undefined) {
      // This is not ideal, but Convex doesn't support multiple indexes on the same query
      // For a real app, you would need to create a more complex indexing strategy
      const todos = await ctx.db
        .query("todos")
        .withIndex("by_user_and_completed", (q) =>
          q.eq("userId", user._id).eq("completed", args.completed!)
        )
        .collect();
      
      return todos.filter(todo => todo.category === args.category);

    } else if (args.completed !== undefined) {
      const todos = await ctx.db
        .query("todos")
        .withIndex("by_user_and_completed", (q) =>
          q.eq("userId", user._id).eq("completed", args.completed!)
        )
        .order("desc")
        .collect();
      return todos;
    } else if (args.category !== undefined) {
      const todos = await ctx.db
        .query("todos")
        .withIndex("by_user_and_category", (q) =>
          q.eq("userId", user._id).eq("category", args.category!)
        )
        .order("desc")
        .collect();
      return todos;
    } else if (args.priority !== undefined) {
      const todos = await ctx.db
        .query("todos")
        .withIndex("by_user_and_priority", (q) =>
          q.eq("userId", user._id).eq("priority", args.priority!)
        )
        .order("desc")
        .collect();
      return todos;
    } else {
      const todos = await ctx.db
        .query("todos")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .order("desc")
        .collect();
      return todos;
    }
  },
});

// Create a new todo
export const createTodo = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    priority: priorityValidator,
    category: categoryValidator,
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User not authenticated");
    }

    const todoId = await ctx.db.insert("todos", {
      userId: user._id,
      title: args.title,
      description: args.description,
      completed: false,
      priority: args.priority,
      category: args.category,
      dueDate: args.dueDate,
      tags: args.tags,
    });

    return todoId;
  },
});

// Update a todo
export const updateTodo = mutation({
  args: {
    id: v.id("todos"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    priority: v.optional(priorityValidator),
    category: v.optional(categoryValidator),
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User not authenticated");
    }

    const todo = await ctx.db.get(args.id);
    if (!todo || todo.userId !== user._id) {
      throw new Error("Todo not found or access denied");
    }

    const updates: any = {};
    if (args.title !== undefined) updates.title = args.title;
    if (args.description !== undefined) updates.description = args.description;
    if (args.priority !== undefined) updates.priority = args.priority;
    if (args.category !== undefined) updates.category = args.category;
    if (args.dueDate !== undefined) updates.dueDate = args.dueDate;
    if (args.tags !== undefined) updates.tags = args.tags;

    await ctx.db.patch(args.id, updates);
    return args.id;
  },
});

// Toggle todo completion
export const toggleTodo = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User not authenticated");
    }

    const todo = await ctx.db.get(args.id);
    if (!todo || todo.userId !== user._id) {
      throw new Error("Todo not found or access denied");
    }

    const updates: any = {
      completed: !todo.completed,
    };

    if (!todo.completed) {
      updates.completedAt = Date.now();
    } else {
      updates.completedAt = undefined;
    }

    await ctx.db.patch(args.id, updates);
    return args.id;
  },
});

// Delete a todo
export const deleteTodo = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User not authenticated");
    }

    const todo = await ctx.db.get(args.id);
    if (!todo || todo.userId !== user._id) {
      throw new Error("Todo not found or access denied");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Get todo statistics
export const getTodoStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User not authenticated");
    }

    const todos = await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    
    const byPriority = {
      urgent: todos.filter(todo => todo.priority === "urgent" && !todo.completed).length,
      high: todos.filter(todo => todo.priority === "high" && !todo.completed).length,
      medium: todos.filter(todo => todo.priority === "medium" && !todo.completed).length,
      low: todos.filter(todo => todo.priority === "low" && !todo.completed).length,
    };

    const byCategory = {
      work: todos.filter(todo => todo.category === "work" && !todo.completed).length,
      personal: todos.filter(todo => todo.category === "personal" && !todo.completed).length,
      shopping: todos.filter(todo => todo.category === "shopping" && !todo.completed).length,
      health: todos.filter(todo => todo.category === "health" && !todo.completed).length,
      learning: todos.filter(todo => todo.category === "learning" && !todo.completed).length,
      other: todos.filter(todo => todo.category === "other" && !todo.completed).length,
    };

    return {
      total,
      completed,
      pending,
      byPriority,
      byCategory,
    };
  },
});