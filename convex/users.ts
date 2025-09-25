import {query,mutation} from "./_generated/server";
import { v } from "convex/values";

export const getUserByClerkId = query({
    args: { userId: v.string()},
    handler:async (ctx,{userId})=>{
        if(!userId) return null;
        return await ctx.db
        .query("users")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .first();
    }
});

//create or update user(sync from clerk )
export const upsertUser = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, { userId, name, email, imageUrl }) => {
    // 1. Look for an existing user by userId
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    // 2. If user exists, update it
    if (existingUser) {
      await ctx.db.patch(existingUser._id, { name, imageUrl });
      return existingUser._id;
    }

    // 3. Otherwise, insert a new one
    return await ctx.db.insert("users", { userId, name, email, imageUrl });
  },
});


//search user name or email
// A Convex query to search users by their name or email
export const searchUsers = query({
    // The query accepts one argument: "searchTerm" (a string)
    args: { searchTerm: v.string() },

    // The function that runs when the query is called
    handler: async (convexToJson, { searchTerm }) => {
        // 1. If searchTerm is empty or only spaces → return an empty list
        if (!searchTerm.trim()) return [];
        
        // 2. Make the searchTerm lowercase and remove extra spaces
        //    This makes the search case-insensitive
        const normalisedSearch = searchTerm.toLowerCase().trim();

        // 3. Get all users from the "users" table in the database
        const allUsers = await convexToJson.db.query("users").collect();

        // 4. Filter the users and return only those whose:
        //    - name (in lowercase) contains the search term
        //    - OR email (in lowercase) contains the search term
        //    After filtering, take only the first 20 results
        return allUsers.filter((user) =>
            user.name.toLowerCase().includes(normalisedSearch) ||
            user.email.toLowerCase().includes(normalisedSearch)
        ).slice(0, 20);  // limit results to 20
    }
});
