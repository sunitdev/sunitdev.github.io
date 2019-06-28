import * as React from 'react';

import styled from 'styled-components';

import { HomePageTemplate } from '../../templates/HomePageTemplate';

import { FooterText } from '../../atoms/FooterText';
import { EyeBar } from '../../organisms/EyeBar';
import { IconBar } from '../../organisms/IconBar';
import { IconButton } from '../../atoms/IconButton';

const GithubLogo  = require('../../../assets/images/github_logo.png');

const NameText = styled.h1`
    text-align: center;
`;


const HomePage = () => (
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
                    onClick={(event) => {console.log('Clicked')}}/>
            </IconBar>
        }

        footer={
            <FooterText/>
        }
        />
);

export { HomePage }
