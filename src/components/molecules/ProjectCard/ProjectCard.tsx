import * as React from 'react';

import styled from 'styled-components';

import { Project } from '../../../models';

const Container = styled.div`
    width: fit-content;
    height: fit-content;

    max-width: 450px;

    display: flex;
    flex-direction: column;

    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
`;

interface ImageProps {
    static: string;
    animated: string;
}

const Image = styled.img<ImageProps>`
    width: 450px;
    height: 350px;

    background-image: url("${(props: ImageProps) => props.static }");
    background-repeat: no-repeat;
    background-size: 100% 100%;

    :hover {
        background-image: url(${(props: ImageProps) => props.animated });
    }
`;

const CardBody = styled.div`
    display: flex;
    flex-direction: column;

    padding: 5px;
`;

const ProjectTitle = styled.h1`
`;

const ProjectDescription = styled.p`
`;

interface ProjectCardProps {
    project: Project;
}

const ProjectCard: React.SFC<ProjectCardProps> = (props: ProjectCardProps) => {

    // Project Link Component
    const ProjectLink: React.SFC = (linkProps: any) => (
        <a className={linkProps.className} href={props.project.url} target='_blank'>
            {linkProps.children}
        </a>
    );
    const StyledProjectLink = styled(ProjectLink)`
        color: ${props => props.theme.colors.primaryTextForeground};
    `;

    return (
        <Container>

            <StyledProjectLink>
                    <Image
                        static={props.project.thumbnailURL}
                        animated={props.project.animatedGifURL}/>
            </StyledProjectLink>

            <CardBody>

                <StyledProjectLink>
                    <ProjectTitle>{props.project.title}</ProjectTitle>
                </StyledProjectLink>

                <ProjectDescription>{props.project.description}</ProjectDescription>
            </CardBody>

        </Container>
    );

}

export { ProjectCard }