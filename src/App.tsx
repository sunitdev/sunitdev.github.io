import * as React from 'react';

import { ThemeProvider } from 'styled-components';

import { AppTheme } from './styles/theme';
import { GlobalStyle } from './styles/GlobalStyle';
import { AppRouter } from './AppRouter';

const App = () => (

    <ThemeProvider theme={AppTheme}>

        <React.Fragment>
            <GlobalStyle/>

            <AppRouter/>

        </React.Fragment>

    </ThemeProvider>
)

export { App }
