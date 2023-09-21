import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
//Импортируем стили
import './CSS/GlobalStyle.css';
import './CSS/index.css';
import './CSS/StyledLoading.css';

//Импортируем библиотеку Apollo Client
import {
    ApolloClient,
    ApolloProvider, createHttpLink,
    InMemoryCache,
} from '@apollo/client';
import {setContext} from "@apollo/client/link/context";
import {IS_LOGGED_IN} from "./Components/Header";

const uri = "http://localhost:4000/api";
const httpLink = createHttpLink({ uri })
const cache = new InMemoryCache();

const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            authorization: localStorage.getItem('token') || ''
        }
    }
})

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache,
    resolvers: {},
    connectToDevTools: true,
});

//Проверяем наличие токена
const data = {
    isLoggedIn: localStorage.getItem('token')
}
//Записываем кэшированные данные при начальной загрузке
cache.writeQuery({query: IS_LOGGED_IN, data});
//Записываем данные кэша после его сброса
client.onResetStore(() => cache.writeQuery({query: IS_LOGGED_IN, data}));

//Проверяем наличие локального токена
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
        <App/>
        </ApolloProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
