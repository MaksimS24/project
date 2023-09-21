import React, {useEffect} from "react";
import {useMutation, useApolloClient, gql} from "@apollo/client";
import {useNavigate} from "react-router-dom";
import {IS_LOGGED_IN} from "../Components/Header";
import UserForm from "../Components/UserForm";
import Loading from "../StyledComponents/Loading";

export const SIGNUP_USER = gql`
       mutation SignUp(
          $username: String!, 
          $email: String!, 
          $password: String!
          ) {
             signUp(
                username: $username, 
                email: $email, 
                password: $password
                )
       }
    `;

// Добавляем props, передаваемой в компонент для дальнейшего использования
const SignUp = () => {

    useEffect(() => {
        // Обновляем заголовок документа
        document.title = 'Sign Up - Notedly';
    });

    const navigate = useNavigate();
    // Apollo Client
    const client = useApolloClient();
    // Добавляем хуки
    const [signUp, {loading, error}] = useMutation(SIGNUP_USER, {
            onCompleted: data => {
                // Сохраняем токен
                localStorage.setItem('token', data.signUp);
                // Обновляем локальный кеш
                client.writeQuery({query: IS_LOGGED_IN, data: { isLoggedIn: true } });
                navigate('/');
                if (loading) return null;
                if (error) return `Error! ${error}`;
            }
        }
    );

    //Отрисовываем форму
    return (
        <React.Fragment>
            <UserForm action={signUp} formType="signUp"/>
            {/* Если данные не загружаются, отображаем сообщение о загрузке */}
            {loading && <p><Loading/></p>}
            {/* Если при загрузке произошел сбой, отображаем сообщение об ошибке */}
            {error && <p>Error creating an account!</p>}
        </React.Fragment>
    );
};

export default SignUp;