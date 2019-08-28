import 'styled-components'

// App theme interface
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primaryBackground: string;

      primaryTextForeground: string;
      secondaryTextForeground: string;

      githubCornerIconBackground: string;
      githubCornerIconForeground: string;
    },

    font: {
        primary: string;
        heading: string;
    }

  }
}