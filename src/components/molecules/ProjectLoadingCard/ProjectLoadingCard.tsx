import * as React from 'react';

import styled from 'styled-components';

import ContentLoader from 'react-content-loader'

const Container = styled.div`
    width: 450px;
    height: 500px;

    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
`;


const ProjectLoadingCard = () => (
    <Container>
        <ContentLoader
            width={450}
            height={500}
            ariaLabel={"Loading..."}>

            <rect x="0" y="0" rx="0" ry="0" width="450" height="350" />

            <rect x="10" y="380" rx="4" ry="4" width="280" height="13" />

            <rect x="10" y="410" rx="4" ry="4" width="420" height="13" />
            <rect x="10" y="440" rx="4" ry="4" width="420" height="13" />

        </ContentLoader>
    </Container>
)

export { ProjectLoadingCard }