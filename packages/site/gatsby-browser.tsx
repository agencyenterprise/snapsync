import { GatsbyBrowser } from 'gatsby';
import { StrictMode } from 'react';
import { App } from './src/App';
import { Root } from './src/Root';
import '@fontsource/space-grotesk';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/300.css';

export const wrapRootElement: GatsbyBrowser['wrapRootElement'] = ({
  element,
}) => (
  <StrictMode>
    <Root>{element}</Root>
  </StrictMode>
);

export const wrapPageElement: GatsbyBrowser['wrapPageElement'] = ({
  element,
}) => <App>{element}</App>;
