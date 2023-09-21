import React from "react";
import {useMutation} from "@apollo/client";

import ButtonAsLink from "./ButtonAsLink";
//Импортируем мутация DeleteNote
import {DELETE_NOTE} from "../qql/mutation";
//Импортируем запросы для их повторного получения после удаления заметки
import {GET_MY_NOTES, GET_NOTES} from "../qql/query";
import {useNavigate} from "react-router-dom";

const DeleteNote = props => {

    const navigate = useNavigate();
    const [deleteNote] = useMutation(DELETE_NOTE, {
        variables: {
            id: props.noteId
        },
        //Повторно получаем запросы списка заметок, чтобы обновить кэш
        refetchQueries: [{query: GET_MY_NOTES}, {query: GET_NOTES}],
        onCompleted: data => {
            //Перенаправляем пользователя на страницу "myNotes"
            navigate('/myNotes');
        }
    })

    return <ButtonAsLink onClick={deleteNote}>Delete Note</ButtonAsLink>
}

export default DeleteNote;