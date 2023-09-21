import React from "react";
import Note from "./Note";
import styled from 'styled-components';
import { Link } from "react-router-dom";

const NoteWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  margin-bottom: 2em;
  padding-bottom: 2em;
  border-bottom: 1px solid #e2e5f5;
`;

const PermaLink = styled.div`
  a {
    text-decoration: none;
    color: #000;
    padding: 3px;
    border: 1px solid #0077cc;
    background: #e2e5f5;
    border-radius: 4px;
  }
  a:hover,
  a:focus {
    color: #0077cc;
    border: 1px solid #e2e5f5;
  }
`;

const NoteFeed = ({notes}) => {
    return (
        <div className="note-feed">
            {notes.map(note => (
                <NoteWrapper key={note.id}>
                    <Note note={note}/>
                    <PermaLink>
                        <Link to={`/note/${note.id}`}>Permalink</Link>
                    </PermaLink>
                </NoteWrapper>
            ))}
        </div>
    );
};
export default NoteFeed;