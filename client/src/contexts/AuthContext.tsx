// client/src/contexts/AuthContext.tsx

import React, { useEffect, useState, createContext, useContext } from 'react';
import { auth } from '../config/firebaseConfig';
import { User, onAuthStateChanged, getIdTokenResult } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          await firebaseUser.getIdToken(true); // force refresh to get latest claims
          const tokenResult = await getIdTokenResult(firebaseUser);
          setIsAdmin(!!tokenResult.claims.admin);
          setUser(firebaseUser);
        } catch (error) {
          console.error('Error getting token result:', error);
          setUser(null);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
