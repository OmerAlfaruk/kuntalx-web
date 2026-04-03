import { createContext, useContext, useState, type ReactNode, useEffect, useMemo } from 'react';
import { useToast } from './toast-context';
export interface User {
  id: string;
  phone: string;
  email?: string;
  fullName: string;
  role: 'buyer' | 'association_admin' | 'platform_admin' | 'farmer';
  profileId?: string;
  profileType?: 'farmer' | 'buyer' | 'association';
  preferredLanguage: string;
  associationId?: string;
  profilePictureUrl?: string;
  farmerData?: {
    defaultPayoutMethod?: string;
    payoutPaymentDetails?: string;
    isMiniAssociation?: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => Promise<void>;
  updateProfile: (data: { fullName?: string; email?: string; preferredLanguage?: string; farmerData?: any }) => Promise<void>;
  updatePin: (oldPin: string, newPin: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const toast = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // Check for existing auth tokens on app startup
      const accessToken = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');

      if (accessToken && userData) {
        try {
          // Optimistically set user from local storage
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);

          // Verify session with backend
          const { AuthRepositoryImpl } = await import('../features/auth/api/auth-repository-impl');
          const { GetMeUseCase } = await import('../features/auth/services/get-me-usecase');

          const repo = new AuthRepositoryImpl();
          const getMeUseCase = new GetMeUseCase(repo);

          const response = await getMeUseCase.execute();

          // Update user with fresh data from backend
          const updatedUser: User = {
            id: response.user.id,
            phone: response.user.phone,
            email: response.user.email,
            fullName: response.user.fullName,
            role: response.user.role as any,
            profileId: response.profileId,
            profileType: response.profileType,
            preferredLanguage: response.user.preferredLanguage,
            associationId: response.user.associationId,
            profilePictureUrl: response.user.profilePictureUrl,
            farmerData: response.user.farmerData ? {
              defaultPayoutMethod: response.user.farmerData.defaultPayoutMethod,
              payoutPaymentDetails: response.user.farmerData.payoutPaymentDetails,
              isMiniAssociation: response.user.farmerData.isMiniAssociation
            } : undefined
          };

          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);

        } catch (error) {
          console.error('Session verification failed:', error);
          // If 401, token is invalid/expired and refresh failed (handled by interceptor usually, but good to be safe)
          // For now, we can keep the user logged in if it's just a network error, 
          // or force logout if we are strict. 
          // Let's assume the interceptor handles 401s by clearing storage.
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (accessToken: string, refreshToken: string, user: User) => {
    localStorage.setItem('authToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const logout = async () => {
    try {
      const { AuthRepositoryImpl } = await import('../features/auth/api/auth-repository-impl');
      const { LogoutUseCase } = await import('../features/auth/services/logout-usecase');

      const repo = new AuthRepositoryImpl();
      const logoutUseCase = new LogoutUseCase(repo);

      await logoutUseCase.execute();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.clear();
      setUser(null);
      window.location.href = '/login';
    }
  };

  const updateProfile = async (data: { fullName?: string; email?: string; preferredLanguage?: string; farmerData?: any }) => {
    try {
      const { AuthRepositoryImpl } = await import('../features/auth/api/auth-repository-impl');
      const { UpdateProfileUseCase } = await import('../features/auth/services/update-profile-usecase');

      const repo = new AuthRepositoryImpl();
      const useCase = new UpdateProfileUseCase(repo);

      const response = await useCase.execute(data as any);

      if (user) {
        const updatedUser: User = {
          ...user,
          fullName: response.fullName,
          email: response.email,
          preferredLanguage: response.preferredLanguage,
          profilePictureUrl: response.profilePictureUrl,
          farmerData: response.farmerData ? {
            defaultPayoutMethod: response.farmerData.defaultPayoutMethod,
            payoutPaymentDetails: response.farmerData.payoutPaymentDetails,
            isMiniAssociation: response.farmerData.isMiniAssociation
          } : undefined
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.error('Update profile failed:', error);
      throw error;
    }
  };

  const updatePin = async (oldPin: string, newPin: string) => {
    try {
      const { AuthRepositoryImpl } = await import('../features/auth/api/auth-repository-impl');
      const { ChangePinUseCase } = await import('../features/auth/services/change-pin-usecase');

      const repo = new AuthRepositoryImpl();
      const useCase = new ChangePinUseCase(repo);

      await useCase.execute(oldPin, newPin);
      toast.success('PIN changed successfully');
    } catch (error) {
      console.error('Update pin failed:', error);
      throw error;
    }
  };

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    login,
    logout,
    updateProfile,
    updatePin,
    isLoading,
  }), [user, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}