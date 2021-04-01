import { v4 as uuidv4 } from "uuid";
import { createPost, deleteAllPosts } from "../../src/dataLayer/posts";
import { main } from "../../src/functions/updatePost/handler";
import { generateAPIGatewayProxyEvent } from "../utils/eventGeneration";

describe("Update Post Function", () => {
  let title: string,
    content: string,
    category: string,
    id: string,
    userId: string;

  const execute = async () => {
    const event = generateAPIGatewayProxyEvent({
      body: {
        title,
        content,
        category,
      },
      authorizer: {
        id: userId,
      },
      pathParameters: {
        id,
      },
    });
    return main(event);
  };

  beforeEach(async () => {
    title = "Updated Title";
    content = "Updated Content";
    category = "Education";
    userId = uuidv4();
    id = uuidv4();

    await createPost({
      id,
      category: "Sport",
      content: "Content",
      title: "Title",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId,
      imageUrl: "",
    });
  });

  afterEach(async () => {
    await deleteAllPosts();
  });

  it("should return 200 if inputs are valid", async () => {
    const res = await execute();

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toHaveProperty("title", title);
    expect(JSON.parse(res.body)).toHaveProperty("content", content);
    expect(JSON.parse(res.body)).toHaveProperty("category", category);
  });

  it("should return 400 if inputs are invalid", async () => {
    title = "";
    content = "";
    category = "Test";
    const res = await execute();

    expect(res.statusCode).toBe(400);
    expect(Object.keys(JSON.parse(res.body))).toEqual(
      expect.arrayContaining(["content", "category", "title"])
    );
  });

  it("should return 400 if postId is not a valid uuid", async () => {
    id = "";
    const res = await execute();

    expect(res.statusCode).toBe(400);
    expect(Object.keys(JSON.parse(res.body))).toEqual(
      expect.arrayContaining(["id"])
    );
  });

  it("should return 403 if user is not the author of the post", async () => {
    userId = "2";
    const res = await execute();

    expect(res.statusCode).toBe(403);
    expect(Object.keys(JSON.parse(res.body))).toEqual(
      expect.arrayContaining(["message"])
    );
  });

  it("should return 404 if post with the given id is not found", async () => {
    id = uuidv4();
    const res = await execute();

    expect(res.statusCode).toBe(404);
    expect(Object.keys(JSON.parse(res.body))).toEqual(
      expect.arrayContaining(["message"])
    );
  });
});
