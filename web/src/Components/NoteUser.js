import React from "react";
import {useQuery} from "@apollo/client";
import {Link} from "react-router-dom";

//Импортируем запрос GET_ME
import {GET_ME} from "../qql/query";
import Loading from "../StyledComponents/Loading";
import styled from "styled-components";
import DeleteNote from "./DeleteNote";
import FavoriteNote from "./FavoriteNote";

const EditLink = styled.div`
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

const DeleteLink = styled.div`
  margin-top: 8px;
  text-decoration: none;
  color: #000;
  padding: 3px;
  border: 1px solid #0077cc;
  background: #e2e5f5;
  border-radius: 4px;

  :hover,
  :focus {
    color: #0077cc;
    border: 1px solid #e2e5f5;
`;

const FavoriteLink = styled.div`
    margin-top: 8px;
    text-decoration: none;
    color: #000;
    padding: 3px;
    border: 1px solid #0077cc;
    background: #e2e5f5;
    border-radius: 4px;
  
  :hover,
  :focus {
    color: #0077cc;
    background: #e2e5f5;
    border: 1px solid #e2e5f5;

`;


const NoteUser = props => {
    const {loading, error, data} = useQuery(GET_ME);
    //Если данные загружаются, выдаем сообщение о загрузке
    if (loading) return <Loading/>;
    //Если при получении данных произошел сбой, выдаем сообщение об ошибке
    if (error) return <p>Error!</p>
    return (
        <React.Fragment>
            {data.me.id === props.note.author.id && (
                <React.Fragment>
                    <EditLink>
                        <Link to={`/edit/${props.note.id}`}>Edit</Link>
                    </EditLink>
                    <DeleteLink>
                        <DeleteNote noteId={props.note.id}/>
                    </DeleteLink>
                </React.Fragment>
            )}
            <FavoriteLink>
                <FavoriteNote
                    me={data.me}
                    noteId={props.note.id}
                    favoriteCount={props.note.favoriteCount}
                />
            </FavoriteLink>
        </React.Fragment>
        );
};

export default NoteUser;

