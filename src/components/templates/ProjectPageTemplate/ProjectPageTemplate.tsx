import * as React from 'react';

import styled from 'styled-components';

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

`;


interface ProjectPageTemplateProps {
    header: JSX.Element[] | JSX.Element;
    projects: JSX.Element[] | JSX.Element;
}

const ProjectPageTemplate: React.SFC<ProjectPageTemplateProps> = (props: ProjectPageTemplateProps) => (
    <Container>
        <Header>
            {props.header}
        </Header>
        <ProjectGrid>
            {props.projects}
        </ProjectGrid>
    </Container>
);

export { ProjectPageTemplate }
