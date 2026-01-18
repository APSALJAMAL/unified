import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  signoutUser,
  getCurrentUser,
  updateDistrict,
} from "../controllers/userController.ts";
import { auth } from "../middleware/auth.ts";

const router = express.Router();

router.post("/", createUser);            // register
router.post("/login", loginUser);        // login
router.get("/me", auth, getCurrentUser);
router.patch("/me/district", auth, updateDistrict);
router.get("/", auth, getUsers);
router.get("/:id", auth, getUserById);
router.put("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);

router.post("/signout", signoutUser);    // frontend clears token


export default router;


// {
//     "full_name": "Raju Singh",
//     "mobile_number": "9000000005",
//     "aadhar_number": "555555555555",
//     "password": "test5",
//     "role": "USER"
// }


// {

//   "mobile_number": "9000000000",
//   "password": "test"
// }