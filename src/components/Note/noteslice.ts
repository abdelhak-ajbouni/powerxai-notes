import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export enum NoteStatus {
  NOTE_IDLE,
  NOTE_PENDING,
  NOTE_ERROR,
}
export type NoteState =
  {
    status: NoteStatus.NOTE_IDLE | NoteStatus.NOTE_PENDING;
    note: string | null
  }
  | {
    status: NoteStatus.NOTE_ERROR;
    note: string | null
    error: string;
  };

const initialState = {
  status: NoteStatus.NOTE_IDLE,
  note: null
} as NoteState;

export const getNote = createAsyncThunk(
  "note/get",
  async ({ apiToken, userId }: { apiToken: string, userId: string }) => {
    const response = await fetch(
      `https://60b793ec17d1dc0017b8a6bc.mockapi.io/users/${userId}`,
      {
        headers: {
          'Authorization': 'Bearer ' + apiToken,
          'content-type': 'application/json'
        }
      }
    );
    const json = await response.json();
    return json.note;
  }
);

export const upsertNote = createAsyncThunk(
  "note/upsert",
  async ({ apiToken, userId, note }: { apiToken: string, userId: string, note: string }) => {
    const response = await fetch(
      `https://60b793ec17d1dc0017b8a6bc.mockapi.io/users/${userId}`,
      {
        method: 'put',
        headers: {
          'Authorization': 'Bearer ' + apiToken,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          note
        })
      }
    );
    const json = await response.json();
    return json.note;
  }
);

export const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNote.fulfilled, (state, action) => {
        return {
          status: NoteStatus.NOTE_IDLE,
          note: action.payload,
        };
      })
      .addCase(getNote.rejected, (state, action) => {
        return {
          status: NoteStatus.NOTE_ERROR,
          error: "Cannot get note",
          note: null
        };
      })
      .addCase(getNote.pending, (state, action) => {
        return {
          status: NoteStatus.NOTE_PENDING,
          note: null
        };
      })
      .addCase(upsertNote.fulfilled, (state, action) => {
        return {
          status: NoteStatus.NOTE_IDLE,
          note: action.payload,
        };
      })
      .addCase(upsertNote.rejected, (state, action) => {
        return {
          status: NoteStatus.NOTE_ERROR,
          error: "Cannot update this note",
          note: null
        };
      })
      .addCase(upsertNote.pending, (state, action) => {
        return {
          status: NoteStatus.NOTE_PENDING,
          note: null
        };
      });
  },
});

export const selectNote = (state: RootState) => state.note;

export default noteSlice.reducer;
