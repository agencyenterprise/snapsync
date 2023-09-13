import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import {
  Card,
  CardDescription,
  CardTitle,
  CardWrapper,
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  Input,
  HowItWorks,
  ForDevelopers,
} from '../components';
import { defaultSnapOrigin } from '../config';
import { MetaMaskContext, MetamaskActions } from '../hooks';
import {
  clearState,
  connectSnap,
  getAPIKey,
  getPersistedState,
  getSnap,
  persistState,
  saveAPIKey,
  shouldDisplayReconnectButton,
} from '../utils';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  ${({ theme }) => theme.mediaQueries.small} {
    flex-direction: column;
  }
`;

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.background.alternative};
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-left: 64px;
  padding-top: 280px;
  padding-bottom: 280px;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 4rem;
  margin-bottom: 2.4rem;
  font-weight: 900;
`;

const HeroDescription = styled.p`
  margin-top: 0;
  font-weight: 400;
  font-size: 2.6rem;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary.default};
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  flex-direction: column;
  flex-wrap: wrap;
  max-width: 80rem;
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

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);
  const [apiKey, setApiKey] = useState('');

  // Load saved API key if connected
  useEffect(() => {
    if (state.installedSnap) {
      getAPIKey(state.installedSnap.id)
        .then((r) => setApiKey(r.apiKey))
        .catch((e) => {
          console.error(e);
          dispatch({ type: MetamaskActions.SetError, payload: e });
        });
    }
  }, [state.installedSnap]);

  useEffect(() => {
    function handleError(e: any) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }

    if (state.installedSnap && apiKey) {
      // clearState(state.installedSnap.id)
      //   .then(() => console.log('Clean! 🧹'))
      //   .catch(handleError);
      // getPersistedState(state.installedSnap.id)
      //   .then((r) => console.log(r))
      //   .catch(handleError);
      persistState(state.installedSnap.id, {
        timestamp: new Date().toISOString(),
      })
        .then(() => console.log('Success! 🚀'))
        .catch(handleError);
    }
  }, [state.installedSnap, apiKey]);

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
    setApiKey(e.target.value);
    if (state.installedSnap) {
      try {
        await saveAPIKey(state.installedSnap.id, e.target.value);
      } catch (e) {
        console.error(e);
        dispatch({ type: MetamaskActions.SetError, payload: e });
      }
    }
  };

  return (
    <>
      <Wrapper>
        <Container>
          <Heading>Sync Metamask Snaps Across Devices.</Heading>
          <HeroDescription>
            <Span>SnapSync</Span> is a
            <Span>
              {' '}
              <a href="https://metamask.io/snaps/" target="_blank">
                Metamask Snap
              </a>
            </Span>{' '}
            that saves data from snaps across devices securely using IPFS.
          </HeroDescription>
          <ConnectButton
            onClick={handleConnectClick}
            disabled={!state.isFlask}
          />
        </Container>
        <Container>
          <iframe
            width="640"
            height="380"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=xkqlG1wxEpQWLXfE"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </Container>
      </Wrapper>
      <HowItWorks />
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

        <CardWrapper disabled={!state.installedSnap}>
          <CardTitle>Add your Piñata Key</CardTitle>
          <CardDescription>
            The snap needs an API key to connect to your Piñata account and save
            your data.
          </CardDescription>
          <Input
            type="password"
            placeholder="Your Piñata key"
            value={apiKey}
            onChange={handleKeyChanged}
          />
        </CardWrapper>
      </CardContainer>
      <ForDevelopers />
    </>
  );
};

export default Index;
