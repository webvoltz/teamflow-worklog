import { ApolloProvider } from '@apollo/client/react';
import './App.css';
import RouteList from './route/routelist';
import { APOLLO_CLIENT } from './services/apollo';
import { Provider } from 'react-redux';
import { store } from './store';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import dayjs from 'dayjs';
import { Toaster } from './component/ui/toast';

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
