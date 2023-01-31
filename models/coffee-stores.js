import mongoose from "mongoose";

const coffeeStoresSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String },
    address: { type: String },
    neighbourhood: { type: String },
    voting: { type: Number, default: 0 },
    imgUrl: { type: String },
  },
  {
    timestamps: true,
  }
);

const coffeeStores =
  mongoose.models.coffeeStores ||
  mongoose.model("coffeeStores", coffeeStoresSchema);

export default coffeeStores;
