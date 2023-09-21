import React from "react";
import styled from 'styled-components';
import {format} from "date-fns";

//Импортируем компоненты UI авторизованного пользователя
import NoteUser from "./NoteUser";
//Импортируем локальный запрос IS_LOGGED_IN
import {IS_LOGGED_IN} from "../qql/query";

import {useQuery} from "@apollo/client";
import Loading from "../StyledComponents/Loading";

//Ограничиваем расширение заметок до 800 пикселей
const StyledNote = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

//Стилизуем метаданные заметки
const MetaData = styled.div`
  @media (min-width: 500px) {
    display: flex;
    align-items: self-start;
  }
`;

//Добавляем пространство между аватаром и метаданными
const MetaInfo = styled.div`
  padding-right: 1em;
`;

//Выравниваем 'UserActions' по правой стороне на больших экранах
const UserActions = styled.div`
  margin-left: auto;
`;
const ContentNote = styled.div`
  margin-bottom: 1em;
`;
const Note = ({note}) => {
    const {loading, error, data} = useQuery(IS_LOGGED_IN);
    //Если данные загружаются, выдаем сообщение о загрузке
    if (loading) return <Loading/>;
    //Если при получении данных произошел сбой, выдаем сообщение об ошибке
    if (error) return <p>Error!</p>

    return (
        <StyledNote>
            <MetaData>
                <MetaInfo>
                    <img
                        src={note.author.avatar}
                        alt={`${note.author.username} avatar`}
                        height="50px"
                    />{' '}
                </MetaInfo>
                <MetaInfo>
                    <em>by</em> {note.author.username} <br/>
                    {format(new Date(note.createdAt), 'dd.MM.yyyy')}
                </MetaInfo>
                {data.isLoggedIn ? (
                    <UserActions>
                        <NoteUser note={note}/>
                    </UserActions>
                ) : (
                    <UserActions>
                        <em>Favorites:</em> {note.favoriteCount}
                    </UserActions>
                )}
            </MetaData>

            <ContentNote>
                {note.content}
            </ContentNote>
        </StyledNote>
    );
};

export default Note;