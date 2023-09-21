import React from 'react';


//Импортируем маршруты
import Pages from './pages';
import {BrowserRouter} from "react-router-dom";


const App = () => {
    return (
        <BrowserRouter>
            <Pages/>
        </BrowserRouter>
    );
};

export default App;