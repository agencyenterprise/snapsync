import styled from 'styled-components';

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.background.alternative};
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-left: 64px;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

export const ForDevelopers = () => {
  return (
    <Container>
      <h1>For Developers</h1>
      <p>Unlock a persisted user experience in your snaps!</p>
    </Container>
  );
};
