import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";

const tourTypeSchema = new Schema<ITourType>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const TourType = model<ITourType>("TourType", tourTypeSchema);

const tourSchema = new Schema<ITour>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    location: { type: String, required: true },
    costFrom: { type: Number, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    included: { type: [String], required: true },
    excluded: { type: [String], required: true },
    amenities: { type: [String], required: true },
    tourPlan: { type: [String], default: [], required: true },
    maxGuest: { type: Number, required: true },
    minAge: { type: Number, required: true },
    division: { type: Schema.Types.ObjectId, ref: "Division", required: true },
    tourType: { type: Schema.Types.ObjectId, ref: "TourType", required: true },
  },
  { timestamps: true, versionKey: false }
);

export const Tour = model<ITour>("Tour", tourSchema);
