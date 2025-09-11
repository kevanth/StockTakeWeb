"use client";

import useSWR from "swr";
import { fetcher } from "../utils";
import { User } from "@/types/models";

export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR<{ user: User }>(
    "/api/user",
    fetcher
  );
  console.log(data?.user);
  const user = data ? data.user : null;

  return {
    user,
    error,
    isLoading,
  };
}
