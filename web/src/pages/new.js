import React, {useEffect} from "react";
import {useMutation, gql} from "@apollo/client";
import NoteForm from "../Components/NoteForm";
import {useNavigate} from "react-router-dom";
import Loading from "../StyledComponents/Loading";
import {GET_MY_NOTES, GET_NOTES} from "../qql/query";

// Запрос new note
const NEW_NOTE = gql`
  mutation newNote($content: String!) {
    newNote(content: $content) {
      id
      content
      createdAt
      favoriteCount
      favoritedBy {
        id
        username
      }
      author {
        username
        id
      }
    }
  }
`;
const NewNote = () => {
    useEffect(() => {
        // Обновляем заголовок документа
        document.title = 'New Note - Notedly';
    });

    const navigate = useNavigate();
    const [data, {loading, error}] = useMutation(NEW_NOTE, {
        //Повторно получаем запрос GET_NOTES и GET_MY_NOTES, чтобы обновить кэш
        refetchQueries: [{query: GET_MY_NOTES}, {query: GET_NOTES}],
        onCompleted: data => {
            // После завершения перенаправляем пользователя на страницу заметки
            navigate(`/note/${data.newNote.id}`);
        }
    });

        return (
            <React.Fragment>
                {/* Во время загрузки мутации выдаем сообщение о загрузке */}
                {loading && <Loading/>}
                {/* В случае сбоя выдаем сообщение об ошибке */}
                {error && <div>Error saving the note</div>}
                {/* Компонент формы, передающий мутацию данных в качестве prop */}
                <NoteForm action={data}/>
            </React.Fragment>
        );
};

export default NewNote;