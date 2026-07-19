import mongoose, { Model, Schema } from "mongoose";

export const adminRoles = ["SUPER_ADMIN", "ADMIN", "EDITOR"] as const;
export const adminStatuses = ["ACTIVE", "INACTIVE"] as const;

export type AdminRole = (typeof adminRoles)[number];
export type AdminStatus = (typeof adminStatuses)[number];

export type AdminUserDocument = {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  status: AdminStatus;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const adminUserSchema = new Schema<AdminUserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
      index: true
    },
    passwordHash: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: adminRoles,
      default: "EDITOR",
      required: true
    },
    status: {
      type: String,
      enum: adminStatuses,
      default: "ACTIVE",
      required: true
    },
    lastLoginAt: {
      type: Date,
      default: null
    }
  },
  {
    collection: "admin_users",
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        const sanitized = ret as Partial<AdminUserDocument>;
        delete sanitized.passwordHash;
        return ret;
      }
    }
  }
);

export const AdminUser =
  (mongoose.models.AdminUser as Model<AdminUserDocument> | undefined) ||
  mongoose.model<AdminUserDocument>("AdminUser", adminUserSchema);
