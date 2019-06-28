import 'styled-components'

// App theme interface
declare module 'styled-components' {
  export interface DefaultTheme {

    colors: {
      primaryBackground: string;
    },

    font: {
        primary: string;
    }

  }
}