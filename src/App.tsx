import React, { useEffect, useState } from 'react';
import { CommonActions, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import LibraryScreen from './screens/LibraryScreen';
import EncryptionScreen from './screens/EncryptionScreen';
import { BottomNavigation, PaperProvider } from 'react-native-paper';
import CustomIcon from './components/CustomIcon';
import { icons } from './constants/icons';
import auth from '@react-native-firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './redux/userSlice';
import { RootState } from './redux/store';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          navigationState={state}
         safeAreaInsets={insets}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
             navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({ focused, color, size: 24 });
            }

            return null;
          }}
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.title;

            return label;
          }}
        />
      )}
    >
      <Tab.Screen
        name="My Files"
        component={LibraryScreen}
        options={{
          tabBarLabel: 'My Files',
          tabBarIcon: ({ color, size }) => {
            return <CustomIcon source={icons.home} size={size}/>;
          },
        }}
      />
      <Tab.Screen
        name="Encrypt"
        component={EncryptionScreen}
        options={{
          tabBarLabel: 'Encrypt',
          tabBarIcon: ({ color, size }) => {
            return <CustomIcon source={icons.edit} size={size}/>;
          },
        }}
      />
        <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => {
            return <CustomIcon source={icons.profile} size={size}/>;
          },
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
    const [initializing, setInitializing] = useState(true);
    const user = useSelector((state: RootState) => state.userSlice.user)
    const dispatch = useDispatch();
  
    function onAuthStateChanged(user: any) {
      user && dispatch(setUser({ uid: user.uid, email: user.email }));

      if (initializing) setInitializing(false);
    }
  
    useEffect(() => {
      const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
      return subscriber;
    }, []);
  
    if (initializing) return null;

  function getInitialPage() {
    if (user) return 'MainApp'
    else return 'Welcome'
  }

  return (
    <NavigationContainer>
      <PaperProvider>
        <Stack.Navigator initialRouteName={getInitialPage()}>
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MainApp"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
};

export default App;