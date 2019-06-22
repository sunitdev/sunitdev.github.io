import styled from 'styled-components';

const AppButton = styled.button`
    background: transparent;

    border-radius: 15px;

    cursor: pointer;

    font-size: 1.5em;
    padding: 10px;

    border: 2px solid ${(props: any) => props.color || props.theme.colors.defaultButtonColor };
    color: ${(props: any) => props.color || props.theme.colors.defaultButtonColor };

    @media (min-width: 961px){
        font-size: 3em;
    }
    @media (min-width:1025px) {
        font-size: 1.5em;
    }
`;

export default AppButton;