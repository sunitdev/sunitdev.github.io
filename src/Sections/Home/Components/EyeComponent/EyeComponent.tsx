import * as React from 'react';
import * as ReactDOM from 'react-dom';

import styled from 'styled-components';

import ScleraComponent from './ScleraComponent';
import IrisComponent from './IrisComponent';
import PupliComponent from './PupliComponent';


// Props Interface
interface IEyeComponentProps {
    height?: string;
    width?: string;

    mousePosition: {
        x: number;
        y: number;
    }
}

interface IEyeComponentState {
    irisComponent?: {
        centerX: number;
        centerY: number;
    },
    pupliComponent?: {
        centerX: number;
        centerY: number;
    }
}

interface IContainer {
    width: string;
    height: string;
}

interface IStyledIrisComponent {
    left?: number | string;
    top?: number | string;

    style?: any;
}

interface IStyledPupilComponent {
    left?: number | string;
    top?: number | string;
}


interface IPoint{
    x: number;
    y: number;
}

// Styled Components
const Container = styled.div<IContainer>`
    width: ${(props: any) => props.width};
    height: ${(props: any) => props.height};

    position: relative;

    margin-left: 10px;
    margin-right: 10px;
`;

const StyledScleraComponent = styled(ScleraComponent)`
    width: 100%;
    height: 100%;

    position: absolute;

    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;

`;

const StyledIrisComponent = styled(IrisComponent)<IStyledIrisComponent>`
    width: 50%;
    height: 50%;

    position: absolute;

    left: ${(props: any) => props.left || 0};
    right: 0;
    top: ${(props: any) => props.top || 0};
    bottom: 0;
    margin: auto;
`;

const StyledPupliComponent = styled(PupliComponent)<IStyledPupilComponent>`
    width: 25%;
    height: 25%;

    position: absolute;

    left: ${(props: any) => props.left || 0};
    right: 0;
    top: ${(props: any) => props.top || 0};
    bottom: 0;
    margin: auto;
`;

export default class EyeComponent extends React.Component<IEyeComponentProps, IEyeComponentState> {

    public static defaultProps = {
        width: '200px',
        height: '200px'
    }

    private irisComponentRef: IrisComponent;
    private pupliComponentRef: PupliComponent;

    constructor(props: IEyeComponentProps, context: IEyeComponentProps) {
        super(props, context);

        this.state = {};
    }


    componentDidMount() {

        const irishCenter: IPoint = this.getCenterOfComponent(this.irisComponentRef);
        const pupliCenter: IPoint = this.getCenterOfComponent(this.pupliComponentRef);

        this.setState({
            irisComponent: {
                centerX: irishCenter.x,
                centerY: irishCenter.y
            },

            pupliComponent: {
                centerX: pupliCenter.x,
                centerY: pupliCenter.y
            }
        });

    }


    private getCenterOfComponent(element: React.Component): IPoint {

        const boundRect = (ReactDOM.findDOMNode(element) as any).getBoundingClientRect();

        return {
            x: boundRect.right - (boundRect.width / 2),
            y: boundRect.top - (boundRect.height / 2)
        }
    }


    private getRelativePercentageBetweenPoints(point1: IPoint, point2: IPoint): IPoint{

        const sectionWidth: number = point1.x >= point2.x ? point2.x : window.innerWidth - point1.x;
        const sectionHeight: number = point1.y >= point2.y ? point2.y : window.innerHeight - point1.y;

        const horizontalDistance: number = point2.x - point1.x;
        const horizontalPercentage: number = (horizontalDistance / sectionWidth) * 100;

        const verticalDistance: number = point2.y - point1.y;
        const verticalPercentage: number = (verticalDistance / sectionHeight) * 100;

        return {
            x: horizontalPercentage,
            y: verticalPercentage
        }
    }

    private computePositionRelativeToMouse(componentCenter: IPoint): { left: string, top: string } {

        // Default position
        if (this.props.mousePosition.x === 0 && this.props.mousePosition.y === 0) {
            return {
                left: '0',
                top: '0'
            }
        }

        const relativePercentage: IPoint = this.getRelativePercentageBetweenPoints(componentCenter, {
            x: this.props.mousePosition.x,
            y: this.props.mousePosition.y
        });

        relativePercentage.x = relativePercentage.x / 2;
        relativePercentage.x = relativePercentage.x >= 0 ? Math.min(relativePercentage.x, 30) : Math.max(relativePercentage.x, -30);

        relativePercentage.y = relativePercentage.y / 2;
        relativePercentage.y = relativePercentage.y >= 0 ? Math.min(relativePercentage.y, 30) : Math.max(relativePercentage.y, -30);

        return {
            left: `${Math.round(relativePercentage.x)}%`,
            top: `${Math.round(relativePercentage.y)}%`
        }
    }

    render() {

        let irisPosition;
        if(this.state.irisComponent){
            irisPosition = this.computePositionRelativeToMouse({
                x: this.state.irisComponent.centerX,
                y: this.state.irisComponent.centerY
            });
        }else{
            irisPosition = {
                left: 0,
                top: 0
            }
        }

        let pupliPosition;
        if(this.state.pupliComponent){
            pupliPosition = this.computePositionRelativeToMouse({
                x: this.state.pupliComponent.centerX,
                y: this.state.pupliComponent.centerY
            });
        }else {
            pupliPosition = {
                left: 0,
                top: 0
            }
        }

        return (
            <Container
                height={this.props.height}
                width={this.props.width}>

                <StyledScleraComponent />

                <StyledIrisComponent
                    left={irisPosition.left}
                    top={irisPosition.top}
                    ref={(irisComponent) => this.irisComponentRef = irisComponent} />

                <StyledPupliComponent
                    left={pupliPosition.left}
                    top={pupliPosition.top}
                    ref={(pupliComponent) => this.pupliComponentRef = pupliComponent} />

            </Container>
        );
    }
}
