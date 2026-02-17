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
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        imageUrl: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

/* Index for fast latest gadgets listing */
gadgetSchema.index({ createdAt: -1 });

/* Clean response */
gadgetSchema.set("toJSON", {
    transform: (_, ret) => {
        delete ret.__v;
        return ret;
    },
});

const Gadget = mongoose.model("Gadget", gadgetSchema);

export default Gadget;
