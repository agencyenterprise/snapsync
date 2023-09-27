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
import { CodeHighlight } from '../components/CodeHighlight';

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
  margin-top: 1.6rem;
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

const GettingStartedSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 0.5px solid ${({ theme }) => theme.colors.border.default};
  margin-top: 6rem;
  margin-bottom: 1rem;
  padding-top: 5.4rem;
  width: 100%;
  max-width: 108rem;

  div.divider {
    width: 100%;
    max-width: 16rem;
    height: 0.5px;
    background-color: ${({ theme }) => theme.colors.border.default};

    &.mt {
      margin-top: 4rem;
    }

    &.mb {
      margin-bottom: 4.8rem;
    }
  }

  h2 {
    font-size: 3rem;
    margin: 0;
  }

  p.subtitle {
    font-size: 1.75rem;
    max-width: 80rem;
    text-align: center;
    color: ${(props) => props.theme.colors.text.muted};
    margin-bottom: 4.8rem;
  }

  h3 {
    font-size: 2.4rem;
    margin-top: 4.2rem;
    margin-bottom: 0;
  }

  p.description {
    font-size: 1.75rem;
    max-width: 80rem;
    text-align: center;
    color: ${(props) => props.theme.colors.text.muted};
  }

  pre {
    max-width: 60rem;
    width: 100%;
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border: 0.5px solid ${({ theme }) => theme.colors.border.default};
  }

  code {
    font-size: 1.6rem;
    line-height: 2.4rem;
  }
`;

export const Head = () => <title>SnapSync</title>;

const CODE_SET_STATE = `// Get latest data from IPFS, or null if not found
await snap.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: IPFS_SNAP_ID,
    request: {method: 'get' },
  },
});

// Persist state in IPFS
await snap.request({
  method: 'wallet_invokeSnap',
  params: { 
    snapId: IPFS_SNAP_ID,
    request: { method: 'set', params: state } 
  } 
});`;

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

        <GettingStartedSection>
          <h2>
            Integrate <Span>SnapSync</Span> into your snaps
          </h2>
          <p className="subtitle">
            Snap developers can easily integrate SnapSync into their
            <br />
            snaps to enable data persistence on IPFS.
          </p>

          <div className="divider" />

          <h3>Add SnapSync to your snap manifest</h3>
          <p className="description">
            Add SnapSync to your snap manifest to allow your snap to work with{' '}
            <Anchor
              href="https://docs.metamask.io/snaps/how-to/work-with-existing-snaps"
              target="_blank"
            >
              third-party snaps
            </Anchor>{' '}
            using RPC calls. Here's an{' '}
            <Anchor
              href="https://github.com/agencyenterprise/pet-fox/blob/main/packages/snap/snap.manifest.json#L38"
              target="_blank"
            >
              example manifest
            </Anchor>{' '}
            from the Pet Fox snap.
          </p>

          <CodeHighlight>
            const IPFS_SNAP_ID = 'npm:@ae-studio/snapsync'
          </CodeHighlight>

          <div className="divider mt"></div>

          <h3>Call methods to persist/retrieve data</h3>
          <p className="description">
            Send messages to SnapSync to persist and retrieve data from IPFS.
            Here's an example of
            <br />
            <Anchor
              href="https://github.com/agencyenterprise/pet-fox/blob/main/packages/snap/src/index.ts#L333"
              target="_blank"
            >
              getting
            </Anchor>{' '}
            and{' '}
            <Anchor
              href="https://github.com/agencyenterprise/pet-fox/blob/main/packages/snap/src/index.ts#L157"
              target="_blank"
            >
              persisting
            </Anchor>{' '}
            the state.
          </p>

          <CodeHighlight>{CODE_SET_STATE}</CodeHighlight>

          <p className="description">
            Your snap is automatically identified in the request messages. If
            the user doesn't have SnapSync installed, they will be prompted to
            install it and setup the integration.
          </p>

          <div className="divider mt mb" />
          <span>
            That's all you need to do! For more information, please check the{' '}
            <Anchor
              href="https://github.com/agencyenterprise/snapsync"
              target="_blank"
            >
              GitHub repository
            </Anchor>
            .
          </span>
        </GettingStartedSection>
      </Container>
    </>
  );
};

export default Index;
