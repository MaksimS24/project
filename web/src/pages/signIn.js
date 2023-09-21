import React, {useEffect} from 'react';
import {gql, useApolloClient, useMutation} from "@apollo/client";
import {useNavigate} from "react-router-dom";
import UserForm from "../Components/UserForm";
import Loading from "../StyledComponents/Loading";
import {IS_LOGGED_IN} from "../Components/Header";

const SIGNIN_USER = gql`
  mutation signIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password)
  }
`;

const SignIn = () => {
    useEffect(() => {
        //Обновляем заголовок документа
        document.title = 'Sign In - Notedly';
    });

    const client = useApolloClient();
    const navigate = useNavigate();

    const [signIn, { loading, error }] = useMutation(SIGNIN_USER, {
        onCompleted: data => {
            // Сохраняем токен
            localStorage.setItem('token', data.signIn);
            // Обновляем локальный кеш
            client.writeQuery({query: IS_LOGGED_IN, data: { isLoggedIn: true } });
            // Перенаправляем на домашнюю страницу
            navigate('/');
        }
    });

    return (
        <React.Fragment>
            <UserForm action={signIn} formType="signIn"/>
            {/* Если данные загружаются, отображаем сообщение о загрузке */}
            {loading && <Loading/>}
            {/* Если при загрузке произошел сбой, отображаем сообщение об ошибке */}
            {error && <p>Error signing in</p>}
        </React.Fragment>
    );
};

export default SignIn;