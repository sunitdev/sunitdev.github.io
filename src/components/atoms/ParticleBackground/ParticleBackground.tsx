import * as React from 'react';

import styled from 'styled-components';

import Particles from 'react-particles-js';


const StyledParticles = styled(Particles)`
    width: 100%;
    height: 100%;

    z-index: -100;

    position: absolute;
    top: 0;
    left: 0;
`;


const ParticleBackground: React.SFC = () => (

    <StyledParticles
        params={
            {
                particles: {
                    number: {
                        value: 200
                    },
                    color: {
                        value: "#c5c5c5"
                    },
                    line_linked: {
                        enable: true,
                        color: "#c5c5c5"
                    },
                    move: {
                        speed: 2
                    }
                },
            }
        }/>
);

export { ParticleBackground }