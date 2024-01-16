import React from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Split from "react-split";
import { nanoid } from "nanoid";

export default function App() {
  const [notes, setNotes] = React.useState(
    () => JSON.parse(localStorage.getItem("notes")) || []
  );
  // #3 convert to optional chain operator
  // const [currentNoteId, setCurrentNoteId] = React.useState(
  //   (notes[0] && notes[0].id) || ""
  // );
  
  const [currentNoteId, setCurrentNoteId] = React.useState(
    (notes[0]?.id) || ""
  );

  const currentNote = notes.find(note => note.id === currentNoteId) || notes[0];

  React.useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown note's title here",
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    setCurrentNoteId(newNote.id);
  }

  function updateNote(text) {
    // puts most recently updated note to top of list
    setNotes((oldNotes) => {
      const newArray = [];
      for (let i = 0; i < oldNotes.length; i++) {
        const oldNote = oldNotes[i];
        if (oldNote.id === currentNoteId) {
          newArray.unshift({ ...oldNote, body: text });
        } else {
          newArray.push(oldNote);
        }
      }

      return newArray;
    });
  }

  function deleteNote(event, noteId) {
    event.stopPropagation();
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
    console.log("clicked trash can to delete note", noteId);
  }

  // convert this to a simple var in global of this app and change currentNote to call currentNote instead of this function in 2 places in the return area
  // function findCurrentNote() {
  //   return (
  //     notes.find((note) => {
  //       return note.id === currentNoteId;
  //     }) || notes[0]
  //   );
  // }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={notes}
            currentNote={currentNote}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />
          {currentNoteId && notes.length > 0 && (
            <Editor currentNote={currentNote} updateNote={updateNote} />
          )}
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}
