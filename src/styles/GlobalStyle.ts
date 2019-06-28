import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    html, body {
        width: 100%;
        height: 100%;

        padding: 0px;
        margin: 0px;
    }

    body {
        background-color: ${props => props.theme.colors.primaryBackground};

        font-family: ${props => props.theme.font.primary};
    }
`;

export { GlobalStyle }
