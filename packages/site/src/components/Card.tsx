import { ReactNode } from 'react';
import styled from 'styled-components';

type CardProps = {
  content: {
    title?: string;
    description: ReactNode;
    button?: ReactNode;
  };
  disabled?: boolean;
  fullWidth?: boolean;
};

export const CardWrapper = styled.div<{
  fullWidth?: boolean;
  disabled: boolean;
}>`
  display: flex;
  flex-direction: column;
  grid-column: ${({ fullWidth }) => (fullWidth ? 'span 2 / span 2' : 'auto')};
  background-color: ${({ theme }) => theme.colors.card.default};
  padding: 2rem;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.default};
  box-shadow: ${({ theme }) => theme.shadows.default};
  filter: opacity(${({ disabled }) => (disabled ? '.4' : '1')});
  align-self: stretch;
  ${({ theme }) => theme.mediaQueries.small} {
    width: 100%;
    margin-top: 1.2rem;
    margin-bottom: 1.2rem;
    padding: 1.6rem;
  }
`;

export const CardTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.large};
  margin: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

export const CardDescription = styled.div`
  margin-top: 1.2rem;
  margin-bottom: 1.2rem;
`;

export const Card = ({ content, disabled = false, fullWidth }: CardProps) => {
  const { title, description, button } = content;
  return (
    <CardWrapper fullWidth={fullWidth} disabled={disabled}>
      {title && <CardTitle>{title}</CardTitle>}
      <CardDescription>{description}</CardDescription>
      {button}
    </CardWrapper>
  );
};
