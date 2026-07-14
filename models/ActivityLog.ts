import { Schema, models, model, Types } from "mongoose";

export interface IActivityLog {
  admin: Types.ObjectId;
  action: string; // e.g. "created", "updated", "deleted", "status_changed"
  entityType: string; // e.g. "Car", "Booking", "Brand"
  entityId: Types.ObjectId;
  description: string; // human-readable summary, e.g. "Updated price for Toyota Camry"
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    admin: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: Schema.Types.ObjectId, required: true },
    description: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const ActivityLog =
  models.ActivityLog || model<IActivityLog>("ActivityLog", ActivityLogSchema);
export default ActivityLog;
