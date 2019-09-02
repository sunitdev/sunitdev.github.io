import * as React from 'react';

import styled from 'styled-components';

import * as ReactGA from 'react-ga';

import { Project } from '../../../models';

const Container = styled.div`
    width: fit-content;
    height: fit-content;

    max-width: 450px;

    display: flex;
    flex-direction: column;

    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);

    /* Smartphones (portrait and landscape) ----------- */
    @media only screen and (min-device-width : 320px) and (max-device-width : 480px) {
       max-width: 90%;
       width: 90%;
    }
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
        background-size: auto;
        background-position: center;
    }

    /* Smartphones (portrait and landscape) ----------- */
    @media only screen and (min-device-width : 320px) and (max-device-width : 480px) {
        width: 100%;
        height: 500px;
    }
`;

const CardBody = styled.div`
    display: flex;
    flex-direction: column;

    padding: 5px;
`;

const ProjectTitle = styled.h1`
    text-align: center;

    /* Smartphones (portrait and landscape) ----------- */
    @media only screen and (min-device-width : 320px) and (max-device-width : 480px) {
        font-size: 3em;
    }
`;

const ProjectDescription = styled.p`
    text-align: center;

    /* Smartphones (portrait and landscape) ----------- */
    @media only screen and (min-device-width : 320px) and (max-device-width : 480px) {
        font-size: 2em;
    }
`;

interface ProjectCardProps {
    project: Project;
}

const ProjectCard: React.SFC<ProjectCardProps> = (props: ProjectCardProps) => {


    function handleOnProjectLinkClicked(event: any){

        // Prevent default action
        event.preventDefault();


        // Google analytics
        ReactGA.event({
            category: 'User',
            action: `Project Link Clicked - ${props.project.title}`
        })

        // Open project link
        window.open(props.project.url, '_blank');
    }

    // Project Link Component
    const ProjectLink: React.SFC = (linkProps: any) => (
        <a className={linkProps.className}
            href="#"
            onClick={(event: any) => handleOnProjectLinkClicked(event)}
            target='_blank'>
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