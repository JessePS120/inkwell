// server/src/events/listeners/count-published-posts.listener.js
//
// Second post.published listener (Workshop 9, Exercise 1). Keeps an
// in-memory count of posts published since the server started — added
// without touching PostService.publish(), which is the Observer payoff.

import { EventBus } from "../event-bus.js";

let postsPublished = 0;

EventBus.on("post.published", () => {
  postsPublished += 1;
});

export function getPostsPublishedCount() {
  return postsPublished;
}
