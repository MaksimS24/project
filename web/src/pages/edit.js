import React from 'react';
import {useQuery, useMutation} from '@apollo/client';
import {useNavigate, useParams} from "react-router-dom";
// Импортируем компонент NoteForm
import NoteForm from '../Components/NoteForm';
//gql
import {GET_NOTE, GET_ME} from '../qql/query';
import {EDIT_NOTE} from "../qql/mutation";
//animation
import Loading from "../StyledComponents/Loading";

const EditNote = props => {
    //Сохраняем id, полученный из url, в виде переменной
    const {id} = useParams(props);
    //Определим запрос заметки
    const {loading, error, data} = useQuery(GET_NOTE, { variables: {id} });
    //Получаем информацию о текущем пользователе
    const {data: userdata} = useQuery(GET_ME);
    //Определим мутацию
    const navigate = useNavigate();
    const [editNote] = useMutation(EDIT_NOTE, {
        variables: {
            id
        },
        onCompleted: () => {
            navigate(`/note/${id}`)
        }
    })
    //Если данные не загружаются, выдаем сообщение о загрузке
    if (loading) return <Loading/>;
    //Если при получении данных произошел сбой, выдаем сообщение об ошибке
    if (error) return <p>Error! Note not found</p>;
    //Если текущий пользователь не соответствует автору заметки,
    //возвращаем соответствующее сообщение
    if (userdata.me.id !== data.note.author.id) {
        return <p>You do not have access to edit this note</p>
    }
    //В случае успеха передаем данные в компонент note
    return <NoteForm content={data.note.content} action={editNote}/>;
}
export default EditNote;