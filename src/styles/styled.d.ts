import 'styled-components'

// App theme interface
declare module 'styled-components' {
  export interface DefaultTheme {

    colors: {
      primaryBackground: string;
      primaryTextForeground: string;
    },

    font: {
        primary: string;
        heading: string;
    }

  }
}