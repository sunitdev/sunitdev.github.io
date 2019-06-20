import 'styled-components'

declare module 'styled-components' {

    export interface DefaultTheme {

        colors: {
            backgroundPrimary: string,
            backgroundSecondary: string,

            textPrimary: string;
            textHeadingPrimary: string;
            textHeadingSecondary: string;

            defaultButtonColor: string;
        },

        text: {
            fontFamily: string
        }
    }
}
