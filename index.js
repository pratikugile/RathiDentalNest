import { LogBox } from 'react-native';
// LogBox.ignoreLogs([
// 	'setLayoutAnimationEnabledExperimental is currently a no-op',
// ]);
/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
