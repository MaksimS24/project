import React from 'react';

import {Navigate, Outlet, Route, Routes} from 'react-router-dom';

// import our shared layout component
import Layout from '../Components/Layout';

// import our route
import Home from './home';
import MyNotes from './myNotes';
import Favorites from './favorites';
import SignUp from "./signUp";
import SignIn from "./signIn";
import NewNote from "./new";
import Note from "./note";
import {gql, useQuery} from "@apollo/client";
import Loading from "../StyledComponents/Loading";
import Edit from "./edit";

const IS_LOGGED_IN = gql`{
  isLoggedIn @client
}`;
// Роутинг
const Pages = () => {
    return (
        <div>
            <Layout>
                <Routes>
                    <Route exact path="project/" element={<Home/>}/>
                    <Route exact element={<PrivateRoute/>}>
                        <Route path="/myNotes" element={<MyNotes/>}/>
                        <Route path="/favorites" element={<Favorites/>}/>
                        <Route path="/new" element={<NewNote/>}/>
                        <Route path="/edit/:id" element={<Edit/>}/>
                    </Route>
                    <Route path="/note/:id"element={<Note/>}/>
                    <Route path="/signUp" element={<SignUp/>}/>
                    <Route path="/signIn" element={<SignIn/>}/>
                </Routes>
            </Layout>
            <Outlet/>
        </div>
    );
};


// Добавляем Redirect в импорт в react-router
const PrivateRoute = () => {
    const {loading, error, data} = useQuery(IS_LOGGED_IN);
    if (loading) return <Loading/>;
    if (error) return <p>Error!</p>

    return data.isLoggedIn ? <Outlet/> : ( <Navigate to="/signIn"/>)
}

export default Pages;