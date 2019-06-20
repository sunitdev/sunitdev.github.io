import * as React from 'react';

import { ThemeProvider } from 'styled-components';

import { AppTheme } from './styles/theme';
import { GlobalStyle } from './styles/global';
import AppLayout from './AppLayout/AppLayout';

export default class App extends React.Component {

    render(){
        return (
            <ThemeProvider theme={AppTheme}>
                <React.Fragment>
                    <GlobalStyle/>
                    <AppLayout/>
                </React.Fragment>
            </ThemeProvider>
        );
    }
}


