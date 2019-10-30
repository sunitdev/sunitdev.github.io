import * as React from 'react';

import styled from 'styled-components';

import * as ReactGA from 'react-ga';

import { Project } from '../../../models';

const Container = styled.div`
    height: fit-content;

    display:flex;

    border-radius: 20px;

    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);

    padding: 10px;
    margin: 5px 0px;

`;

interface ImageProps {
    static: string;
    animated: string;
}

const Image = styled.img<ImageProps>`
    width: 450px;
    height: 100%;

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
        display: none;
    }

`;

const CardBody = styled.div`
    width: 100%;

    padding: 0px 10px;

    display: flex;
    flex-direction: column;
`;

const ProjectTitle = styled.h1`
    text-align: center;

    /* Smartphones (portrait and landscape) ----------- */
    @media only screen and (min-device-width : 320px) and (max-device-width : 480px) {
        font-size: 3em;
    }
`;

const ProjectDescription = styled.p`

    font-size: 1.2em;

    /* Smartphones (portrait and landscape) ----------- */
    @media only screen and (min-device-width : 320px) and (max-device-width : 480px) {
        font-size: 2em;
    }
`;

const TechnologyTagContainer = styled.ul`
    list-style-type: none;
`;

const TechnologyTag = styled.li`
    display: inline;

    cursor: default;

    font-size: 0.9em;
    line-height: 20px;

    border-radius: 10px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);

    padding: 5px 10px;
    margin-right: 10px;
`;

const FooterText = styled.p`
  text-align: right;
`;

const BottomLink = styled.a`
    color: ${props => props.theme.colors.primaryLinkForeground};
    text-decoration: none;
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

        text-decoration: none;
    `;

    console.log(props.project);

    return (
        <Container>

            {
                props.project.thumbnailURL &&
                <ProjectLink>
                    <Image
                        static={props.project.thumbnailURL}
                        animated={props.project.animatedGifURL}/>
                </ProjectLink>
            }

            <CardBody>

                <StyledProjectLink>
                    <ProjectTitle>{props.project.title}</ProjectTitle>
                </StyledProjectLink>

                <ProjectDescription>{props.project.description}</ProjectDescription>

                {
                    props.project.technologies.length > 0 &&
                    <React.Fragment>
                        <h4>Technologies Used:</h4>
                        <TechnologyTagContainer>
                            {
                                props.project.technologies.map(name => (<TechnologyTag key={name}>{name}</TechnologyTag>))
                            }
                        </TechnologyTagContainer>
                    </React.Fragment>
                }

                {
                    props.project.displayURL &&
                    <FooterText><BottomLink href={props.project.url} target="_blank">{props.project.displayURL}</BottomLink></FooterText>
                }

            </CardBody>

        </Container>
    );

}

export { ProjectCard }