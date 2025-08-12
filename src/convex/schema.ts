import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

// Todo priority levels
export const PRIORITIES = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
} as const;

export const priorityValidator = v.union(
  v.literal(PRIORITIES.LOW),
  v.literal(PRIORITIES.MEDIUM),
  v.literal(PRIORITIES.HIGH),
  v.literal(PRIORITIES.URGENT),
);
export type Priority = Infer<typeof priorityValidator>;

// Todo categories
export const CATEGORIES = {
  PERSONAL: "personal",
  WORK: "work",
  SHOPPING: "shopping",
  HEALTH: "health",
  LEARNING: "learning",
  OTHER: "other",
} as const;

export const categoryValidator = v.union(
  v.literal(CATEGORIES.PERSONAL),
  v.literal(CATEGORIES.WORK),
  v.literal(CATEGORIES.SHOPPING),
  v.literal(CATEGORIES.HEALTH),
  v.literal(CATEGORIES.LEARNING),
  v.literal(CATEGORIES.OTHER),
);
export type Category = Infer<typeof categoryValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Todos table
    todos: defineTable({
      userId: v.id("users"),
      title: v.string(),
      description: v.optional(v.string()),
      completed: v.boolean(),
      priority: priorityValidator,
      category: categoryValidator,
      dueDate: v.optional(v.number()),
      completedAt: v.optional(v.number()),
      tags: v.optional(v.array(v.string())),
    })
      .index("by_user", ["userId"])
      .index("by_user_and_completed", ["userId", "completed"])
      .index("by_user_and_category", ["userId", "category"])
      .index("by_user_and_priority", ["userId", "priority"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;