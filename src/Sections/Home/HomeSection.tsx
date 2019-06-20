import * as React from 'react';

import styled from 'styled-components';

import EyeComponent from './Components/EyeComponent/EyeComponent';


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
            <h1 className={this.props.className}>Home Component</h1>
       );
    }

}