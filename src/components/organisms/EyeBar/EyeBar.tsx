import * as React from 'react';

import styled from 'styled-components';

import { EyeComponent } from '../../molecules/EyeComponent';


const Container = styled.div`
    display: flex;

    flex-direction: row;
    justify-content: center;
`;

const EyeBar = () => (
    <Container>
        <EyeComponent />
        <EyeComponent />
    </Container>
);

export { EyeBar }