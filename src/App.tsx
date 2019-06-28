import * as React from 'react';

import { ThemeProvider } from 'styled-components';

import { AppTheme } from './styles/theme';
import { GlobalStyle } from './styles/GlobalStyle';

const App = () => (

    <ThemeProvider theme={AppTheme}>

        <React.Fragment>
            <GlobalStyle/>
            <h1>App Header</h1>
        </React.Fragment>

    </ThemeProvider>
)

export { App }
