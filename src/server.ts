import "dotenv/config";

import cors from "cors";
import express from "express";

import roleRoutes from "./modules/roles/role.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import userRoleRoutes from "./modules/users/user-role.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import permissionRoutes from "./modules/permissions/permission.routes.js";

import enquiryRoutes from "./modules/foundation/enquiries/enquiry.routes.js";

import { errorHandler } from "./middleware/error-handler.js";
import studentRoutes from "./modules/foundation/students/student.routes.js";
import cookieParser from "cookie-parser";
const app = express();

const PORT = Number(process.env.PORT) || 4000;

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//   }),
// );
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://mekalarishifoundation.com",
  "https://www.mekalarishifoundation.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());


app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Platform API is running.",
  });
});

app.use("/api/roles", roleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/users", userRoleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/permissions", permissionRoutes);

app.use("/api/foundation/enquiries", enquiryRoutes);
app.use("/api/foundation/students", studentRoutes);

app.use(errorHandler);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Platform API running on port ${PORT}`);
});
