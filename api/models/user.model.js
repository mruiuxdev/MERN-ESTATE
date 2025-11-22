import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://thumbs.dreamstime.com/b/faceless-male-avatar-hoodie-illustration-minimalist-default-photo-placeholder-wearing-light-gray-background-ideal-377566416.jpg",
    },
  },
  { timestamps: true }
);

const User = new model("User", userSchema);

export default User;
