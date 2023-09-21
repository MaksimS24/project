import React, { useEffect } from "react";
import {useQuery} from "@apollo/client";

import NoteFeed from "../Components/NoteFeed";

import {GET_MY_FAVORITES} from "../qql/query";
import Loading from "../StyledComponents/Loading";

const Favorites = () => {
    useEffect(() => {
        //Обновляем заголовок документа
        document.title = 'Favorites - Notedly';
    });

    const {loading, error, data} = useQuery(GET_MY_FAVORITES);

    //Если данные загружаются, выдаем сообщение о загрузке
    if (loading) return <Loading/>;
    //Если при получении данных произошел сбой, выдаем сообщение об ошибке
    if (error) return `Error! ${error.message}`;
    //Если запрос выполнен успешно и содержит заметки, возвращаем их в ленту
    //Если же запрос выполнен успешно, но заметок не содержит,
    //выдаем сообщение "No favorites notes yet"
    if (data.me.favorites.length !== 0) {
        return <NoteFeed notes={data.me.favorites}/>
    } else {
        return <p>No favorites notes yet</p>
    }
};

export default Favorites;