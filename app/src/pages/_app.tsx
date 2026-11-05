import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '@/store';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import '../../Portal DS/tokens.css';
import '../../Portal DS/components/bundle.css';
import '@/styles/globals.css';

// Prevent FontAwesome from automatically injecting CSS since it's already imported
config.autoAddCss = false;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
