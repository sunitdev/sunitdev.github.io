import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    html, body {
        width: 100%;
        height: 100%;

        padding: 0px;
        margin: 0px;
    }

    body {
        background-color: ${(props: any) => props.theme.colors.backgroundPrimary};
        color: ${(props: any) => props.theme.colors.textPrimary};

        font-family: ${(props: any) => props.theme.text.fontFamily};
    }

    #app {
        width: 100%;
        height: 100%;

        padding: 0px;
        margin: 0px;
    }
`;