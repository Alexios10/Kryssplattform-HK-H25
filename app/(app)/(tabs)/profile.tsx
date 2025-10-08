import { useAuthSession } from "@/providers/authctx";
import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function ProfilePage() {
  const [userNameText, setUserNameText] = useState("");
  const { userNameSession, signIn, signOut } = useAuthSession();

  return (
    <View style={style.mainContainer}>
      <Text>Her er profilsiden!</Text>
      {userNameSession !== null && <Text>Hei på deg {userNameSession}</Text>}
      <Text>
        Trykk
        {
          <Link style={style.link} href={"/declarations"}>
            her
          </Link>
        }
        for informasjon om appen
      </Text>
      <View style={style.textInputContainer}>
        <TextInput
          style={style.textInput}
          value={userNameText}
          placeholder="Tittel"
          onChangeText={setUserNameText}
        />
      </View>
      <View style={style.buttonContainer}>
        <Pressable
          style={[style.button, { borderWidth: 2, borderColor: "gray" }]}
          onPress={() => {
            signIn(userNameText);
          }}
        >
          <Text>Logg inn</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            signOut();
          }}
          style={[style.button, { backgroundColor: "gray" }]}
        >
          <Text>Logg ut</Text>
        </Pressable>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    textDecorationLine: "underline",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "50%",
    justifyContent: "space-between",
    // paddingHorizontal: 30,
    marginTop: 16,
  },
  textInputContainer: {
    gap: 16,
    alignItems: "center",
    width: "100%",
  },
  textInput: {
    borderBottomWidth: 1,
    width: "75%",
    fontSize: 18,
  },
  button: {
    // backgroundColor: "red",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
