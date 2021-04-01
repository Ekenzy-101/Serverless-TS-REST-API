import { PostCategory } from "../../utils/types/post";

const { Education, Sport, Politics } = PostCategory;

export const postSchema = {
  category: {
    type: "enum",
    trim: true,
    values: [Education, Sport, Politics],
    messages: {
      enumValue: "Category must be an value of the given options {expected}",
      required: "Category must be an value of the given options {expected}",
    },
  },
  content: {
    type: "string",
    empty: false,
    trim: true,
    messages: {
      required: "Content is required",
      stringEmpty: "Content is required",
    },
  },
  title: {
    type: "string",
    empty: false,
    trim: true,
    messages: {
      required: "Title is required",
      stringEmpty: "Title is required",
    },
  },
};

export const idSchema = {
  id: {
    type: "uuid",
    messages: { uuid: "Id is not a valid uuid" },
  },
};
