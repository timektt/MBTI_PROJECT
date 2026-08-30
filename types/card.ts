export type CardItem = {
  id: string;
  userId: string;
  title: string;
  description: string;
  imageUrl: string;
  visibility: string;
  createdAt: string;
  updatedAt: string;
  mbtiType: string;
  user: {
    id: string;
    name?: string | null;
    username?: string | null;
    image?: string | null;
  };
  likes: { id: string }[];
  comments: { id: string }[];
};
