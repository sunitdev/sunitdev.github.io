import * as React from 'react';

import styled from 'styled-components';


interface IIrisComponentProp {
    className?: string;
}


const Circle = styled.span`
    border-radius: 50%;

    background: #51b2d5;
    box-shadow: inset 0 0 18px rgba(0, 0, 0, .5), inset 0 0 30px #1b4e6d;

`;


export default class IrisComponent extends React.Component<IIrisComponentProp, any> {


    render(){
        return(
            <Circle
                className={this.props.className}/>
        );
    }

}