import styled from 'styled-components';

const AppButton = styled.button`
    background: transparent;

    border-radius: 15px;

    cursor: pointer;

    font-size: 1.5em;
    padding: 10px;

    border: 2px solid ${(props: any) => props.color || props.theme.colors.defaultButtonColor };
    color: ${(props: any) => props.color || props.theme.colors.defaultButtonColor };

`;

export default AppButton;