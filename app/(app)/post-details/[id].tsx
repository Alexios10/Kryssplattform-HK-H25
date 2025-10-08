import { useAuthSession } from "@/providers/authctx";
import { PostData } from "@/types/post";
import { getPostByLocalId, updatePostById } from "@/utils/local-storage";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";

export default function PostDetailsPage() {
  // Henter id fra urlen (eks: /post-details/123 -> id = 123)
  const { id } = useLocalSearchParams<{ id: string }>();

  // Henter brukernavn fra session
  const { userNameSession } = useAuthSession();

  const [post, setPost] = useState<PostData | null>(null);
  const [commentText, setCommentText] = useState("");

  // Henter innlegget fra local storage basert på id
  async function fetchPostFromLocal(inputId: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const postLocal = await getPostByLocalId(inputId);

    // Sjekker om postLocal ikke er null eller undefined
    if (postLocal) {
      setPost(postLocal);
    }
  }

  useEffect(() => {
    fetchPostFromLocal(id);
  }, [id]);

  // Viser en loader mens innlegget hentes
  if (post === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Henter innlegg</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Image style={styles.imageStyle} source={{ uri: post.imageUri }} />

      {/* Post tittel og beskrivelse */}
      <View style={styles.contentContainer}>
        <Text style={styles.titleStyle}>{post.title}</Text>
        <Text style={[styles.textStyle, { paddingTop: 6 }]}>
          {post.description}
        </Text>
      </View>

      {/* Kommentarer container */}
      <View style={styles.commentsContainer}>
        <Text style={styles.commentTitle}>Kommentarer</Text>
        <View style={styles.commentsList}>
          <FlatList
            data={post.comments}
            renderItem={(comment) => (
              <View
                style={{
                  flexDirection: "row",
                  gap: 6,
                  paddingVertical: 2,
                }}
              >
                <Text style={[styles.smallTextStyle, { color: "gray" }]}>
                  {comment.item.author}:
                </Text>
                <Text style={styles.smallTextStyle}>
                  {comment.item.comment}
                </Text>
              </View>
            )}
          />
        </View>
        <View style={styles.addCommentContainer}>
          <TextInput
            value={commentText}
            onChangeText={setCommentText}
            style={styles.commentTextField}
            placeholder="Skriv en kommentar"
          />
          <Pressable
            onPress={() => {
              const postComments = post.comments;
              postComments.push({
                comment: commentText,
                author: userNameSession ?? "Dette skal ikke skje",
              });
              const updatedPost: PostData = {
                ...post,
                comments: postComments,
              };
              updatePostById(id, updatedPost);
              setPost(updatedPost);
              setCommentText("");
            }}
          >
            <Text style={styles.smallTextStyle}>Legg til</Text>
          </Pressable>
        </View>
      </View>

      {/* Kartvisning */}
      <View
        style={{
          paddingHorizontal: 16,
          width: "100%",
          height: 250,
          marginTop: 16,
        }}
      >
        <MapView
          zoomEnabled={false}
          scrollEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
          initialRegion={{
            latitude: post.postCoordinates?.latitude ?? 0,
            longitude: post.postCoordinates?.longitude ?? 0,
            latitudeDelta: 0.0082,
            longitudeDelta: 0.0081,
          }}
          style={{ width: "100%", height: "100%" }}
        >
          <Marker
            coordinate={{
              latitude: post.postCoordinates?.latitude ?? 0,
              longitude: post.postCoordinates?.longitude ?? 0,
            }}
          >
            <Callout>
              <Text>Hei jeg er en callout</Text>
            </Callout>
          </Marker>
        </MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageStyle: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  titleStyle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  textStyle: {
    fontSize: 18,
  },
  smallTextStyle: {
    fontSize: 16,
  },
  postDataContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 16,
  },
  commentsContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  commentTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  commentsList: {
    maxHeight: 140,
    marginTop: 2,
  },
  addCommentContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  commentTextField: {
    borderBottomWidth: 1,
    borderColor: "gray",
    width: "70%",
    fontSize: 16,
  },
});
