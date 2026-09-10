import { useQuery } from "@tanstack/react-query";

import {
  getThinkPadById,
  getThinkPadHistory,
  getThinkPadLatestContent,
} from "@/features/dashboard";

export function useThinkPadDetails(id?: string | null) {
  return useQuery({
    queryKey: ["think-pad-detail", id],
    queryFn: () => (id ? getThinkPadById(id) : null),
    enabled: Boolean(id),
  });
}

export function useThinkPadHistory(id?: string | null, page = 1, limit = 20) {
  return useQuery({
    queryKey: ["think-pad-history", id, page, limit],
    queryFn: () => (id ? getThinkPadHistory(id, page, limit) : null),
    enabled: Boolean(id),
  });
}

export function useThinkPadLatestContent(id?: string | null) {
  return useQuery({
    queryKey: ["think-pad-latest", id],
    queryFn: () => (id ? getThinkPadLatestContent(id) : null),
    enabled: Boolean(id),
  });
}
