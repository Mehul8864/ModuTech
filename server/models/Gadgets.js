import mongoose from "mongoose";

const gadgetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    creator: {
      type: String,
      trim: true,
      default: "",
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

gadgetSchema.index({ createdAt: -1 });

gadgetSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Gadget = mongoose.model("Gadget", gadgetSchema);
export default Gadget;
