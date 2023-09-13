import styled, { useTheme } from 'styled-components';
import { getThemePreference } from '../utils';
import { SnapLogo } from './SnapLogo';
import { Toggle } from './Toggle';
import { ConnectButton } from './Buttons';

const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 2.4rem;
  background-color: ${(props) => props.theme.colors.background.alternative};
`;

const Title = styled.p`
  font-size: ${(props) => props.theme.fontSizes.title};
  font-weight: bold;
  margin: 0;
  margin-left: 40px;
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

const NavItem = styled.a`
  margin-left: 1rem;
  margin-right: 1rem;
  font-size: ${(props) => props.theme.fontSizes.body};
  font-weight: bold;
  text-decoration: none;
  color: ${(props) => props.theme.colors.text.default};
  &:hover {
    color: ${(props) => props.theme.colors.primary.default};
  }
`;

export const Header = ({
  handleToggleClick,
}: {
  handleToggleClick(): void;
}) => {
  const theme = useTheme();

  return (
    <HeaderWrapper>
      <LogoWrapper>
        {/* <SnapLogo color={theme.colors.icon.default} size={36} /> */}
        <Title>SnapSync</Title>
      </LogoWrapper>
      <RightContainer>
        <NavItem href="#">How it Works</NavItem>{' '}
        <NavItem href="#">For Developers</NavItem>
        <NavItem href="#">Examples</NavItem>
        <NavItem href="#">
          <ConnectButton />
        </NavItem>
      </RightContainer>
    </HeaderWrapper>
  );
};
