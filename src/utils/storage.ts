// Data persistence utilities for MindSpace
export interface UserData {
  profile: {
    name: string;
    preferredLanguage: string;
    accessibilityMode: boolean;
    anonymousMode: boolean;
  };
  moodHistory: MoodEntry[];
  journalEntries: JournalEntry[];
  cbtProgress: CBTProgress;
  goals: Goal[];
  habits: Habit[];
  crisisContacts: CrisisContact[];
  safetyPlan: SafetyPlan;
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: string;
  score: number;
  notes?: string;
  activities?: string[];
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood?: string;
  tags: string[];
  insights: string[];
  prompt?: string;
}

export interface CBTProgress {
  completedExercises: string[];
  thoughtRecords: ThoughtRecord[];
  activityPlans: ActivityPlan[];
  lastActivity: string;
}

export interface ThoughtRecord {
  id: string;
  date: string;
  situation: string;
  thoughts: string;
  emotions: string;
  behaviors: string;
  evidenceFor: string;
  evidenceAgainst: string;
  balancedThought: string;
}

export interface ActivityPlan {
  id: string;
  date: string;
  activities: string[];
  completed: string[];
  moodBefore: number;
  moodAfter?: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  targetDate: string;
  completed: boolean;
  progress: number;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  date?: string;
}

export interface Habit {
  id: string;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  streak: number;
  lastCompleted?: string;
  reminders: boolean;
}

export interface CrisisContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isEmergency: boolean;
}

export interface SafetyPlan {
  warningSigns: string;
  supportContacts: string;
  safePlaces: string;
  copingStrategies: string;
  professionalContacts: string;
}

class StorageManager {
  private readonly STORAGE_KEY = 'mindspace_user_data';

  // Initialize default user data
  private getDefaultData(): UserData {
    return {
      profile: {
        name: 'Guest',
        preferredLanguage: 'en',
        accessibilityMode: false,
        anonymousMode: true
      },
      moodHistory: [],
      journalEntries: [],
      cbtProgress: {
        completedExercises: [],
        thoughtRecords: [],
        activityPlans: [],
        lastActivity: ''
      },
      goals: [],
      habits: [],
      crisisContacts: [],
      safetyPlan: {
        warningSigns: '',
        supportContacts: '',
        safePlaces: '',
        copingStrategies: '',
        professionalContacts: ''
      }
    };
  }

  // Load user data from localStorage
  loadUserData(): UserData {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        // Merge with default data to handle new fields
        return { ...this.getDefaultData(), ...data };
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
    return this.getDefaultData();
  }

  // Save user data to localStorage
  saveUserData(data: UserData): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }

  // Update specific parts of user data
  updateUserData(updates: Partial<UserData>): UserData {
    const currentData = this.loadUserData();
    const newData = { ...currentData, ...updates };
    this.saveUserData(newData);
    return newData;
  }

  // Mood tracking methods
  addMoodEntry(entry: Omit<MoodEntry, 'id'>): UserData {
    const data = this.loadUserData();
    const newEntry: MoodEntry = {
      ...entry,
      id: Date.now().toString()
    };
    data.moodHistory.unshift(newEntry);
    // Keep only last 100 entries
    data.moodHistory = data.moodHistory.slice(0, 100);
    this.saveUserData(data);
    return data;
  }

  // Journal methods
  addJournalEntry(entry: Omit<JournalEntry, 'id' | 'date'>): UserData {
    const data = this.loadUserData();
    const newEntry: JournalEntry = {
      ...entry,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    data.journalEntries.unshift(newEntry);
    this.saveUserData(data);
    return data;
  }

  // CBT progress methods
  addThoughtRecord(record: Omit<ThoughtRecord, 'id' | 'date'>): UserData {
    const data = this.loadUserData();
    const newRecord: ThoughtRecord = {
      ...record,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    data.cbtProgress.thoughtRecords.unshift(newRecord);
    data.cbtProgress.lastActivity = new Date().toISOString();
    this.saveUserData(data);
    return data;
  }

  addActivityPlan(plan: Omit<ActivityPlan, 'id' | 'date'>): UserData {
    const data = this.loadUserData();
    const newPlan: ActivityPlan = {
      ...plan,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    data.cbtProgress.activityPlans.unshift(newPlan);
    data.cbtProgress.lastActivity = new Date().toISOString();
    this.saveUserData(data);
    return data;
  }

  // Goals and habits methods
  addGoal(goal: Omit<Goal, 'id'>): UserData {
    const data = this.loadUserData();
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString()
    };
    data.goals.unshift(newGoal);
    this.saveUserData(data);
    return data;
  }

  updateGoal(goalId: string, updates: Partial<Goal>): UserData {
    const data = this.loadUserData();
    const goalIndex = data.goals.findIndex(g => g.id === goalId);
    if (goalIndex !== -1) {
      data.goals[goalIndex] = { ...data.goals[goalIndex], ...updates };
      this.saveUserData(data);
    }
    return data;
  }

  addHabit(habit: Omit<Habit, 'id'>): UserData {
    const data = this.loadUserData();
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString()
    };
    data.habits.unshift(newHabit);
    this.saveUserData(data);
    return data;
  }

  updateHabit(habitId: string, updates: Partial<Habit>): UserData {
    const data = this.loadUserData();
    const habitIndex = data.habits.findIndex(h => h.id === habitId);
    if (habitIndex !== -1) {
      data.habits[habitIndex] = { ...data.habits[habitIndex], ...updates };
      this.saveUserData(data);
    }
    return data;
  }

  // Crisis support methods
  addCrisisContact(contact: Omit<CrisisContact, 'id'>): UserData {
    const data = this.loadUserData();
    const newContact: CrisisContact = {
      ...contact,
      id: Date.now().toString()
    };
    data.crisisContacts.unshift(newContact);
    this.saveUserData(data);
    return data;
  }

  updateSafetyPlan(updates: Partial<SafetyPlan>): UserData {
    const data = this.loadUserData();
    data.safetyPlan = { ...data.safetyPlan, ...updates };
    this.saveUserData(data);
    return data;
  }

  // Utility methods
  clearAllData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  exportData(): string {
    const data = this.loadUserData();
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      this.saveUserData(data);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

export const storage = new StorageManager();
