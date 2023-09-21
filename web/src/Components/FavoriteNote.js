import React, {useState} from "react";
import {useMutation} from "@apollo/client";

import ButtonAsLink from "./ButtonAsLink";
import {TOGGLE_FAVORITE} from "../qql/mutation";
import {GET_MY_FAVORITES} from "../qql/query";

const FavoriteNote = props => {
    //Сохраняем число избранных заметок пользователя как состояние
    const [count, setCount] = useState(props.favoriteCount);

    //Если пользователь отметил заметку как избранную, сохраняем
    //это как состояние
    const [favorited, setFavorited] = useState(
        //Проверяем, присутствуют ли заметки в списке избранных
        props.me.favorites.filter(note => note.id === props.noteId).length > 0
    );

    //Хук мутации
    const [toggleFavorite] = useMutation(TOGGLE_FAVORITE, {
        variables: {
            id: props.noteId
        },
        //Повторно получаем запрос GET_MY_FAVORITES для обновления кэша
        refetchQueries:[{ query: GET_MY_FAVORITES}]
    })

    //Если пользователь добавил заметку в избранное, отображаем
    //вариант ее удаления из списка.
    //В противном случае отображаем вариант ее добавления
    return (
            <React.Fragment>
                {favorited ? (
                    <ButtonAsLink
                        onClick={() => {
                            toggleFavorite().then(r => console.log());
                            setFavorited(false);
                            setCount(count -1);
                        }}
                        >
                        Favorite
                    </ButtonAsLink>
                ) : (
                    <ButtonAsLink
                        onClick={() => {
                            toggleFavorite().then(r => console.log());
                            setFavorited(true);
                            setCount(count +1);
                        }}
                        >
                        Favorite
                    </ButtonAsLink>
                )}
                : {count}
            </React.Fragment>
        )
}

export default FavoriteNote;