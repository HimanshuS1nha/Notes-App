import { SQLiteDatabase } from "expo-sqlite";
import { create } from "zustand";
import { NoteType } from "./useNotes";

type BookmarksType = {
  bookmarks: NoteType[];
  getBookmarks: (db: SQLiteDatabase) => Promise<boolean>;
};

export const useBookmarks = create<BookmarksType>((set) => ({
  bookmarks: [],
  getBookmarks: async (db) => {
    try {
      const bookmarks = await db.getAllAsync<NoteType>(
        "SELECT * from notes where isBookmarked = 1"
      );
      set({ bookmarks });
      return true;
    } catch (error) {
      return false;
    }
  },
}));
