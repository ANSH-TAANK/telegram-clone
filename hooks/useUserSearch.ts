import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useDebounce } from "./useDebounce";
import { Doc } from "../convex/_generated/dataModel";

export function useUserSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // 300ms debounce

  const searchResults = useQuery(
    api.users.searchUsers,
    debouncedSearchTerm.trim() !== ""
      ? { searchTerm: debouncedSearchTerm }
      : "skip"
  );

  return {
    searchTerm,
    setSearchTerm,
    searchResults: (searchResults || []) as Doc<"users">[],
    isLoading:
      searchResults === undefined && debouncedSearchTerm.trim() !== "",
  };
}


// Debouncing is a programming technique where you delay the execution of a function until a certain amount of time has passed since the last time it was invoked.

// 👉 In simpler terms:
// If something is triggered repeatedly (like typing in a search box), debouncing ensures the function only runs once after the user stops typing for a short period (e.g. 300ms).
// Prevents unnecessary API calls

// Without it, servers get spammed with requests on every keystroke.

// With debouncing, servers only process meaningful requests.

// Reduces load & cost

// Fewer queries = less CPU, memory, and bandwidth usage.

// Important if you pay per request (like with Convex, Firebase, or OpenAI APIs).

// Improves performance for users

// Avoids flickering UI from too many responses.

// Results appear smoother and more stable.

// Scalability

// In large apps, 1000 users typing without debouncing could create tens of thousands of wasted queries per minute.

// Debouncing keeps server demand predictable and manageable.