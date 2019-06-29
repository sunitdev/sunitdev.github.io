import * as React from 'react';

import styled from 'styled-components';

import * as TrelloService from '../../../services/Trello';

import { ProjectPageTemplate } from '../../templates/ProjectPageTemplate';

import { Project } from '../../../models';

import { IconButton } from '../../atoms/IconButton';
import { HeadingText } from '../../atoms/HeadingText';
import { ProjectCard } from '../../molecules/ProjectCard';
import { ProjectLoadingCard } from '../../molecules/ProjectLoadingCard';

const LeftArrowIcon = require('../../../assets/images/arrow_left.png');


const HeaderText = styled(HeadingText)`
    width: 100%;

    text-align: center;
`;

const LeftArrowButton = styled(IconButton)`
    max-width: 30px;
    max-height: 30px;

    margin: 0px 10px;

    /* Smartphones (portrait and landscape) ----------- */
    @media only screen and (min-device-width : 320px) and (max-device-width : 480px) {
        max-width: 60px;
        max-height: 60px;
    }
`;

const ProjectPage: React.SFC = (props: any) => {

    // State to save projects
    const [projects, setProjects] = React.useState<Project[]>(undefined);
    React.useEffect(() => {
        getProjectList();
    }, []);


    /**
     * Get projects from trello api and update state
     */
    function getProjectList(){

        TrelloService.getProjects()
            .then((projects: Project[]) => setProjects(projects));
    }

    /**
     * Handel back icon button click
     */
    function handleLeftArrowButtonClicked(){
        props.history.push('/');
    }

    return(
        <ProjectPageTemplate
            header={
                <React.Fragment>

                    <LeftArrowButton
                        src={LeftArrowIcon}
                        onClick={handleLeftArrowButtonClicked}/>

                    <HeaderText>Projects</HeaderText>
                </React.Fragment>
            }

            projects={
                <React.Fragment>
                    {
                        projects === undefined ?

                        <React.Fragment>
                            <ProjectLoadingCard/>
                        </React.Fragment> :

                        projects.map((item: Project) => <ProjectCard project={item} key={item.url}/>)
                    }

                </React.Fragment>
            }/>
    );
}

export { ProjectPage }