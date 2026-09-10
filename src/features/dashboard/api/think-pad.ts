import { createClient } from "@/lib/supabase/client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export type ThinkPad = {
  id: string;
  thinkPadName: string;
  description?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type PaginationMeta = {
  total_items: number;
  total_pages: number;
  current_page: number;
  limit: number;
  has_next_page: boolean;
  has_prev_page: boolean;
};

export type PaginatedThinkPadsResponse = {
  success: boolean;
  data: ThinkPad[];
  pagination: PaginationMeta;
};

export type ThinkPadDetailResponse = {
  success: boolean;
  data: ThinkPad;
};

export type ThinkPadStatementHistoryItem = {
  id: string;
  updatedBy: string;
  thinkPadId: string;
  userStatement: string;
  aiOptimizedStatement?: string | null;
  status?: "DRAFT" | "ENHANCED";
  createdAt: string;
  updatedAt: string;
};

export type ThinkPadHistoryResponse = {
  success: boolean;
  think_pad: {
    id: string;
    think_pad_name: string;
  };
  data: ThinkPadStatementHistoryItem[];
  pagination: PaginationMeta;
};

export type CreateThinkPadInput = {
  think_pad_name: string;
  description?: string;
};

export type UpdateThinkPadInput = {
  think_pad_name?: string;
  description?: string;
};

async function getAuthHeaders(): Promise<Record<string, string>> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`;
  }

  return headers;
}

/**
 * Fetch paginated ThinkPads for the authenticated user.
 */
export async function getThinkPads(
  page = 1,
  limit = 10,
): Promise<PaginatedThinkPadsResponse> {
  const headers = await getAuthHeaders();
  const response = await fetch(
    `${API_BASE_URL}/api/v1/think-pad?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers,
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ?? "Failed to fetch ThinkPads.",
    );
  }

  return response.json();
}

/**
 * Create a new ThinkPad container.
 */
export async function createThinkPad(
  input: CreateThinkPadInput,
): Promise<ThinkPadDetailResponse> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/v1/think-pad`, {
    method: "POST",
    headers,
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ?? "Failed to create ThinkPad.",
    );
  }

  return response.json();
}

/**
 * Fetch a single ThinkPad by ID.
 */
export async function getThinkPadById(
  id: string,
): Promise<ThinkPadDetailResponse> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/v1/think-pad/${id}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ?? "Failed to fetch ThinkPad details.",
    );
  }

  return response.json();
}

/**
 * Fetch ThinkPad statement history (paginated).
 */
export async function getThinkPadHistory(
  id: string,
  page = 1,
  limit = 10,
): Promise<ThinkPadHistoryResponse> {
  const headers = await getAuthHeaders();
  const response = await fetch(
    `${API_BASE_URL}/api/v1/think-pad/${id}/history?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers,
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ?? "Failed to fetch ThinkPad history.",
    );
  }

  return response.json();
}

/**
 * Fetch the latest saved statement edit for a ThinkPad container.
 */
export async function getThinkPadLatestContent(
  id: string,
): Promise<ThinkPadStatementHistoryItem | null> {
  const history = await getThinkPadHistory(id, 1, 1);
  return history?.data?.[0] ?? null;
}

/**
 * Update an existing ThinkPad.
 */
export async function updateThinkPad(
  id: string,
  input: UpdateThinkPadInput,
): Promise<ThinkPadDetailResponse> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/v1/think-pad/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ?? "Failed to update ThinkPad.",
    );
  }

  return response.json();
}

export type SaveNoteInput = {
  user_statement: string;
  think_pad_id?: string;
  statement_id?: string;
};

export type SaveNoteResponse = {
  success: boolean;
  message: string;
  data: ThinkPadStatementHistoryItem;
};

/**
 * Save raw draft note without running AI enhancement.
 */
export async function saveRawNote(
  input: SaveNoteInput,
): Promise<SaveNoteResponse> {
  const headers = await getAuthHeaders();
  let response = await fetch(`${API_BASE_URL}/api/v1/ai-writer/note`, {
    method: "POST",
    headers,
    body: JSON.stringify(input),
  });

  if (response.status === 404) {
    response = await fetch(`${API_BASE_URL}/api/v1/ai-writer/save-note`, {
      method: "POST",
      headers,
      body: JSON.stringify(input),
    });
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ?? "Failed to save note draft.",
    );
  }

  return response.json();
}

/**
 * Delete a ThinkPad by ID.
 */
export async function deleteThinkPad(
  id: string,
): Promise<{ success: boolean; message: string }> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/v1/think-pad/${id}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message ?? "Failed to delete ThinkPad.",
    );
  }

  return response.json();
}
