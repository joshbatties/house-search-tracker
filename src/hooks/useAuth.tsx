
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

type AuthContextType = {
  session: Session | null;
  isLoading: boolean;
  anonymousId: string | null;
  propertyCount: number;
  incrementPropertyCount: () => void;
  isAnonymousLimitReached: boolean;
};

const LOCAL_STORAGE_ANONYMOUS_ID = "anonymousId";
const LOCAL_STORAGE_PROPERTY_COUNT = "propertyCount";
const ANONYMOUS_PROPERTY_LIMIT = 10;

const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
  anonymousId: null,
  propertyCount: 0,
  incrementPropertyCount: () => {},
  isAnonymousLimitReached: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [anonymousId, setAnonymousId] = useState<string | null>(null);
  const [propertyCount, setPropertyCount] = useState(0);
  
  useEffect(() => {
    // Initialize anonymous ID if not already set
    const storedAnonymousId = localStorage.getItem(LOCAL_STORAGE_ANONYMOUS_ID);
    const storedPropertyCount = localStorage.getItem(LOCAL_STORAGE_PROPERTY_COUNT);
    
    if (!storedAnonymousId) {
      const newAnonymousId = uuidv4();
      localStorage.setItem(LOCAL_STORAGE_ANONYMOUS_ID, newAnonymousId);
      setAnonymousId(newAnonymousId);
    } else {
      setAnonymousId(storedAnonymousId);
    }
    
    if (storedPropertyCount) {
      setPropertyCount(parseInt(storedPropertyCount, 10));
    }

    // Get the current session
    const getInitialSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const incrementPropertyCount = () => {
    if (!session) {
      const newCount = propertyCount + 1;
      setPropertyCount(newCount);
      localStorage.setItem(LOCAL_STORAGE_PROPERTY_COUNT, newCount.toString());
    }
  };

  const isAnonymousLimitReached = !session && propertyCount >= ANONYMOUS_PROPERTY_LIMIT;

  return (
    <AuthContext.Provider 
      value={{ 
        session, 
        isLoading, 
        anonymousId, 
        propertyCount, 
        incrementPropertyCount,
        isAnonymousLimitReached
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
