import * as React from 'react';

import styled from 'styled-components';

import EyeComponent from './Components/EyeComponent/EyeComponent';


interface IHomeSectionState {
    mousePosition: {
        x: number;
        y: number;
    };
}


const Container = styled.div`
    height: 100%;
    width: 100%;

    display: flex;

    justify-content: center;
    align-items: center;
`;

export default class HomeSection extends React.Component<any, IHomeSectionState> {


    constructor(props?: any, context?: IHomeSectionState){
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
                onMouseMove={this.onMouseMove}>
                <EyeComponent
                    mousePosition={this.state.mousePosition}/>
                <EyeComponent
                    mousePosition={this.state.mousePosition}/>
            </Container>
        );
    }

}