import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthContextType = {
  signIn: (userName: string) => void;
  signOut: VoidFunction;
  userNameSession?: string | null;
  isLoading: boolean;
};

// Oppretter en kontekst for autentisering
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook for å bruke autentiseringskonteksten
export function useAuthSession() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error(
      "UseAuthSession must be used within an AuthContext Provider"
    );
  }

  return value;
}

// Provider-komponent som håndterer autentiseringstilstand og funksjoner
export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [userSession, setUserSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  // Sjekker om det finnes en lagret brukerøkt ved komponentens montering
  useEffect(() => {
    AsyncStorage.getItem("authSession").then((value) => {
      setUserSession(value);
      setIsLoading(false);
    });
  }, []);

  return (
    <AuthContext
      value={{
        signIn: (userName: string) => {
          setUserSession(userName);
          AsyncStorage.setItem("authSession", userName);
          router.replace("/");
        },
        signOut: () => {
          setUserSession(null);
          AsyncStorage.removeItem("authSession");
        },
        userNameSession: userSession,
        isLoading: isLoading,
      }}
    >
      {children}
    </AuthContext>
  );
}
