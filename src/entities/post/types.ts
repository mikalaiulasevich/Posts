export type ApiPost = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export type PostListItem = {
  id: number;
  userId: number;
  title: string;
  body: string;
  thumbnailUrl: string;
};

export type PostDetails = {
  id: number;
  userId: number;
  title: string;
  body: string;
  imageUrl: string;
};
