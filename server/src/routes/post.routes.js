// server/src/routes/post.routes.js
//
// Wires PostService's publish(), listPublished() and search() to
// POST /api/posts and GET /api/posts. Thin routes: no business rules here.
import { Router } from "express";
import { PostService } from "../services/post.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/posts", requireAuth, async (req, res, next) => {
  try {
    // Never trust client-supplied identity fields: derive authorId
    // from the verified JWT (set by requireAuth), not the request body.
    const post = await PostService.publish({
      ...req.body,
      authorId: req.user.id,
    });
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
});

router.get("/posts", async (req, res, next) => {
  try {
    const { page = 1, search } = req.query;
    const result = search
      ? await PostService.search({ query: search, page: Number(page) })
      : await PostService.listPublished({ page: Number(page) });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
