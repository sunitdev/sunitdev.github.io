import * as React from 'react';

import styled from 'styled-components';

import { IconButton } from '../../atoms/IconButton';

interface IconBarProps {
    children: JSX.Element[] | JSX.Element;
}

const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;

    > * {
        margin: 0px 20px;
    }
`;


const IconBar: React.SFC<IconBarProps> = (props: IconBarProps) => (
    <Container>
        {props.children}
    </Container>
)

export { IconBar }
