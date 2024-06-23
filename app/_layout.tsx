import { migrateDbIfNeeded } from "@/utils/db";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="notes.db" onInit={migrateDbIfNeeded}>
      <Stack screenOptions={{ headerShown: false }} />
    </SQLiteProvider>
  );
}
