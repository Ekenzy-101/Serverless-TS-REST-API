export interface Post {
  id: string;
  category: string;
  createdAt: string;
  content: string;
  imageUrl: string;
  title: string;
  updatedAt: string;
  userId: string;
}

export enum PostCategory {
  Education = "Education",
  Sport = "Sport",
  Politics = "Politics",
}
