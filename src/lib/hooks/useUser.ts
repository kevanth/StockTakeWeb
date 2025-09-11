"use client";

import useSWR from "swr";
import { fetcher } from "../utils";
import { User } from "@supabase/supabase-js";

export function useUsers() {
  const { data: user, error, isLoading, mutate } = useSWR("/api/user", fetcher);

  return {
    user,
    error,
    isLoading,
  };
}
