import * as React from 'react';

import styled from 'styled-components';

import { ParticleBackground } from '../../atoms/ParticleBackground';


const Container = styled.div`
    width: 100%;
    height: 100%;

    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto 1fr auto;
`;

const Footer = styled.div`
`;

const EyeBar = styled.div`
    align-self: flex-end;

    margin-bottom: 20px;
`;

const NameAndBio = styled.div`
`;

const IconBar = styled.div`
    margin-top: 20px;
`;

interface HomePageTemplateProps {
    eyeBar: JSX.Element;
    nameAndBio: JSX.Element;
    iconBar: JSX.Element;
    footer: JSX.Element;
}

const HomePageTemplate: React.SFC<HomePageTemplateProps> = (props: HomePageTemplateProps) => (
    <React.Fragment>

        <ParticleBackground/>

        <Container>
            <EyeBar>{props.eyeBar}</EyeBar>
            <NameAndBio>{props.nameAndBio}</NameAndBio>
            <IconBar>{props.iconBar}</IconBar>
            <Footer>{props.footer}</Footer>
        </Container>

    </React.Fragment>
);

export { HomePageTemplate }