import { PostData } from "@/types/post";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export type PostProps = {
  postData: PostData;
};

export default function Post({ postData }: PostProps) {
  return (
    // Hver Post er en Pressable komponent som navigerer til post-detaljer-siden når den trykkes på
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/post-details/[id]",
          params: { id: postData.id },
        })
      }
    >
      <View style={styles.postContainer}>
        {/* Post bilde */}
        <Image
          accessible={true}
          accessibilityLabel="Post image, navigate to post details"
          accessibilityRole="link"
          style={styles.postImage}
          source={{ uri: postData.imageUri }}
        />

        {/* Post tittel og beskrivelse */}
        <View style={styles.textContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.postTitle}>{postData.title}</Text>
          </View>
          <View style={styles.postDescriptionContainer}>
            <Text style={styles.postDescription}>{postData.description}</Text>
            <View style={styles.commentsContainer}>
              <Text style={styles.postDescription}>
                {postData.comments.length}
              </Text>
              <EvilIcons name="comment" size={24} color="gray" />
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: "white",
    shadowOffset: { width: 0, height: 6 },
    shadowColor: "black",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderRadius: 10,
  },
  postImage: {
    height: 250,
    width: "100%",
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    resizeMode: "cover",
  },
  textContainer: {
    paddingHorizontal: 10,
    paddingTop: 16,
    paddingBottom: 12,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  post: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  postDescription: {
    fontSize: 16,
    color: "gray",
  },
  postDescriptionContainer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  commentsContainer: {
    flexDirection: "row",
  },
});
