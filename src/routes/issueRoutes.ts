import { Router } from "express";
import {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  getIssuesByUserId,
} from "../controllers/issueController";
import { upload } from "../middleware/cloudinaryUpload";

const router = Router();

router.post(
    "/",
    upload.fields([
      { name: "photo", maxCount: 1 },
      { name: "video", maxCount: 1 },
    ]),
    createIssue
  );
router.get("/", getIssues);
router.get("/:id", getIssueById);
router.get("/user/:userId", getIssuesByUserId);
router.put("/:id", updateIssue);
router.delete("/:id", deleteIssue);

export default router;


// {
  
//     "description": "Pothole bus train stand",
//     "location": "Anna Nagar, Chennai",
//     "type": "POTHOLE",
//     "photo": "https://res.cloudinary.com/.../pothole.jpg",
//     "video": null,
//     "userId": 1
//   }
  
