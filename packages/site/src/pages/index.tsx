import { useContext, useState } from 'react';
import styled from 'styled-components';
import {
  Card,
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  SendMessageButton,
} from '../components';
import { defaultOtherSnapOrigin, defaultSnapOrigin } from '../config';
import { MetaMaskContext, MetamaskActions } from '../hooks';
import {
  connectSnap,
  dencrypt,
  downloadFromIPFS,
  encrypt,
  encryptWithOtherSnap,
  getGlobalState,
  getSnap,
  sendClearState,
  sendGetState,
  sendSaveState,
  shouldDisplayReconnectButton,
  updateIPFS,
  uploadToIPFS,
} from '../utils';

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

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
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

const CardGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 1.2rem;
  border-radius: ${({ theme }) => theme.radii.default};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
`;

const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
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
  const [toIPFS, setToIPFS] = useState('');
  const [fromIPFS, setFromIPFS] = useState('');
  const [toEncrypt, setToEncrypt] = useState('');
  const [toDecrypt, setToDecrypt] = useState('');

  const handleEncryptWithSnapClick = async () => {
    console.log('encrypting with snap');
    try {
      await encryptWithOtherSnap({ test: 'encrypting with snap' });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

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

  const handleConnectOtherClick = async () => {
    try {
      await connectSnap(defaultOtherSnapOrigin);
      const installedSnap = await getSnap(defaultOtherSnapOrigin);

      dispatch({
        type: MetamaskActions.SetOtherSnapInstalled,
        payload: installedSnap,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleSaveState = async () => {
    try {
      await sendSaveState({ foo: 'bar' });
      console.log('data stored');
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleGetState = async () => {
    try {
      const data = await sendGetState();
      console.log('current state:', data);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleClearState = async () => {
    try {
      await sendClearState();
      console.log('state cleared');
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleGetSyncSnapState = async () => {
    try {
      await getGlobalState();
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  };

  const handleEncryptClick = async () => {
    try {
      await encrypt({ toEncrypt });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleDencryptClick = async () => {
    try {
      await dencrypt(toDecrypt);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleUploadString = async () => {
    try {
      await uploadToIPFS(toIPFS);
      console.log('data uploaded');
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleDownloadString = async () => {
    try {
      await downloadFromIPFS(fromIPFS);
      console.log('data downloaded');
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleUpdateString = async () => {
    try {
      await updateIPFS(fromIPFS, toIPFS);
      console.log('data downloaded');
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  return (
    <Container>
      <Heading>
        Welcome to <Span>template-snap</Span>
      </Heading>
      <Subtitle>
        Get started by editing <code>src/index.ts</code>
      </Subtitle>
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

        <CardGroup>
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
              title: 'Encrypt usind Snap',
              description:
                'Try to invoke other snap to encrypt a string using the encrypt method.',
              button: (
                <SendMessageButton
                  onClick={handleEncryptWithSnapClick}
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
        </CardGroup>
        <CardGroup>
          {!state.installedSnap && (
            <Card
              content={{
                title: 'Connect Sync Snap',
                description: 'Get started by connecting sync snap',
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

          {/* <Card
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
        /> */}
          <Card
            content={{
              title: 'Encrypt Data',
              description: (
                <div>
                  <p>Encrypt data using the snap.</p>
                  <input
                    type="text"
                    placeholder="String to encrypt"
                    defaultValue={toEncrypt}
                    onChange={(e) => {
                      setToEncrypt(e.target.value);
                    }}
                  />
                </div>
              ),
              button: (
                <SendMessageButton
                  onClick={handleEncryptClick}
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
              title: 'Decrypt Data',
              description: (
                <div>
                  <p>Decrypt string</p>
                  <input
                    type="text"
                    placeholder="String to decrypt"
                    defaultValue={toDecrypt}
                    onChange={(e) => {
                      setToDecrypt(e.target.value);
                    }}
                  />
                </div>
              ),
              button: (
                <SendMessageButton
                  onClick={handleDencryptClick}
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
          {shouldDisplayReconnectButton(state.installedSnap) && (
            <Card
              content={{
                title: 'Reconnect Sync Snap',
                description:
                  'While connected to a local running snap this button will always be displayed in order to update the snap if a change is made.',
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

          <Card
            content={{
              title: 'Get State',
              description: 'Try to get state from other snaps.',
              button: (
                <SendMessageButton
                  onClick={handleGetSyncSnapState}
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
              title: 'Encrypt Data',
              description: (
                <div>
                  <p>Encrypt data using the snap.</p>
                  <input
                    type="text"
                    placeholder="String to encrypt"
                    defaultValue={toEncrypt}
                    onChange={(e) => {
                      setToEncrypt(e.target.value);
                    }}
                  />
                </div>
              ),
              button: (
                <SendMessageButton
                  onClick={handleEncryptClick}
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
              title: 'Decrypt Data',
              description: (
                <div>
                  <p>Decrypt string</p>
                  <input
                    type="text"
                    placeholder="String to decrypt"
                    defaultValue={toDecrypt}
                    onChange={(e) => {
                      setToDecrypt(e.target.value);
                    }}
                  />
                </div>
              ),
              button: (
                <SendMessageButton
                  onClick={handleDencryptClick}
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
              title: 'Upload to IPFS',
              description: (
                <div>
                  <p>Upload string to IPFS and returns the CID</p>
                  <input
                    type="text"
                    placeholder="String to upload to IPFS"
                    defaultValue={toIPFS}
                    onChange={(e) => {
                      setToIPFS(e.target.value);
                    }}
                  />
                </div>
              ),
              button: (
                <SendMessageButton
                  onClick={handleUploadString}
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
              title: 'Download from IPFS',
              description: (
                <div>
                  <p>Get encrypted string from IPFS using the CID</p>
                  <input
                    type="text"
                    placeholder="CID"
                    defaultValue={fromIPFS}
                    onChange={(e) => {
                      setFromIPFS(e.target.value);
                    }}
                  />
                </div>
              ),
              button: (
                <SendMessageButton
                  onClick={handleDownloadString}
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
              title: 'Update data on IPFS',
              description: (
                <div>
                  <p>Get encrypted string from IPFS using the CID</p>
                  <input
                    type="text"
                    placeholder="New content"
                    defaultValue={toIPFS}
                    onChange={(e) => {
                      setToIPFS(e.target.value);
                    }}
                  />
                  <input
                    type="text"
                    placeholder="CID"
                    defaultValue={fromIPFS}
                    onChange={(e) => {
                      setFromIPFS(e.target.value);
                    }}
                  />
                </div>
              ),
              button: (
                <SendMessageButton
                  onClick={handleUpdateString}
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
        </CardGroup>

        <Notice>
          <p>
            Please note that the <b>snap.manifest.json</b> and{' '}
            <b>package.json</b> must be located in the server root directory and
            the bundle must be hosted at the location specified by the location
            field.
          </p>
        </Notice>
      </CardContainer>
    </Container>
  );
};

export default Index;
