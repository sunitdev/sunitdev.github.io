import * as React from 'react';

import styled from 'styled-components';

import { GithubCornerIcon } from '../../atoms/GithubCornerIcon'

const Container = styled.div`
    width: 100%;
    height: 100%;

    display: grid;
    grid-template-rows: auto 1fr;

    padding: 5px;
    box-sizing: border-box;
`;

const Header = styled.div`
    display: flex;
    flex-direction: row;

    align-items: center;
`;

const ProjectGrid = styled.div`

    display: grid;
    grid-template-columns: 20% 1fr 20%;

    padding: 10px 0px;
    box-sizing: border-box;

    grid-row-gap: 20px;

    overflow: auto;


    /* Smartphones (portrait and landscape) ----------- */
    @media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
        grid-template-columns: 5% 1fr 5%;
    }


    /* Desktops and laptops ----------- */
    @media only screen and (min-width: 1224px) {
        grid-template-columns: 15% 1fr 15%;
    }

    /* Large screens ----------- */
    @media only screen and (min-width: 1824px) {
        grid-template-columns: 20% 1fr 20%;
    }


    > * {
        grid-column-start: 2;
    }
`;


interface ProjectPageTemplateProps {
    header: JSX.Element[] | JSX.Element;
    projects: JSX.Element[] | JSX.Element;
}

const ProjectPageTemplate: React.SFC<ProjectPageTemplateProps> = (props: ProjectPageTemplateProps) => (
    <React.Fragment>
        <GithubCornerIcon/>

        <Container>
            <Header>
                {props.header}
            </Header>
            <ProjectGrid>
                {props.projects}
            </ProjectGrid>
        </Container>
    </React.Fragment>
);

export { ProjectPageTemplate }
