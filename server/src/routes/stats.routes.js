// server/src/routes/stats.routes.js
//
// Exposes the in-memory publish counter at GET /api/stats.

import { Router } from "express";
import { getPostsPublishedCount } from "../events/listeners/count-published-posts.listener.js";

const router = Router();

router.get("/stats", (req, res) => {
  res.status(200).json({ postsPublished: getPostsPublishedCount() });
});

export default router;
