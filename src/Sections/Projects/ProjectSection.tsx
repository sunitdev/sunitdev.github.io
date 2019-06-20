import * as React from 'react';

interface IProjectSectionProps {
    className?: string;
}

export default class ProjectSection extends React.Component<IProjectSectionProps, any> {

    render(){
        return (
            <h1 className={this.props.className}>Project Section</h1>
        );
    }
}