import * as React from 'react';

import styled, {keyframes} from 'styled-components';

import * as FontAwesome from 'react-icons/lib/fa';


import AppButton from '../Common/Components/AppButton/AppButton';
import EyeComponent from './Components/EyeComponent/EyeComponent';


const Container = styled.div`
    padding-top: 10%;

    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    align-items: center;
`;

const EyesContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;

    @media (min-width: 961px){
        margin-top: 10em;
        margin-bottom: 1em;
    }
    @media (min-width:1025px) {
        margin-top: 1em;
        margin-bottom: 1em;
    }
`;

const StyledEyeComponent = styled(EyeComponent)`
    margin: 10px 0px;
`;

const NameText = styled.h1`
    color: ${(props: any) => props.theme.colors.textHeadingPrimary};

    font-size: 1.5em;


    @media (min-width: 961px){
        font-size: 5em;
        margin-top: 2em;
        margin-bottom: 0px;

    }
    @media (min-width:1025px) {
        font-size: 3em;
        margin-top: 1em;
        margin-bottom: 0px;
    }
`;


const BioText = styled.p`

    text-align: center;
    font-size: 2em;

    margin-bottom: 2em;

    @media (min-width: 961px){
        font-size: 3em;
        width: 80%;
    }
    @media (min-width:1025px) {
        font-size: 2em;
    }

`;

const ButtonBar = styled.div`
    width: 100%;

    display: flex;
    flex-direction: row;

    justify-content: center;
`;

const ResumeButton = styled(AppButton)`
    margin: 0px 10px;
`;

const LinkedInIcon = styled(FontAwesome.FaLinkedinSquare)`
    color: #0077b5;

    margin: 0 20px;

    font-size: 3em;

    cursor: pointer;

    @media (min-width: 961px){
        font-size: 6em;
    }
    @media (min-width:1025px) {
        font-size: 3em;
    }
`;

const GithubIcon = styled(FontAwesome.FaGithub)`
    color: black;

    margin: 0 20px;

    font-size: 3em;

    cursor: pointer;

    @media (min-width: 961px){
        font-size: 6em;
    }
    @media (min-width:1025px) {
        font-size: 3em;
    }
`;


const BounceAnimation = keyframes`
    0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-25px);
    }
    60% {
        transform: translateY(-15px);
    }
`;


const ScrollDownIcon = styled(FontAwesome.FaArrowDown)`
    color: white;

    font-size: 2em;

    margin-top: 1em;

    animation: ${BounceAnimation} 2s infinite;

    @media (min-width: 992px){
        margin-top: 1.5em;
    }
`;


interface IHomeSectionState {
    mousePosition: {
        x: number;
        y: number;
    };
}

interface IHomeSectionProps {
    className?: any;
}

export default class HomeSection extends React.Component<IHomeSectionProps, IHomeSectionState> {


    constructor(props?: IHomeSectionProps, context?: IHomeSectionState){
        super(props, context);

        this.state = {
            mousePosition: {
                x: 0,
                y: 0
            }
        };

        this.onMouseMove = this.onMouseMove.bind(this);
    }


    private onMouseMove(event: React.MouseEvent): void{
        this.setState({
            mousePosition: {
                x: event.clientX,
                y: event.clientY
            }
        })
    }

    private onGithubButtonClicked(): void{
        window.open('https://github.com/sunitdeshpande', '_blank');
    }

    private onLinkedInButtonClicked(): void {
        window.open('https://www.linkedin.com/in/sunitdeshpande/', '_blank');
    }

    render(){
        return (

            <Container
                className={this.props.className}
                onMouseMove={this.onMouseMove}>

                <EyesContainer>
                    <StyledEyeComponent
                        mousePosition={this.state.mousePosition}/>
                    <StyledEyeComponent
                        mousePosition={this.state.mousePosition}/>
                </EyesContainer>

                <NameText>Sunit Deshpande</NameText>
                <BioText>I am a Computer Engineer by profession and passion. <br/>
                I love learning, building and exploring science.</BioText>

                <ButtonBar>
                    <GithubIcon
                        onClick={this.onGithubButtonClicked}/>
                    <ResumeButton>Resume</ResumeButton>
                    <LinkedInIcon
                        onClick={this.onLinkedInButtonClicked}/>
                </ButtonBar>

                <ScrollDownIcon/>
            </Container>
       );
    }

}