import * as React from 'react';

import styled from 'styled-components';

import ContentLoader from 'react-content-loader'

const Container = styled.div`
    width: 100%;
    height: 400px;

    border-radius: 20px;

    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
`;


const ProjectLoadingCard = () => (
    <Container>
        <ContentLoader
            width={400}
            height={140}
            ariaLabel={"Loading..."}>

        </ContentLoader>
    </Container>
)

export { ProjectLoadingCard }