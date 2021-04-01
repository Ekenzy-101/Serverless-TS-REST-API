import { deleteAllPosts } from "../../src/dataLayer/posts";
import { main } from "../../src/functions/createPost/handler";
import { generateAPIGatewayProxyEvent } from "../utils/eventGeneration";

describe("Create Post Function", () => {
  let title: string, content: string, category: string;

  const execute = async () => {
    const event = generateAPIGatewayProxyEvent({
      body: {
        title,
        content,
        category,
      },
      authorizer: {
        id: "1",
      },
    });
    return main(event);
  };

  beforeEach(() => {
    title = "Title";
    (content = "Content"), (category = "Education");
  });

  afterEach(async () => {
    await deleteAllPosts();
  });

  it("should return 201 if inputs are valid", async () => {
    const res = await execute();

    expect(res.statusCode).toBe(201);
    expect(Object.keys(JSON.parse(res.body))).toEqual(
      expect.arrayContaining([
        "id",
        "content",
        "category",
        "title",
        "createdAt",
        "updatedAt",
        "userId",
      ])
    );
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
});
