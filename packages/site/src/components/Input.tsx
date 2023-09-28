import styled from 'styled-components';

export const Input = styled.input`
  display: flex;
  align-items: center;
  font-family: ${(props) => props.theme.fonts.default};
  font-size: ${(props) => props.theme.fontSizes.small};
  border-radius: ${(props) => props.theme.radii.button};
  border: 0.5px solid ${(props) => props.theme.colors.border.default};
  min-height: 4rem;
  padding: 0 1rem;
  ${({ theme }) => theme.mediaQueries.small} {
    width: 100%;
  }

  &:focus {
    outline-color: ${(props) => props.theme.colors.primary.default};
  }
`;
