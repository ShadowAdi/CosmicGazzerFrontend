import { BACKEND_URL } from "@/constants";
import { AuthContextType, UserInterface } from "@/types";
import { createContext, ReactNode, useEffect, useState } from "react";
import { Alert } from "react-native";

export const AuthContextProvider = createContext<AuthContextType>({
  loading: false,
  setLoading: () => {},
  user: null,
  setUser: () => {},
  token: null,
  setToken: () => {},
  message: null,
  setMessage: () => {},
  fetchUser: async () => {},
});

export const AuthStoreProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserInterface | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchUser = async (token: string) => {
    setLoading(true);
    try {
       const response = await fetch(`${BACKEND_URL}auth/login`, {
      method: "GET",
      headers: {
        Authorization: "BEARER " + token,
      },
    });
    const data = await response.json();
    const { success, message, user } = data;
    if (success) {
      setUser(user);
    } else {
      setMessage(message);
      Alert.alert("Failed to get the token ", token);
    }
    } catch (error:any) {
      setMessage(error)
            Alert.alert("Error in getting user ", error);
    }
    finally{
      setLoading(false)
    }
   
  };

  useEffect(() => {
    if (token) {
      fetchUser(token);
    }
  }, [token]);

  return (
    <AuthContextProvider.Provider
      value={{
        loading,
        setLoading,
        user,
        setUser,
        message,
        setMessage,
        token,
        setToken,
        fetchUser,
      }}
    >
      {children}
    </AuthContextProvider.Provider>
  );
};
