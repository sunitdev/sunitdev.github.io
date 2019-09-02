import * as React from 'react';

import styled from 'styled-components';

import { EyeComponent } from '../../molecules/EyeComponent';

const Container = styled.div`
    display: flex;

    flex-direction: row;
    justify-content: center;
`;

const EyeBar = () => {

    const width: string = window.screen.width >= 450 ? '150px' : '250px';
    const height: string = window.screen.width >= 450 ? '150px' : '250px';

    return (
        <Container>
            <EyeComponent width={width} height={height} />
            <EyeComponent width={width} height={height} />
        </Container>
    )
};

export { EyeBar }