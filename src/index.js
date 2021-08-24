import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {BrowserRouter} from 'react-router-dom'
import {AuthContextProvider} from "./store/auth-context";
import {Provider} from "react-redux";
import store from './store/index'

ReactDOM.render(
        <BrowserRouter>
            <Provider store={store}>
                <AuthContextProvider>
                    <App />
                </AuthContextProvider>
            </Provider>
        </BrowserRouter>,
  document.getElementById('root')
);

