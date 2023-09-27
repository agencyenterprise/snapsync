import { useContext, useEffect } from 'react';
import styled from 'styled-components';

import {
  Card,
  CardDescription,
  CardTitle,
  CardWrapper,
  ConnectButton,
  ReconnectButton,
  Input,
} from '../components';
import { defaultSnapOrigin } from '../config';
import { MetaMaskContext, MetamaskActions } from '../hooks';
import {
  connectSnap,
  getAPIKeys,
  getSnap,
  persistExampleState,
  saveAPIKey,
  shouldDisplayReconnectButton,
} from '../utils';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 3.6rem;
  margin-bottom: 3.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
  p {
    font-size: 1.6rem;
    line-height: 2.4rem;
    max-width: 80rem;
    text-align: left;
  }
  code {
    font-size: 1.6rem;
    line-height: 4.4rem;
    max-width: 80rem;
  }
`;

const Heading = styled.h1`
  text-align: center;
  font-size: 3.6rem;
  margin-bottom: 2.4rem;
`;

const SubTitle = styled.span`
  text-align: center;
  font-size: 1.75rem;
  max-width: 80rem;
  margin-bottom: 2.4rem;
  color: ${(props) => props.theme.colors.text.muted};
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary.default};
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  flex-direction: column;
  flex-wrap: wrap;
  max-width: 100rem;
  gap: 2.4rem;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error.muted};
  border: 1px solid ${({ theme }) => theme.colors.error.default};
  color: ${({ theme }) => theme.colors.error.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  grid-column: span 2 / span 2;
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const Anchor = styled.a`
  color: ${({ theme }) => theme.colors.primary.default};
  text-decoration: none;
  font-weight: 500;
  &:hover {
    text-decoration: underline;
  }
`;

export const Head = () => <title>SnapSync</title>;

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);

  // Load saved API key if connected
  useEffect(() => {
    if (state.installedSnap) {
      getAPIKeys(state.installedSnap.id)
        .then((apiKeys) => {
          if (apiKeys?.pinata) {
            const input = document.getElementById(
              'pinata-key',
            ) as HTMLInputElement;
            input?.setAttribute('value', apiKeys.pinata);
            persistExampleState();
          }
        })
        .catch((e) => {
          console.error(e);
          dispatch({ type: MetamaskActions.SetError, payload: e });
        });
    }
  }, [state.installedSnap]);

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

  // Update UI when API key changes and save it in the snap
  const handleKeyChanged = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (state.installedSnap) {
      try {
        const key = e.target.value;
        await saveAPIKey(state.installedSnap.id, key);

        if (key.length) {
          await persistExampleState();
        }
      } catch (e) {
        console.error(e);
        dispatch({ type: MetamaskActions.SetError, payload: e });
      }
    }
  };

  return (
    <>
      <Container>
        <Heading>
          Sync your <Span>MetaMask</Span> snaps!
        </Heading>
        <SubTitle>
          SnapSync is a{' '}
          <Anchor href="https://metamask.io/snaps" target="_blank">
            MetaMask Snap
          </Anchor>{' '}
          that saves data from snaps across devices securely using IPFS. Get
          started by installing the snap and setting your Piñata JWT.
        </SubTitle>

        <CardContainer>
          {state.error && (
            <ErrorMessage>
              <b>An error happened:</b> {state.error.message}
            </ErrorMessage>
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

          <CardWrapper disabled={!state.installedSnap}>
            <CardTitle>Add your Piñata JWT</CardTitle>
            <CardDescription>
              Enter a Piñata JWT to connect to your Piñata account and save your
              data.
            </CardDescription>
            <Input
              id="pinata-key"
              type="password"
              placeholder="Piñata JWT"
              onChange={handleKeyChanged}
            />
          </CardWrapper>
        </CardContainer>
      </Container>
      {/* <Container>
        <SubHeading>Integrate SnapSync into your Snaps</SubHeading>
        <p>
          Snap developers can integrate SnapSync into their snaps to enable data
          persistence on IPFS.
        </p>
        <p>Getting started is easy:</p>
        <p>Include the SnapSync Snap in your Snap: </p>
        <p>
          <code>const IPFS_SNAP_ID = 'npm:@ae-studio/snapsync';</code>
        </p>
        <p>Call SnapSync methods to get and set data on IPFS: </p>
        <p>
          <code>
            {`await snap.request({
            method: 'wallet_invokeSnap',
            params: {
              snapId: IPFS_SNAP_ID,
            request: {method: 'get' },
      },
    });`}
          </code>
        </p>
        <p>
          <code>
            {`await snap.request({
                method: 'wallet_invokeSnap',
              params: {
                snapId: IPFS_SNAP_ID,
              request: {
                method: 'set',
              params: state,
          },
        },
      });`}
          </code>
        </p>
        <p>
          If SnapSync is not installed, the user will be prompted to install and
          configure it via a Snap modal.
        </p>
      </Container> */}
    </>
  );
};

export default Index;
