import * as React from 'react';

import styled from 'styled-components';

import { HomePageTemplate } from '../../templates/HomePageTemplate';

import { FooterText } from '../../atoms/FooterText';
import { EyeBar } from '../../organisms/EyeBar';
import { IconBar } from '../../organisms/IconBar';
import { IconButton } from '../../atoms/IconButton';

const GithubLogo  = require('../../../assets/images/github_logo.jpg');
const ProjectIcon  = require('../../../assets/images/project_icon.png');
const LinkedInLogo = require('../../../assets/images/linked_in_logo.png');

const NameText = styled.h1`
    text-align: center;

    font-family: 'Dancing Script', cursive;
    font-size: 2.5em;
`;


const HomePage = (props: any) => {

    function handelGithubIconClicked(){
        window.open('https://github.com/sunitdeshpande', '_blank');
    }

    function handelProjectIconClicked(){
        props.history.push('/projects/');
    }

    function handelLinkedInIconClicked() {
        window.open('https://www.linkedin.com/in/sunitdeshpande/', '_blank');
    }

    return (
        <HomePageTemplate
            eyeBar={
                <EyeBar/>
            }

            nameAndBio = {
                <NameText>Sunit Deshpande</NameText>
            }

            iconBar = {
                <IconBar>
                    <IconButton
                        src={GithubLogo}
                        toolTip={'Github'}
                        onClick={handelGithubIconClicked}/>
                    <IconButton
                        src={ProjectIcon}
                        toolTip={'Projects'}
                        onClick={handelProjectIconClicked}/>
                    <IconButton
                        src={LinkedInLogo}
                        toolTip={'Linked In'}
                        onClick={handelLinkedInIconClicked}/>
                </IconBar>
            }

            footer={
                <FooterText/>
            }
            />
    );

}

export { HomePage }
