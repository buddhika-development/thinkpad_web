import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createThinkPad,
  type CreateThinkPadInput,
  deleteThinkPad,
  getThinkPads,
  type SaveNoteInput,
  saveRawNote,
  updateThinkPad,
  type UpdateThinkPadInput,
} from "../api/think-pad";

export const THINK_PADS_QUERY_KEY = ["think-pads"] as const;

/**
 * Fetch user's ThinkPads list with pagination.
 */
export function useThinkPadsList(page = 1, limit = 10) {
  return useQuery({
    queryKey: [...THINK_PADS_QUERY_KEY, { page, limit }],
    queryFn: () => getThinkPads(page, limit),
  });
}

/**
 * Mutation to create a new ThinkPad.
 */
export function useCreateThinkPad() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateThinkPadInput) => createThinkPad(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: THINK_PADS_QUERY_KEY });
    },
  });
}

/**
 * Mutation to update a ThinkPad.
 */
export function useUpdateThinkPad() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateThinkPadInput }) =>
      updateThinkPad(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: THINK_PADS_QUERY_KEY });
    },
  });
}

/**
 * Mutation to save raw draft note.
 */
export function useSaveNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SaveNoteInput) => saveRawNote(input),
    onSuccess: (_, variables) => {
      if (variables.think_pad_id) {
        queryClient.invalidateQueries({
          queryKey: ["think-pad-history", variables.think_pad_id],
        });
        queryClient.invalidateQueries({
          queryKey: ["think-pad-latest", variables.think_pad_id],
        });
      }
    },
  });
}

/**
 * Mutation to delete a ThinkPad.
 */
export function useDeleteThinkPad() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteThinkPad(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: THINK_PADS_QUERY_KEY });
    },
  });
}
