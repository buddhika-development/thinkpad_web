# ThinkPad & AI Writer API Documentation for Frontend Team

This document outlines the ThinkPad CRUD endpoints, raw draft note saving, AI enhancement endpoints, pagination conventions, and history API for frontend integration.

---

## 1. Authentication & Base Setup

- **Base URL**: `http://localhost:8000/api/v1` (or your configured environment base URL)
- **Authentication**: All endpoints require a Supabase JWT Access Token sent in the `Authorization` header:
  ```http
  Authorization: Bearer <SUPABASE_ACCESS_TOKEN>
  Content-Type: application/json
  ```

---

## 2. Standard Pagination Format

All paginated endpoints accept standard query parameters `page` and `limit`:

- `page`: Page number (integer, default: `1`).
- `limit`: Items per page (integer, default: `10`, max: `100`).

### Standard Paginated Response Structure
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "total_items": 42,
    "total_pages": 5,
    "current_page": 1,
    "limit": 10,
    "has_next_page": true,
    "has_prev_page": false
  }
}
```

---

## 3. ThinkPad API Endpoints

### 3.1 Create ThinkPad
Create a new ThinkPad container for user statements. Supports optional `description`.

- **Method**: `POST`
- **URL**: `/api/v1/think-pad`
- **Request Body**:
  ```json
  {
    "think_pad_name": "Project Strategy Notes",
    "description": "Optional description or context for this ThinkPad container"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "ThinkPad created successfully",
    "data": {
      "id": "e9b21f3a-4c21-4f11-8012-98ab1234abcd",
      "thinkPadName": "Project Strategy Notes",
      "description": "Optional description or context for this ThinkPad container",
      "userId": "supabase-user-uuid",
      "createdAt": "2026-09-10T14:00:00.000Z",
      "updatedAt": "2026-09-10T14:00:00.000Z"
    }
  }
  ```

---

### 3.2 Get All ThinkPads (Paginated)
Fetch all ThinkPads belonging to the authenticated user (sorted by latest created first).

- **Method**: `GET`
- **URL**: `/api/v1/think-pad?page=1&limit=10`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "e9b21f3a-4c21-4f11-8012-98ab1234abcd",
        "thinkPadName": "Project Strategy Notes",
        "description": "Optional description or context for this ThinkPad container",
        "userId": "supabase-user-uuid",
        "createdAt": "2026-09-10T14:00:00.000Z",
        "updatedAt": "2026-09-10T14:00:00.000Z"
      }
    ],
    "pagination": {
      "total_items": 1,
      "total_pages": 1,
      "current_page": 1,
      "limit": 10,
      "has_next_page": false,
      "has_prev_page": false
    }
  }
  ```

---

### 3.3 Get Single ThinkPad
Fetch details of a specific ThinkPad by ID.

- **Method**: `GET`
- **URL**: `/api/v1/think-pad/:id`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "e9b21f3a-4c21-4f11-8012-98ab1234abcd",
      "thinkPadName": "Project Strategy Notes",
      "description": "Optional description or context for this ThinkPad container",
      "userId": "supabase-user-uuid",
      "createdAt": "2026-09-10T14:00:00.000Z",
      "updatedAt": "2026-09-10T14:00:00.000Z"
    }
  }
  ```

---

### 3.4 Get ThinkPad Statement History (Paginated)
Fetch all statement edits linked to a ThinkPad, ordered from **latest to oldest**.

- **Method**: `GET`
- **URL**: `/api/v1/think-pad/:id/history?page=1&limit=10`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "think_pad": {
      "id": "e9b21f3a-4c21-4f11-8012-98ab1234abcd",
      "think_pad_name": "Project Strategy Notes"
    },
    "data": [
      {
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "updatedBy": "supabase-user-uuid",
        "thinkPadId": "e9b21f3a-4c21-4f11-8012-98ab1234abcd",
        "userStatement": "Draft statement from user",
        "aiOptimizedStatement": "Grammatically polished and refined user statement.",
        "status": "ENHANCED",
        "createdAt": "2026-09-10T14:05:00.000Z",
        "updatedAt": "2026-09-10T14:05:00.000Z"
      }
    ],
    "pagination": {
      "total_items": 1,
      "total_pages": 1,
      "current_page": 1,
      "limit": 10,
      "has_next_page": false,
      "has_prev_page": false
    }
  }
  ```

---

### 3.5 Update ThinkPad
Update the name and/or description of a ThinkPad.

- **Method**: `PUT`
- **URL**: `/api/v1/think-pad/:id`
- **Request Body**:
  ```json
  {
    "think_pad_name": "Updated Strategy Title",
    "description": "Updated description text"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "ThinkPad updated successfully",
    "data": {
      "id": "e9b21f3a-4c21-4f11-8012-98ab1234abcd",
      "thinkPadName": "Updated Strategy Title",
      "description": "Updated description text",
      "userId": "supabase-user-uuid",
      "createdAt": "2026-09-10T14:00:00.000Z",
      "updatedAt": "2026-09-10T14:06:00.000Z"
    }
  }
  ```

---

### 3.6 Delete ThinkPad
Delete a ThinkPad container and all associated statement histories (cascade delete).

- **Method**: `DELETE`
- **URL**: `/api/v1/think-pad/:id`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "ThinkPad deleted successfully"
  }
  ```

---

## 4. Notes & AI Writer Endpoints

### 4.1 Save Raw Draft Note (Without AI Enhancement)
When a user hits the Save button on the platform without running AI enhancement, call this endpoint to store the statement as a **DRAFT** (`aiOptimizedStatement = null`).

- **Method**: `POST`
- **URL**: `/api/v1/ai-writer/note` (or `/api/v1/ai-writer/save-note`)
- **Request Body**:
  ```json
  {
    "user_statement": "This is my initial raw note before applying AI enhancement.",
    "think_pad_id": "e9b21f3a-4c21-4f11-8012-98ab1234abcd",
    "statement_id": "optional-existing-statement-id-to-update"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Note statement saved successfully as DRAFT",
    "data": {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "updatedBy": "supabase-user-uuid",
      "thinkPadId": "e9b21f3a-4c21-4f11-8012-98ab1234abcd",
      "userStatement": "This is my initial raw note before applying AI enhancement.",
      "aiOptimizedStatement": null,
      "status": "DRAFT",
      "createdAt": "2026-09-10T15:00:00.000Z",
      "updatedAt": "2026-09-10T15:00:00.000Z"
    }
  }
  ```

---

### 4.2 Standard AI Enhancement Request
Runs AI enhancement on the statement and transitions status to **ENHANCED**.

- **Method**: `POST`
- **URL**: `/api/v1/ai-writer`
- **Request Body**:
  ```json
  {
    "user_statement": "i needs to prepare api endpoints for thinkpad",
    "user_custom_instructions": "Make it professional",
    "think_pad_id": "e9b21f3a-4c21-4f11-8012-98ab1234abcd",
    "statement_id": "optional-existing-draft-id-to-enhance",
    "persistance": true
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "message": "successfully processed and saved the api response",
    "user_statement": "I need to prepare API endpoints for ThinkPad.",
    "saved_content": {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "updatedBy": "supabase-user-uuid",
      "thinkPadId": "e9b21f3a-4c21-4f11-8012-98ab1234abcd",
      "userStatement": "i needs to prepare api endpoints for thinkpad",
      "aiOptimizedStatement": "I need to prepare API endpoints for ThinkPad.",
      "status": "ENHANCED",
      "createdAt": "2026-09-10T15:00:00.000Z",
      "updatedAt": "2026-09-10T15:01:00.000Z"
    }
  }
  ```

---

### 4.3 Streaming AI Enhancement Request (SSE)
Streams AI enhancement response chunks via Server-Sent Events (SSE) and sets status to **ENHANCED**.

- **Method**: `POST`
- **URL**: `/api/v1/ai-writer/stream`
- **Request Body**:
  ```json
  {
    "user_statement": "i needs to prepare api endpoints for thinkpad",
    "user_custom_instructions": "Make it professional",
    "think_pad_id": "e9b21f3a-4c21-4f11-8012-98ab1234abcd",
    "statement_id": "optional-existing-draft-id-to-enhance",
    "persistance": true
  }
  ```
