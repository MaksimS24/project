import React from 'react';
//Импортируем зависимости GraphQL
import {useQuery} from "@apollo/client";

//Импортируем компонент Note
import Note from '../Components/Note';
import Loading from "../StyledComponents/Loading";
import {useParams} from "react-router-dom";
import {GET_NOTE} from "../qql/query";

const NotePage = props => {
    //Сохраняем id из url в виде переменной
    const {id} = useParams(props);
    console.log(id);
    //Запрашиваем хук, передавая значение id в качестве переменной
    const { loading, error, data } = useQuery(GET_NOTE, { variables: { id } });

    //Если данные не загружаются, отображаем сообщение о загрузке
    if (loading) return <div><Loading/></div>;
    //Если при получении данных произошел сбой, отображаем сообщение об ошибке
    if (error) return <div>Error! Note not found</div>

    //Если загрузка данных произошла успешно, отображаем их в UI
    return <Note note={data.note}/>
};
export default NotePage;