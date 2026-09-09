import { ApolloProvider } from '@apollo/client';
import './App.css';
import RouteList from './route/routelist';
import { APOLLO_CLIENT } from './services/apollo';
import { Provider } from 'react-redux';
import { store } from './store';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import dayjs from 'dayjs';

dayjs.extend(advancedFormat);
function App() {
  return (
    <Provider store={store}>
      <ApolloProvider client={APOLLO_CLIENT}>
        <RouteList />
      </ApolloProvider>
    </Provider>
  );
}

export default App;
