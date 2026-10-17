import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import {
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
} from 'firebase/firestore';
import { auth, db, googleProvider, signInWithPopup, signOut, testConnection, handleFirestoreError, OperationType } from '../firebase';
import { Flashcard, LessonFolder, SyncStatus, UserProfile } from '../types';
import { STARTER_SEED_FOLDERS } from '../data/lessons';

interface AuthDataContextType {
  user: User | null;
  authLoading: boolean;
  profile: UserProfile | null;
  profileLoading: boolean;
  folders: LessonFolder[];
  cards: Flashcard[];
  syncStatus: SyncStatus;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  saveUsername: (username: string) => Promise<void>;
  updateProfileSettings: (settings: Partial<Pick<UserProfile, 'username' | 'accentColor' | 'customCursor'>>) => Promise<void>;
  createFolder: (lessonId: number, name: string) => Promise<string>;
  updateFolder: (folderId: string, name: string) => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>;
  createCard: (lessonId: number, folderId: string, question: string, answer: string) => Promise<string>;
  updateCard: (cardId: string, question: string, answer: string) => Promise<void>;
  deleteCard: (cardId: string, folderId: string) => Promise<void>;
  saveGameSessionResults: (
    folderId: string,
    percentage: number,
    cardResults: { cardId: string; isCorrect: boolean; timeSpentMs: number }[]
  ) => Promise<void>;
  seedStarterDecks: () => Promise<void>;
}

const AuthDataContext = createContext<AuthDataContextType | undefined>(undefined);

export const AuthDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState<boolean>(true);
  const [folders, setFolders] = useState<LessonFolder[]>([]);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');
  const pendingOperationsRef = useRef<number>(0);

  // Connection test on boot
  useEffect(() => {
    testConnection();
  }, []);

  // Online / offline detector
  useEffect(() => {
    const handleOnline = () => {
      if (pendingOperationsRef.current > 0) {
        setSyncStatus('saving');
      } else {
        setSyncStatus('synced');
      }
    };
    const handleOffline = () => {
      setSyncStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (!navigator.onLine) {
      setSyncStatus('offline');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const setSaving = useCallback((isSaving: boolean) => {
    if (!navigator.onLine) {
      setSyncStatus('offline');
      return;
    }
    if (isSaving) {
      pendingOperationsRef.current += 1;
      setSyncStatus('saving');
    } else {
      pendingOperationsRef.current = Math.max(0, pendingOperationsRef.current - 1);
      if (pendingOperationsRef.current === 0) {
        setSyncStatus('synced');
      }
    }
  }, []);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (!currentUser) {
        setProfile(null);
        setProfileLoading(false);
        setFolders([]);
        setCards([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Profile and data listener for authenticated user
  useEffect(() => {
    if (!user) {
      setProfileLoading(false);
      return;
    }

    setProfileLoading(true);
    const userDocRef = doc(db, 'users', user.uid);

    // Profile listener
    const unsubProfile = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          setProfile(null);
        }
        setProfileLoading(false);
      },
      (error) => {
        setProfileLoading(false);
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      }
    );

    // Folders listener
    const foldersColRef = collection(db, 'users', user.uid, 'folders');
    const unsubFolders = onSnapshot(
      foldersColRef,
      (snapshot) => {
        const fetched: LessonFolder[] = [];
        snapshot.forEach((d) => {
          fetched.push(d.data() as LessonFolder);
        });
        // Sort by creation or update
        fetched.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        setFolders(fetched);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/folders`);
      }
    );

    // Cards listener
    const cardsColRef = collection(db, 'users', user.uid, 'cards');
    const unsubCards = onSnapshot(
      cardsColRef,
      (snapshot) => {
        const fetchedCards: Flashcard[] = [];
        snapshot.forEach((d) => {
          fetchedCards.push(d.data() as Flashcard);
        });
        // Sort by updatedAt descending
        fetchedCards.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        setCards(fetchedCards);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/cards`);
      }
    );

    return () => {
      unsubProfile();
      unsubFolders();
      unsubCards();
    };
  }, [user]);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google Sign In failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setProfile(null);
      setFolders([]);
      setCards([]);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const saveUsername = async (username: string) => {
    if (!user) return;
    setSaving(true);
    const path = `users/${user.uid}`;
    try {
      const trimmed = username.trim().slice(0, 50);
      const newProfile: UserProfile = {
        id: user.uid,
        username: trimmed || user.displayName || 'ජීව විද්‍යා මිතුරා',
        email: user.email || '',
        accentColor: 'emerald',
        customCursor: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', user.uid), newProfile);
      setProfile(newProfile);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setSaving(false);
    }
  };

  const updateProfileSettings = async (settings: Partial<Pick<UserProfile, 'username' | 'accentColor' | 'customCursor'>>) => {
    if (!user || !profile) return;
    setSaving(true);
    const path = `users/${user.uid}`;
    try {
      const updated: Partial<UserProfile> = {
        ...settings,
        updatedAt: new Date().toISOString(),
      };
      await updateDoc(doc(db, 'users', user.uid), updated);
      setProfile((prev) => (prev ? { ...prev, ...updated } : null));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    } finally {
      setSaving(false);
    }
  };

  const createFolder = async (lessonId: number, name: string): Promise<string> => {
    if (!user) throw new Error('Not signed in');
    setSaving(true);
    const folderId = 'fld_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const path = `users/${user.uid}/folders/${folderId}`;
    try {
      const now = new Date().toISOString();
      const newFolder: LessonFolder = {
        id: folderId,
        userId: user.uid,
        lessonId,
        name: name.trim().slice(0, 100),
        cardCount: 0,
        lastPercentage: null,
        lastPlayedAt: null,
        createdAt: now,
        updatedAt: now,
      };
      await setDoc(doc(db, 'users', user.uid, 'folders', folderId), newFolder);
      return folderId;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      return folderId;
    } finally {
      setSaving(false);
    }
  };

  const updateFolder = async (folderId: string, name: string) => {
    if (!user) return;
    setSaving(true);
    const path = `users/${user.uid}/folders/${folderId}`;
    try {
      await updateDoc(doc(db, 'users', user.uid, 'folders', folderId), {
        name: name.trim().slice(0, 100),
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    } finally {
      setSaving(false);
    }
  };

  const deleteFolder = async (folderId: string) => {
    if (!user) return;
    setSaving(true);
    const folderPath = `users/${user.uid}/folders/${folderId}`;
    try {
      // Delete the folder doc
      await deleteDoc(doc(db, 'users', user.uid, 'folders', folderId));

      // Batch delete associated cards
      const folderCards = cards.filter((c) => c.folderId === folderId);
      if (folderCards.length > 0) {
        const batch = writeBatch(db);
        folderCards.forEach((c) => {
          batch.delete(doc(db, 'users', user.uid, 'cards', c.id));
        });
        await batch.commit();
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, folderPath);
    } finally {
      setSaving(false);
    }
  };

  const createCard = async (lessonId: number, folderId: string, question: string, answer: string): Promise<string> => {
    if (!user) throw new Error('Not signed in');
    setSaving(true);
    const cardId = 'crd_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const path = `users/${user.uid}/cards/${cardId}`;
    try {
      const now = new Date().toISOString();
      const newCard: Flashcard = {
        id: cardId,
        userId: user.uid,
        folderId,
        lessonId,
        question: question.trim().slice(0, 3000),
        answer: answer.trim().slice(0, 3000),
        lastResult: 'unplayed',
        lastTimeSpentMs: 0,
        playCount: 0,
        createdAt: now,
        updatedAt: now,
      };

      await setDoc(doc(db, 'users', user.uid, 'cards', cardId), newCard);

      // Increment card count in folder
      const targetFolder = folders.find((f) => f.id === folderId);
      if (targetFolder) {
        await updateDoc(doc(db, 'users', user.uid, 'folders', folderId), {
          cardCount: (targetFolder.cardCount || 0) + 1,
          updatedAt: now,
        });
      }

      return cardId;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      return cardId;
    } finally {
      setSaving(false);
    }
  };

  const updateCard = async (cardId: string, question: string, answer: string) => {
    if (!user) return;
    setSaving(true);
    const path = `users/${user.uid}/cards/${cardId}`;
    try {
      await updateDoc(doc(db, 'users', user.uid, 'cards', cardId), {
        question: question.trim().slice(0, 3000),
        answer: answer.trim().slice(0, 3000),
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    } finally {
      setSaving(false);
    }
  };

  const deleteCard = async (cardId: string, folderId: string) => {
    if (!user) return;
    setSaving(true);
    const path = `users/${user.uid}/cards/${cardId}`;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'cards', cardId));

      const targetFolder = folders.find((f) => f.id === folderId);
      if (targetFolder) {
        await updateDoc(doc(db, 'users', user.uid, 'folders', folderId), {
          cardCount: Math.max(0, (targetFolder.cardCount || 1) - 1),
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    } finally {
      setSaving(false);
    }
  };

  const saveGameSessionResults = async (
    folderId: string,
    percentage: number,
    cardResults: { cardId: string; isCorrect: boolean; timeSpentMs: number }[]
  ) => {
    if (!user) return;
    setSaving(true);
    const folderPath = `users/${user.uid}/folders/${folderId}`;
    try {
      const now = new Date().toISOString();
      const batch = writeBatch(db);

      // Update folder stats
      const folderRef = doc(db, 'users', user.uid, 'folders', folderId);
      batch.update(folderRef, {
        lastPercentage: Math.round(percentage),
        lastPlayedAt: now,
        updatedAt: now,
      });

      // Update each card stats
      cardResults.forEach((res) => {
        const cardRef = doc(db, 'users', user.uid, 'cards', res.cardId);
        const existingCard = cards.find((c) => c.id === res.cardId);
        batch.update(cardRef, {
          lastResult: res.isCorrect ? 'correct' : 'wrong',
          lastTimeSpentMs: res.timeSpentMs,
          playCount: (existingCard?.playCount || 0) + 1,
          updatedAt: now,
        });
      });

      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, folderPath);
    } finally {
      setSaving(false);
    }
  };

  const seedStarterDecks = async () => {
    if (!user) return;
    setSaving(true);
    try {
      for (const item of STARTER_SEED_FOLDERS) {
        const folderId = await createFolder(item.lessonId, item.name);
        for (const c of item.cards) {
          await createCard(item.lessonId, folderId, c.question, c.answer);
        }
      }
    } catch (error) {
      console.error('Error seeding starter decks:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthDataContext.Provider
      value={{
        user,
        authLoading,
        profile,
        profileLoading,
        folders,
        cards,
        syncStatus,
        loginWithGoogle,
        logout,
        saveUsername,
        updateProfileSettings,
        createFolder,
        updateFolder,
        deleteFolder,
        createCard,
        updateCard,
        deleteCard,
        saveGameSessionResults,
        seedStarterDecks,
      }}
    >
      {children}
    </AuthDataContext.Provider>
  );
};

export const useAuthData = () => {
  const context = useContext(AuthDataContext);
  if (!context) {
    throw new Error('useAuthData must be used within AuthDataProvider');
  }
  return context;
};
