import 'styled-components'

declare module 'styled-components' {

    export interface DefaultTheme {

        colors: {
            backgroundPrimary: string,
            backgroundSecondary: string,

            textPrimary: string;
            textHeadingPrimary: string;
            textHeadingSecondary: string;
        },

        text: {
            fontFamily: string
        }
    }
}
