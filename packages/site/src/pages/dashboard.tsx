import { useContext, useState } from 'react';
import styled from 'styled-components';
import { Button, NavigationButton } from '../components';
import { MetaMaskContext, MetamaskActions } from '../hooks';
import { IPFS } from '../types';
import { getIPFSList } from '../utils';

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

const IPFSListContainer = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const IPFSListItem = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.primary.default};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  gap: 2.4rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
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

const Card = styled.div<{ disabled: boolean }>`
  display: flex;
  opacity: ${({ disabled }) => (disabled ? '.4' : '1')};
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const IPFSItem = ({ ipfs }: { ipfs: IPFS }) => {
  console.log(ipfs);
  return (
    <IPFSListItem>
      <div>
        <strong>{ipfs.metadata.name}</strong>
      </div>
      <div>{ipfs.ipfs_pin_hash}</div>
      <div>
        <NavigationButton
          target="_blank"
          href={`https://gateway.pinata.cloud/ipfs/${ipfs.ipfs_pin_hash}`}
        >
          See
        </NavigationButton>
      </div>
    </IPFSListItem>
  );
};

const Dashboard = () => {
  const [state, dispatch] = useContext(MetaMaskContext);
  const [IPFSList, setIPFSList] = useState<IPFS[]>([]);

  const handleSyncClick = async () => {
    try {
      const ipfsList = await getIPFSList();
      if (!ipfsList) {
        throw new Error('No IPFS List');
      }
      setIPFSList(ipfsList);
    } catch (error) {
      console.log(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  };

  return (
    <Container>
      <CardContainer>
        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}
        <ButtonsWrapper>
          <NavigationButton href="/">Back</NavigationButton>
          <Button disabled={!state.installedSnap} onClick={handleSyncClick}>
            Sync Information
          </Button>
        </ButtonsWrapper>
        <Card disabled={!state.installedSnap}>
          <IPFSListContainer>
            {IPFSList.map((ipfs) => (
              <IPFSItem key={ipfs.id} ipfs={ipfs} />
            ))}
          </IPFSListContainer>
        </Card>
      </CardContainer>
    </Container>
  );
};

export default Dashboard;
