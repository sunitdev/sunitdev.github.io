import * as React from 'react';

import styled from 'styled-components';

const HeadingText = styled.h1`
    font-family: ${props => props.theme.font.heading};

    font-size: 2em;

    /* Smartphones (portrait and landscape) ----------- */
    @media only screen and (min-device-width : 320px) and (max-device-width : 480px) {
        font-size: 4em;
    }
`;

export { HeadingText }
