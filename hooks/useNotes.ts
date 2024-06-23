import { SQLiteDatabase } from "expo-sqlite";
import { create } from "zustand";

export type NoteType = {
  id: string;
  title: string;
  content: string;
  date: string;
  isBookmarked: 0 | 1;
};

type NotesType = {
  notes: NoteType[];
  setNotes: (notes: NoteType[]) => void;
  getNotes: (db: SQLiteDatabase) => Promise<boolean>;
  deleteNote: (db: SQLiteDatabase, id: string) => Promise<boolean>;
  deleteAllNotes: (db: SQLiteDatabase) => Promise<boolean>;
};

export const useNotes = create<NotesType>((set) => ({
  notes: [],
  setNotes: (notes) => {
    set({ notes });
  },
  getNotes: async (db) => {
    try {
      const notes = await db.getAllAsync<NoteType>("SELECT * from notes ORDER BY id");
      set({ notes });
      return true;
    } catch (error) {
      return false;
    }
  },
  deleteNote: async (db, id) => {
    try {
      await db.runAsync("DELETE FROM notes where id = ?", id);
      return true;
    } catch (error) {
      return false;
    }
  },
  deleteAllNotes: async (db) => {
    try {
      await db.runAsync("DELETE FROM notes");
      return true;
    } catch (error) {
      return false;
    }
  },
}));
