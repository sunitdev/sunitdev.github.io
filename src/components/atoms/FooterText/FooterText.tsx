import * as React from 'react';

import styled from 'styled-components';

const Text = styled.p`
    text-align: center;

    font-size: 0.8em;

    /* Smartphones (portrait and landscape) ----------- */
    @media only screen and (min-device-width : 320px) and (max-device-width : 480px) {
        font-size: 1.5em;
    }
`;

const FooterText = () => (
    <Text>Copyright &copy; {new Date().getFullYear()} - Sunit Deshpande</Text>
);

export { FooterText }