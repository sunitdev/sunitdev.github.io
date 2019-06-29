import * as React from 'react';

import styled from 'styled-components';

const HeadingText = styled.h1`
    font-family: ${props => props.theme.font.heading};

    font-size: 2em;
`;

export { HeadingText }
