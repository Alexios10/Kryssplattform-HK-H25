// Clean rebuild of posts-service to fix previous merge issues
import { PostComment, PostData } from "@/types/post";
import * as FileSystem from "expo-file-system/legacy";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage";
import { Platform } from "react-native";
import { db, storage } from "./firebase";

export type PostRecord = PostData & { createdAt?: any };

const POSTS = "posts";

export function subscribeToPosts(
  handler: (posts: PostRecord[]) => void
): () => void {
  const q = query(collection(db, POSTS), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const items: PostRecord[] = snap.docs.map((d) => ({
      ...(d.data() as PostRecord),
      id: d.id,
    }));
    handler(items);
  });
}

export function subscribeToPost(
  id: string,
  handler: (post: PostRecord | null) => void
): () => void {
  const refDoc = doc(db, POSTS, id);
  return onSnapshot(refDoc, (d) => {
    if (!d.exists()) return handler(null);
    handler({ ...(d.data() as PostRecord), id: d.id });
  });
}

export async function addCommentToPost(id: string, comment: PostComment) {
  const refDoc = doc(db, POSTS, id);
  const snap = await getDoc(refDoc);
  if (!snap.exists()) return;
  const current = snap.data() as PostRecord;
  const next = { ...current, comments: [...(current.comments ?? []), comment] };
  await updateDoc(refDoc, { comments: next.comments });
}

export async function createPost(
  partial: Omit<PostData, "id" | "comments"> & { comments?: PostComment[] } & {
    imageUri: string;
  }
) {
  const url = await uploadImageAndGetUrl(partial.imageUri);
  const payload: Omit<PostRecord, "id"> = {
    title: partial.title,
    description: partial.description,
    imageUri: url,
    postCoordinates: partial.postCoordinates ?? null,
    comments: partial.comments ?? [],
    createdAt: serverTimestamp(),
  };
  const created = await addDoc(collection(db, POSTS), payload);
  return created.id;
}

async function uploadImageAndGetUrl(localUri: string): Promise<string> {
  if (/^https?:\/\//i.test(localUri)) return localUri;

  const filename = makeImageFilename(localUri);
  const storageRef = ref(storage, filename);

  if (Platform.OS === "web") {
    const response = await fetch(localUri);
    const blob = await response.blob();
    await uploadBytes(storageRef, blob, {
      contentType: blob.type || guessContentType(localUri) || undefined,
    });
    return await getDownloadURL(storageRef);
  } else {
    const base64 = await FileSystem.readAsStringAsync(localUri, {
      encoding: "base64" as any,
    });
    await uploadString(storageRef, base64, "base64", {
      contentType: guessContentType(localUri) || "image/jpeg",
    });
    return await getDownloadURL(storageRef);
  }
}

function makeImageFilename(uri: string) {
  const ext = uri.split(".").pop()?.split("?")[0] || "jpg";
  return `images/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
}

function guessContentType(uri: string): string | null {
  const ext = uri.split(".").pop()?.toLowerCase().split("?")[0];
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "heic":
    case "heif":
      return "image/heic";
    case "webp":
      return "image/webp";
    default:
      return null;
  }
}
