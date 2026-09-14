import './App.css';

import { ApolloProvider } from '@apollo/client/react';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { Provider } from 'react-redux';

import { Toaster } from './component/ui/toast';
import RouteList from './route/routelist';
import { APOLLO_CLIENT } from './services/apollo';
import { store } from './store';

dayjs.extend(advancedFormat);
function App() {
  return (
    <Provider store={store}>
      <ApolloProvider client={APOLLO_CLIENT}>
        <Toaster />
        <RouteList />
      </ApolloProvider>
    </Provider>
  );
}

export default App;
