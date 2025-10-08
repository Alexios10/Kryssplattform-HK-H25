import { LocationObjectCoords } from "expo-location";

export interface PostData {
  id: string;
  title: string;
  description: string;
  imageUri: string;
  comments: PostComment[];
  postCoordinates: LocationObjectCoords | null;
}

export interface PostComment {
  author: string;
  comment: string;
}
