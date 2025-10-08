import { PostData } from "@/types/post";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Funksjon for å lagre data i local storage
export async function storeData(key: string, value: string) {
  try {
    await AsyncStorage.setItem(key, value);
    console.log("Stored!");
  } catch (e) {
    console.log("Feil med storeData()" + e);
  }
}

// Funksjon for å hente data fra local storage
export async function getData(key: string) {
  try {
    const data = await AsyncStorage.getItem(key);
    if (data !== null) {
      console.log(data);
      return data;
    }
  } catch (e) {
    console.log("Feil med storeData()" + e);
  }
}

// Funksjon for å hente ut ett spesifikt innlegg basert på id
export async function getPostByLocalId(id: string) {
  try {
    const data = await AsyncStorage.getItem("postStore");
    if (data !== null) {
      const posts: PostData[] = JSON.parse(data);
      return posts.find((post) => post.id === id);
    }
  } catch (e) {
    console.log("Feil med getPostByIdLocal()", e);
  }
}

/**
 * Henter ut alle innlegg fra local storage, bytter ut innlegget der id = id med oppdatert versjon, og lagrer på nytt i local-storage
 * @param {string} id - Peker til hvilket innlegg i "databasen" som skal oppdateres.
 * @param {PostData} updatePost - Den oppdaterte versjonen av innlegget
 */

// Funksjon for å oppdatere ett spesifikt innlegg basert på id
export async function updatePostById(id: string, updatePost: PostData) {
  try {
    const data = await AsyncStorage.getItem("postStore");
    if (data !== null) {
      const posts: PostData[] = JSON.parse(data);

      // Her går vi gjenom en liste og endrer kun på den vi ønsker å endre
      // .map() returnerer en liste basert på kriteriene etter "=>"
      // Her går vi gjennom alle innleggene i listen og sjekker om de har samme id som den vi ga til funksjonen
      // Hvis det er samme id legger vi inn det oppdaterte innlegget
      // Hvis innlegget har ulik id legger vi det bare inn uten endring
      const updatedPosts = posts.map((exisitingPost) =>
        exisitingPost.id === id ? updatePost : exisitingPost
      );
      await AsyncStorage.setItem("postStore", JSON.stringify(updatedPosts));
    }
  } catch (e) {
    console.log("Feil med updatePostByid()", e);
  }
}
