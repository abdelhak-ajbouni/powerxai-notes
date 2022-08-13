import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectAuth, LoginStatus } from "../Login/authslice";
import { selectNote, NoteStatus, getNote, upsertNote } from '../Note/noteslice'
import styles from "./Note.module.css";

export function Note() {
  const auth = useAppSelector(selectAuth);
  const note = useAppSelector(selectNote);
  const dispatch = useAppDispatch();
  const [currentNote, setCurrentNote] = useState<string | null>(note.note);

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

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (currentNote) {
        dispatch(upsertNote({ apiToken, userId, note: currentNote }))
      }
    }, 1000)

    return () => clearTimeout(debounce)
  }, [currentNote])

  if (auth.status !== LoginStatus.LOGGED_IN) return null;
  // I changed const to var for variable hoisting - it was causing problems with useEffect
  var {
    apiToken,
    user: { id: userId },
  } = auth;

  const handleOnchange = (value: string) => {
    setCurrentNote(value)
  }

  return (
    <div>
      <NoteField value={currentNote} onChange={handleOnchange} />
      {note.status === NoteStatus.NOTE_PENDING && (<p>syncing...</p>)}
      {note.status === NoteStatus.NOTE_IDLE && (<p className={styles.text_green}>synced</p>)}
      {note.status === NoteStatus.NOTE_ERROR && (<p className={styles.text_red}>{note.error}</p>)}
    </div>
  );
}

function NoteField({ value, onChange }: NoteFieldProps) {
  return (
    <textarea
      value={value || "Note goes here..."}
      onChange={e => onChange(e.target.value)}
    >
    </textarea>);
}

export type NoteFieldProps = {
  value: string | null
  onChange: (arg: string) => void
}