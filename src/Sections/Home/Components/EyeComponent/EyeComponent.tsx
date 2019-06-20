import * as React from 'react';
import * as ReactDOM from 'react-dom';

import styled from 'styled-components';

import { ScleraComponent } from './ScleraComponent';
import { IrisComponent } from './IrisComponent';
import { PupliComponent } from './PupilComponent';


// Interface to store x,y point
interface IPoint{
    x: number;
    y: number;
}

// Container interface and component
interface IContainer {
    width: string;
    height: string;
}

const Container = styled.div<IContainer>`
    width: ${(props: any) => props.width};
    height: ${(props: any) => props.height};

    position: relative;

    margin-left: 10px;
    margin-right: 10px;
`;


// Eyes Props Interface
interface IEyeComponentProps {
    height?: string;
    width?: string;

    mousePosition: {
        x: number;
        y: number;
    }
}

// Eyes state Interface
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


export default class EyeComponent extends React.Component<IEyeComponentProps, IEyeComponentState> {

    public static defaultProps = {
        width: '200px',
        height: '200px'
    }

    private irisComponentRef: any;
    private pupliComponentRef: any;

    constructor(props: IEyeComponentProps, context: IEyeComponentProps) {
        super(props, context);

        // Init state
        this.state = {};
    }


    /**
     * On mount save the location of iris and pupli component
     */
    componentDidMount() {

        // Center center of components
        const irisCenter: IPoint = this.getCenterOfComponent(this.irisComponentRef);
        const pupliCenter: IPoint = this.getCenterOfComponent(this.pupliComponentRef);

        this.setState({
            irisComponent: {
                centerX: irisCenter.x,
                centerY: irisCenter.y
            },

            pupliComponent: {
                centerX: pupliCenter.x,
                centerY: pupliCenter.y
            }
        });

    }

    render() {

        // Compute location of iris based on mouse position
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

        // Compute location of pupli based on mouse location
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

                <ScleraComponent />

                <IrisComponent
                    left={irisPosition.left}
                    top={irisPosition.top}
                    ref={(irisComponent) => this.irisComponentRef = irisComponent} />

                <PupliComponent
                    left={pupliPosition.left}
                    top={pupliPosition.top}
                    ref={(pupliComponent) => this.pupliComponentRef = pupliComponent} />

            </Container>
        );
    }


    // Pirvate methods

    /**
     * Return location of center point of the component
     *
     * @param element React Component
     */
    private getCenterOfComponent(element: React.Component): IPoint {

        const boundRect = (ReactDOM.findDOMNode(element) as any).getBoundingClientRect();

        return {
            x: boundRect.right - (boundRect.width / 2),
            y: boundRect.top - (boundRect.height / 2)
        }
    }


    /**
     * Return relative percentage (between -100% to 100%) distance between the point
     *
     * @param point1 Location of point1
     * @param point2 Location of point2
     */
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

    /**
     * Return how far in percentage the component has to move (top and left) compare to current mouse position
     *
     * @param componentCenter Center point of a component
     */
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
}
