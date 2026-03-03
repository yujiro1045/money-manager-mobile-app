import { auth } from "@/api/firebase";
import { onAuthStateChanged, updateProfile, User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  updateUserProfile: (params: UpdateUserProfileParams) => Promise<void>;
};

interface UpdateUserProfileParams {
  displayName?: string;
  phoneNumber?: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  updateUserProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const updateUserProfile = async ({
    displayName,
    phoneNumber,
  }: UpdateUserProfileParams) => {
    if (!auth.currentUser) return;

    await updateProfile(auth.currentUser, {
      displayName,
    });

    setUser({
      ...auth.currentUser,
      displayName,
    } as User);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
