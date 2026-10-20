// server/src/services/__tests__/post.service.test.js

import { jest } from "@jest/globals";

const mockPostRepository = {
  createWithTags: jest.fn(),
  searchPublished: jest.fn(),
};
const mockEventBus = { emit: jest.fn() };

jest.unstable_mockModule("../../repositories/post.repository.js", () => ({
  PostRepository: mockPostRepository,
}));
jest.unstable_mockModule("../../events/event-bus.js", () => ({
  EventBus: mockEventBus,
}));

const { PostService } = await import("../post.service.js");

test("publish() creates a PUBLISHED post and emits post.published", async () => {
  mockPostRepository.createWithTags.mockResolvedValue({
    id: "p1",
    title: "Hello",
    status: "PUBLISHED",
  });

  const post = await PostService.publish({
    authorId: "u1",
    title: "Hello",
    body: "World",
  });

  expect(post.status).toBe("PUBLISHED");
  expect(mockEventBus.emit).toHaveBeenCalledWith(
    "post.published",
    expect.objectContaining({ postId: "p1" }),
  );
});

test("publish() rejects an empty title", async () => {
  await expect(
    PostService.publish({ authorId: "u1", title: "", body: "World" }),
  ).rejects.toThrow();
});

describe("PostService.search", () => {
  test("uses default page = 1 and pageSize = 10 when none are supplied", async () => {
    mockPostRepository.searchPublished.mockResolvedValue({
      posts: [],
      hasMore: false,
    });

    await PostService.search({ query: "react" });

    expect(mockPostRepository.searchPublished).toHaveBeenCalledWith({
      query: "react",
      page: 1,
      pageSize: 10,
    });
  });

  test("returns an empty posts array when nothing matches", async () => {
    mockPostRepository.searchPublished.mockResolvedValue({
      posts: [],
      hasMore: false,
    });

    const result = await PostService.search({ query: "test_query" });

    expect(result.posts).toEqual([]);
    expect(result.hasMore).toBe(false);
  });

  test("returns the matching post when only one match post exists", async () => {
    mockPostRepository.searchPublished.mockResolvedValue({
      posts: [{ id: "test", title: "Using React" }],
      hasMore: false,
    });

    const result = await PostService.search({ query: "react" });

    expect(result.posts).toEqual([{ id: "test", title: "Using React" }]);
    expect(result.hasMore).toBe(false);
  });

  test("returns every matching post when multiple matching posts exist", async () => {
    mockPostRepository.searchPublished.mockResolvedValue({
      posts: [
        { id: "test1", title: "Using React" },
        { id: "test2", title: "Programming With React" },
      ],
      hasMore: false,
    });

    const result = await PostService.search({ query: "react" });

    expect(result.posts).toEqual([
      { id: "test1", title: "Using React" },
      { id: "test2", title: "Programming With React" },
    ]);
    expect(result.hasMore).toBe(false);
  });
});