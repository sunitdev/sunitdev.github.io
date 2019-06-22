import * as React from 'react';

import styled from 'styled-components';

import Project from '../../../../Services/api/Trello/models/Project';


const Container = styled.div`
    display: flex;
    flex-direction: column;

    align-items: center;
`;

interface IThumbnailProps {
    static: string;
    animated: string;
}

const Thumbnail = styled.img<IThumbnailProps>`
    width: 250px;
    height: 250px;

    border-radius: 20px;

    box-shadow: 0 10px 16px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);


    :hover{
        background: url(${(props: IThumbnailProps) => props.animated}) no-repeat;
        background-size: 100% 100%;

    }

    @media (min-width: 961px){
        width: 400px;
        height: 400px;

        background: url(${(props: IThumbnailProps) => props.animated}) no-repeat;
        background-size: 100% 100%;
    }

    @media (min-width:1025px) {
        width: 250px;
        height: 250px;

        background: url(${(props: IThumbnailProps) => props.static}) no-repeat;
        background-size: 100% 100%;
    }
`;

const Title = styled.h3`
    color: ${(props: any) => props.theme.colors.textHeadingPrimary};

    margin: 1em 0px;

    @media (min-width: 961px){
        font-size: 3em;
    }
    @media (min-width:1025px) {
        font-size: 1.5em;
    }
`;

const Description = styled.p`
    margin: 0px;

    @media (min-width: 961px){
        font-size: 2em;
    }
    @media (min-width:1025px) {
        font-size: 1em;
    }
`;

interface IProjectCardProps {
    project: Project;
}

export default class ProjectCard extends React.Component<IProjectCardProps, any> {

    render(){
        return (
            <Container>
                <Thumbnail static={this.props.project.thumbnail} animated={this.props.project.animatedGif}/>
                <Title>{this.props.project.title}</Title>
                <Description>{this.props.project.description}</Description>
            </Container>
        );
    }
}