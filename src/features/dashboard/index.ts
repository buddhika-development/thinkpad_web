/**
 * Public surface of the `dashboard` feature (authenticated widgets).
 * Import dashboard UI from here only — internals stay private.
 */
export {
  createThinkPad,
  deleteThinkPad,
  getThinkPadById,
  getThinkPadHistory,
  getThinkPadLatestContent,
  getThinkPads,
  type SaveNoteInput,
  type SaveNoteResponse,
  saveRawNote,
  type ThinkPad,
  type ThinkPadStatementHistoryItem,
  updateThinkPad,
} from "./api/think-pad";
export { CreateThinkPadModal } from "./components/CreateThinkPadModal";
export { ThinkPadCard } from "./components/ThinkPadCard";
export { ThinkPadList } from "./components/ThinkPadList";
export {
  useCreateThinkPad,
  useDeleteThinkPad,
  useSaveNote,
  useThinkPadsList,
  useUpdateThinkPad,
} from "./hooks/useThinkPads";
