/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

import { Provider } from 'react-redux';
import store from './src/store';
import { PaperProvider } from 'react-native-paper';

export default function Main() {
    return (
        <Provider store={store}>
            <PaperProvider>
                <App />
            </PaperProvider>
        </Provider>

    );
}

AppRegistry.registerComponent(appName, () => Main);
