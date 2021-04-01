import { v4 as uuidv4 } from "uuid";
import { createPost, deleteAllPosts } from "../../src/dataLayer/posts";
import { main } from "../../src/functions/getPost/handler";
import { generateAPIGatewayProxyEvent } from "../utils/eventGeneration";

describe("Get Post Function", () => {
  let id: string, userId: string;

  const execute = async () => {
    const event = generateAPIGatewayProxyEvent({
      body: null,
      pathParameters: {
        id,
      },
    });
    return main(event);
  };

  beforeEach(async () => {
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

  it("should return 200 if post is exist in the database", async () => {
    const res = await execute();

    expect(res.statusCode).toBe(200);
    expect(Object.keys(JSON.parse(res.body))).toEqual(
      expect.arrayContaining([
        "id",
        "content",
        "category",
        "title",
        "createdAt",
        "updatedAt",
        "userId",
        "imageUrl",
      ])
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

  it("should return 404 if post with the given id is not found", async () => {
    id = uuidv4();
    const res = await execute();

    expect(res.statusCode).toBe(404);
    expect(Object.keys(JSON.parse(res.body))).toEqual(
      expect.arrayContaining(["message"])
    );
  });
});
