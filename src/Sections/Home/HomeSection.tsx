import * as React from 'react';

import styled from 'styled-components';

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

    margin-top: 1em;
    margin-bottom: 1em;
`;

const StyledEyeComponent = styled(EyeComponent)`
    margin: 10px 0px;
`;

const NameText = styled.h1`
    color: ${(props: any) => props.theme.colors.textHeadingPrimary};

    font-size: 3em;

    margin: 1em 0px;
`;

const BioText = styled.p`
    font-size: 2em;

    text-align: center;

    margin: 0px 0px 2em 0px;
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

                <AppButton>Resume</AppButton>

            </Container>
       );
    }

}