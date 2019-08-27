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
    grid-template-columns: 1fr 1fr 1fr;

    overflow: auto;

    padding: 5px;
    grid-row-gap: 20px;

    align-items: center;
    justify-items: center;

    /* Smartphones (portrait and landscape) ----------- */
    @media only screen and (min-device-width : 320px) and (max-device-width : 480px) {
        grid-template-columns: 1fr;
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
