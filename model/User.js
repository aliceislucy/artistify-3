const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new Schema(
  {
    username: String,
    email: { type: String, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/gdaconcept/image/upload/v1614762472/workshop-artistify/default-profile_tbiwcc.jpg",
    },
  },
  { timestamps: true }
);

const UsersModel = mongoose.model("users", usersSchema);

module.exports = UsersModel;
