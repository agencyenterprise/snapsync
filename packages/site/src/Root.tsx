import { FunctionComponent, ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';

import { light } from './config/theme';
import { MetaMaskProvider } from './hooks';

export type RootProps = {
  children: ReactNode;
};

export const Root: FunctionComponent<RootProps> = ({ children }) => {
  return (
    <ThemeProvider theme={light}>
      <MetaMaskProvider>{children}</MetaMaskProvider>
    </ThemeProvider>
  );
};
