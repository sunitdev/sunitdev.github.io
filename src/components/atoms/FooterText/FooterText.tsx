import * as React from 'react';

import styled from 'styled-components';

const Text = styled.p`
    text-align: center;

    font-size: 0.8em;
`;

const FooterText = () => (
    <Text>Copyright &copy; {new Date().getFullYear()} - Sunit Deshpande</Text>
);

export { FooterText }