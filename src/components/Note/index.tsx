import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectAuth, LoginStatus } from "../Login/authslice";
import { selectNote, NoteStatus, getNote, upsertNote } from '../Note/noteslice'
import styles from "./Note.module.css";

export function Note() {
  const auth = useAppSelector(selectAuth);
  const note = useAppSelector(selectNote);
  const dispatch = useAppDispatch();
  const [currentNote, setCurrentNote] = useState<string>(note.note || "Note goes here...");

  useEffect(() => {
    if (note.status === NoteStatus.NOTE_IDLE && note.note) {
      setCurrentNote(note.note)
    }
  }, [note.status])

  useEffect(() => {
    if (apiToken && userId) {
      dispatch(getNote({ apiToken, userId }))
    }
  }, [auth])

  if (auth.status !== LoginStatus.LOGGED_IN) return null;
  var {
    apiToken,
    user: { id: userId },
  } = auth;

  const handleOnchange = (value: string) => {
    setCurrentNote(value)
    dispatch(upsertNote({ apiToken, userId, note: value }))
  }

  return (
    <div>
      <NoteField value={currentNote} onChange={handleOnchange} />
      {note.status === NoteStatus.NOTE_PENDING && (<p>syncing...</p>)}
      {note.status === NoteStatus.NOTE_IDLE && (<p className={styles.text_green}>synced</p>)}
      {note.status === NoteStatus.NOTE_ERROR && (<p className={styles.text_red}>something went wrong</p>)}
    </div>
  );
}

function NoteField({ value, onChange }: NoteFieldProps) {
  return <textarea defaultValue="Note goes here..." value={value} onChange={e => onChange(e.target.value)}></textarea>;
}

export type NoteFieldProps = {
  value: string
  onChange: (arg: string) => void
}