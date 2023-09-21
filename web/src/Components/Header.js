import React from "react";
import styled from 'styled-components';
import logo from "../Image/logo.svg";

//Новые зависимости
import {useQuery, gql} from "@apollo/client";
import {Link, useNavigate} from "react-router-dom";
//Импортируем компонент ButtonAsLink
import ButtonAsLink from "./ButtonAsLink";

//Локальный запрос
export const IS_LOGGED_IN = gql`
   {
      isLoggedIn @client
   }`;

const HeaderBar = styled.header`
  width: 100%;
  padding: 0.5em 1em;
  display: flex;
  height: 64px;
  position: fixed;
  align-items: center;
  background-color: #e2e5f5;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.25);
  z-index: 1;
`;

const LogoText = styled.h1`
  margin: 0;
  padding: 0;
  display: inline;
`;

const UserState = styled.div`
  margin-left: auto;
`;

const Header = () => {
    //Хук запроса для проверки состояния авторизации пользователя
    //включая client для обращения к хранилищу Apollo
    const {data, client} = useQuery(IS_LOGGED_IN);
    const navigate = useNavigate();

    const logout = () => {
        //Удаляем токен
        localStorage.removeItem('token');
        //Очищаем кеш приложения
        client.onResetStore({data: {isLoggedIn: false}});
        //Обновляем локальное состояние
        client.writeQuery({query: IS_LOGGED_IN, data: {isLoggedIn: false}});
        //Обновляем страницу
        window.location.reload();
        //Перенаправляем пользователя на домашнюю страницу
        navigate('/');
    }
    // console.log(data);

    return (
        <HeaderBar>
            <img src={logo} alt="Notedly Logo" height="40"/>
            <LogoText>Notedly</LogoText>
            {/* Если пользователь авторизован, отображаем ссылку logout,
            в противном случае отображаем варианты sign in и sign up */}
            <UserState>
                {data.isLoggedIn ? (
                    <ButtonAsLink
                        onClick={logout}
                    >
                        Logout
                    </ButtonAsLink>
                ) : (
                    <p>
                        <Link to='/signin'>Sign In</Link> or{' '}
                        <Link to='/signup'>Sign Up</Link>
                    </p>
                )
                }
            </UserState>
        </HeaderBar>
    );
};
export default Header;