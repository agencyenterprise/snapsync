import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-left: 64px;
  margin-bottom: 7.6rem;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

export const HowItWorks = () => {
  return (
    <Container>
      <h1>How It Works</h1>
      <h2>Step 1</h2>
      <p>Install SnapSync in Metamask Flask </p>
      <h2>Step 2</h2>
      <p>Connect SnapSync to your IPFS provider </p>

      <h2>Step 3</h2>
      <p>
        Use with supported Snaps to maintain states across devices and wallets!
      </p>
    </Container>
  );
};
