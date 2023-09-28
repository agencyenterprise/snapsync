import styled, { useTheme } from 'styled-components';

import { SnapLogo } from './SnapLogo';

const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 2.4rem;
  border-bottom: 0.5px solid ${(props) => props.theme.colors.border.default};
  background-color: #fff;
`;

const Title = styled.p`
  font-size: ${(props) => props.theme.fontSizes.title};
  font-weight: bold;
  margin: 0;
  margin-left: 1.2rem;
  ${({ theme }) => theme.mediaQueries.small} {
    display: none;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Anchor = styled.a`
  color: ${({ theme }) => theme.colors.primary.default};
  text-decoration: none;
  font-weight: 500;
  margin-left: 0.4rem;
  &:hover {
    text-decoration: underline;
  }
`;

export const Header = () => {
  const theme = useTheme();

  return (
    <HeaderWrapper>
      <LogoWrapper>
        <SnapLogo color={theme.colors.icon.default} size={36} />
        <Title>SnapSync</Title>
      </LogoWrapper>

      <RightContainer>
        Made with 💜 by{' '}
        <Anchor
          href="https://ae.studio/blockchain?utm_source=snapsync&utm_campaign=snapsync-website&utm_medium=poc&utm_term=9569ec30-dd99-4fb7-9104-df4cf13d9983"
          target="_"
        >
          AE Studio
        </Anchor>
      </RightContainer>
    </HeaderWrapper>
  );
};
