import * as React from 'react';

import styled from 'styled-components';

import ContentLoader from 'react-content-loader';

import Project from '../../Services/api/Trello/models/Project';
import TrelloApi from '../../Services/api/Trello/TrelloApi';
import ProjectCard from './Components/ProjectCard/ProjectCard';


const ProjectGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: center;

    box-sizing: border-box;
    padding: 0 20%;

    overflow-y: auto;

    ::-webkit-scrollbar {
        display: none;
    }

    @media (min-width: 961px){
        grid-template-columns: 1fr;
    }
    @media (min-width:1025px) {
        grid-template-columns: 1fr 1fr;
    }
`;


const MyLoader = () => (
    <ContentLoader 
    height={475}
    width={400}
    speed={1}
    primaryColor="#c3c3c3"
    secondaryColor="#ecebeb"
  >
    <rect x="0" y="0" rx="20" ry="20" width="230" height="230" />
    <rect x="60" y="240" rx="4" ry="4" width="100" height="10" />
    <rect x="15" y="260" rx="4" ry="4" width="200" height="10" />

  </ContentLoader>
  );

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

interface IProjectSectionProps {
    className?: string;
}

interface IProjectSectionState {
    projects: Project[];
    isLoading: boolean;
}

export default class ProjectSection extends React.Component<IProjectSectionProps, IProjectSectionState> {

    constructor(props: IProjectSectionProps, context: IProjectSectionState){
        super(props, context);

        this.state = {
            projects:[],
            isLoading: true
        }

        this.getProjects = this.getProjects.bind(this);

        this.getProjects();
    }

    render(){

        const projectCards = this.state.projects.map((project: Project, index: number) => <ProjectCard project={project} key={index}/>);
        const loadingContext = [
            <MyLoader key={1}/>,
            <MyLoader key={2}/>
        ];

        return (
            <Container>
                <ProjectGrid className={this.props.className}>
                    {
                        this.state.isLoading ? loadingContext : projectCards

                    }
                </ProjectGrid>
            </Container>
        );
    }

    private getProjects(): void {

        TrelloApi.getProjects()
            .then((projects: Project[]) => {
                this.setState({
                    projects,
                    isLoading: false
                })}
            );
    }
}