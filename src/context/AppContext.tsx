import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { storage, UserData, MoodEntry, JournalEntry, ThoughtRecord, ActivityPlan, Goal, Habit, CrisisContact, SafetyPlan } from '../utils/storage';

interface AppState {
  userData: UserData;
  isLoading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_USER_DATA'; payload: UserData }
  | { type: 'UPDATE_PROFILE'; payload: Partial<UserData['profile']> }
  | { type: 'ADD_MOOD_ENTRY'; payload: Omit<MoodEntry, 'id'> }
  | { type: 'ADD_JOURNAL_ENTRY'; payload: Omit<JournalEntry, 'id' | 'date'> }
  | { type: 'ADD_THOUGHT_RECORD'; payload: Omit<ThoughtRecord, 'id' | 'date'> }
  | { type: 'ADD_ACTIVITY_PLAN'; payload: Omit<ActivityPlan, 'id' | 'date'> }
  | { type: 'ADD_GOAL'; payload: Omit<Goal, 'id'> }
  | { type: 'UPDATE_GOAL'; payload: { id: string; updates: Partial<Goal> } }
  | { type: 'ADD_HABIT'; payload: Omit<Habit, 'id'> }
  | { type: 'UPDATE_HABIT'; payload: { id: string; updates: Partial<Habit> } }
  | { type: 'ADD_CRISIS_CONTACT'; payload: Omit<CrisisContact, 'id'> }
  | { type: 'UPDATE_SAFETY_PLAN'; payload: Partial<SafetyPlan> }
  | { type: 'CLEAR_ALL_DATA' };

const initialState: AppState = {
  userData: storage.getDefaultData(),
  isLoading: true,
  error: null
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'LOAD_USER_DATA':
      return { ...state, userData: action.payload, isLoading: false };
    
    case 'UPDATE_PROFILE':
      const updatedProfile = { ...state.userData.profile, ...action.payload };
      const updatedUserData = { ...state.userData, profile: updatedProfile };
      storage.saveUserData(updatedUserData);
      return { ...state, userData: updatedUserData };
    
    case 'ADD_MOOD_ENTRY':
      const newUserData = storage.addMoodEntry(action.payload);
      return { ...state, userData: newUserData };
    
    case 'ADD_JOURNAL_ENTRY':
      const journalData = storage.addJournalEntry(action.payload);
      return { ...state, userData: journalData };
    
    case 'ADD_THOUGHT_RECORD':
      const thoughtData = storage.addThoughtRecord(action.payload);
      return { ...state, userData: thoughtData };
    
    case 'ADD_ACTIVITY_PLAN':
      const activityData = storage.addActivityPlan(action.payload);
      return { ...state, userData: activityData };
    
    case 'ADD_GOAL':
      const goalData = storage.addGoal(action.payload);
      return { ...state, userData: goalData };
    
    case 'UPDATE_GOAL':
      const updatedGoalData = storage.updateGoal(action.payload.id, action.payload.updates);
      return { ...state, userData: updatedGoalData };
    
    case 'ADD_HABIT':
      const habitData = storage.addHabit(action.payload);
      return { ...state, userData: habitData };
    
    case 'UPDATE_HABIT':
      const updatedHabitData = storage.updateHabit(action.payload.id, action.payload.updates);
      return { ...state, userData: updatedHabitData };
    
    case 'ADD_CRISIS_CONTACT':
      const contactData = storage.addCrisisContact(action.payload);
      return { ...state, userData: contactData };
    
    case 'UPDATE_SAFETY_PLAN':
      const safetyData = storage.updateSafetyPlan(action.payload);
      return { ...state, userData: safetyData };
    
    case 'CLEAR_ALL_DATA':
      storage.clearAllData();
      return { ...state, userData: storage.getDefaultData() };
    
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Convenience methods
  updateProfile: (profile: Partial<UserData['profile']>) => void;
  addMoodEntry: (entry: Omit<MoodEntry, 'id'>) => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'date'>) => void;
  addThoughtRecord: (record: Omit<ThoughtRecord, 'id' | 'date'>) => void;
  addActivityPlan: (plan: Omit<ActivityPlan, 'id' | 'date'>) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  addHabit: (habit: Omit<Habit, 'id'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  addCrisisContact: (contact: Omit<CrisisContact, 'id'>) => void;
  updateSafetyPlan: (updates: Partial<SafetyPlan>) => void;
  clearAllData: () => void;
  exportData: () => string;
  importData: (jsonData: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load user data on mount
  useEffect(() => {
    try {
      const userData = storage.loadUserData();
      dispatch({ type: 'LOAD_USER_DATA', payload: userData });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load user data' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Convenience methods
  const updateProfile = (profile: Partial<UserData['profile']>) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: profile });
  };

  const addMoodEntry = (entry: Omit<MoodEntry, 'id'>) => {
    dispatch({ type: 'ADD_MOOD_ENTRY', payload: entry });
  };

  const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'date'>) => {
    dispatch({ type: 'ADD_JOURNAL_ENTRY', payload: entry });
  };

  const addThoughtRecord = (record: Omit<ThoughtRecord, 'id' | 'date'>) => {
    dispatch({ type: 'ADD_THOUGHT_RECORD', payload: record });
  };

  const addActivityPlan = (plan: Omit<ActivityPlan, 'id' | 'date'>) => {
    dispatch({ type: 'ADD_ACTIVITY_PLAN', payload: plan });
  };

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    dispatch({ type: 'ADD_GOAL', payload: goal });
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    dispatch({ type: 'UPDATE_GOAL', payload: { id, updates } });
  };

  const addHabit = (habit: Omit<Habit, 'id'>) => {
    dispatch({ type: 'ADD_HABIT', payload: habit });
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    dispatch({ type: 'UPDATE_HABIT', payload: { id, updates } });
  };

  const addCrisisContact = (contact: Omit<CrisisContact, 'id'>) => {
    dispatch({ type: 'ADD_CRISIS_CONTACT', payload: contact });
  };

  const updateSafetyPlan = (updates: Partial<SafetyPlan>) => {
    dispatch({ type: 'UPDATE_SAFETY_PLAN', payload: updates });
  };

  const clearAllData = () => {
    dispatch({ type: 'CLEAR_ALL_DATA' });
  };

  const exportData = () => {
    return storage.exportData();
  };

  const importData = (jsonData: string) => {
    const success = storage.importData(jsonData);
    if (success) {
      const userData = storage.loadUserData();
      dispatch({ type: 'LOAD_USER_DATA', payload: userData });
    }
    return success;
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    updateProfile,
    addMoodEntry,
    addJournalEntry,
    addThoughtRecord,
    addActivityPlan,
    addGoal,
    updateGoal,
    addHabit,
    updateHabit,
    addCrisisContact,
    updateSafetyPlan,
    clearAllData,
    exportData,
    importData
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
