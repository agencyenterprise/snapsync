import { useContext } from 'react';
import styled from 'styled-components';

import {
  Card,
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
} from '../components';
import { defaultSnapOrigin } from '../config';
import { MetaMaskContext, MetamaskActions } from '../hooks';
import { connectSnap, getSnap, shouldDisplayReconnectButton } from '../utils';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary.default};
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  gap: 2.4rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error.muted};
  border: 1px solid ${({ theme }) => theme.colors.error.default};
  color: ${({ theme }) => theme.colors.error.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);

  const handleConnectClick = async () => {
    try {
      await connectSnap(defaultSnapOrigin);
      const installedSnap = await getSnap(defaultSnapOrigin);

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  return (
    <Container>
      <Heading>
        Set up your <Span>IPFS</Span> connection
      </Heading>

      <CardContainer>
        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}

        {!state.isFlask && (
          <Card
            content={{
              title: 'Install',
              description:
                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
              button: <InstallFlaskButton />,
            }}
            fullWidth
          />
        )}

        {!state.installedSnap && (
          <Card
            content={{
              title: 'Connect',
              description: 'Get started by connecting MetaMask to the snap.',
              button: (
                <ConnectButton
                  onClick={handleConnectClick}
                  disabled={!state.isFlask}
                />
              ),
            }}
            disabled={!state.isFlask}
          />
        )}

        {shouldDisplayReconnectButton(state.installedSnap) && (
          <Card
            content={{
              title: 'Reconnect',
              description:
                'Reconnect to the snap to update to the latest version.',
              button: (
                <ReconnectButton
                  onClick={handleConnectClick}
                  disabled={!state.installedSnap}
                />
              ),
            }}
            disabled={!state.installedSnap}
          />
        )}

        {/* <CardGroup>
          {!state.otherSnapInstalled && (
            <Card
              content={{
                title: 'Connect State Snap',
                description: 'Get started by connecting state snap.',
                button: (
                  <ConnectButton
                    onClick={handleConnectOtherClick}
                    disabled={!state.isFlask}
                  />
                ),
              }}
              disabled={!state.isFlask}
            />
          )}
          {shouldDisplayReconnectButton(state.otherSnapInstalled) && (
            <Card
              content={{
                title: 'Reconnect State Snap',
                description:
                  'While connected to a local running snap this button will always be displayed in order to update the snap if a change is made.',
                button: (
                  <ReconnectButton
                    onClick={handleConnectOtherClick}
                    disabled={!state.otherSnapInstalled}
                  />
                ),
              }}
              disabled={!state.otherSnapInstalled}
            />
          )}
          <Card
            content={{
              title: 'Send handleSaveState Message',
              description:
                'Display a custom message within a confirmation screen in MetaMask.',
              button: (
                <SendMessageButton
                  onClick={handleSaveState}
                  disabled={!state.installedSnap}
                />
              ),
            }}
            disabled={!state.installedSnap}
            fullWidth={
              state.isFlask &&
              Boolean(state.installedSnap) &&
              !shouldDisplayReconnectButton(state.installedSnap)
            }
          />
          <Card
            content={{
              title: 'Send handleGetState Message',
              description:
                'Display a custom message within a confirmation screen in MetaMask.',
              button: (
                <SendMessageButton
                  onClick={handleGetState}
                  disabled={!state.installedSnap}
                />
              ),
            }}
            disabled={!state.installedSnap}
            fullWidth={
              state.isFlask &&
              Boolean(state.installedSnap) &&
              !shouldDisplayReconnectButton(state.installedSnap)
            }
          />
          <Card
            content={{
              title: 'Send handleClearState Message',
              description:
                'Display a custom message within a confirmation screen in MetaMask.',
              button: (
                <SendMessageButton
                  onClick={handleClearState}
                  disabled={!state.installedSnap}
                />
              ),
            }}
            disabled={!state.installedSnap}
            fullWidth={
              state.isFlask &&
              Boolean(state.installedSnap) &&
              !shouldDisplayReconnectButton(state.installedSnap)
            }
          />
        </CardGroup> */}
      </CardContainer>
    </Container>
  );
};

export default Index;
