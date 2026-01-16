import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

// 1. Import the Theme Provider
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

import ChordsScreen from './src/screens/ChordsScreen';
import EarTrainerScreen from './src/screens/EarTrainerScreen';
import HomeScreen from './src/screens/HomeScreen';
import MetronomeScreen from './src/screens/MetronomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import TunerScreen from './src/screens/TunerScreen';

const Stack = createStackNavigator();

// 2. Create a wrapper component to handle the Navigation logic
const MainNavigator = () => {
  const { theme, isDark } = useTheme(); // Now we can use the theme colors!

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          // Use the dynamic theme background
          cardStyle: { backgroundColor: theme.background } 
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Tuner" component={TunerScreen} />
        <Stack.Screen name="Metronome" component={MetronomeScreen} />
        <Stack.Screen name="Chords" component={ChordsScreen} />
        <Stack.Screen name="EarTrainer" component={EarTrainerScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
      {/* Dynamic Status Bar (White text for dark mode, Dark text for light mode) */}
      <StatusBar style={isDark ? "light" : "dark"} />
    </NavigationContainer>
  );
};

// 3. The Main App Component simply wraps everything in the Provider
export default function App() {
  return (
    <ThemeProvider>
      <MainNavigator />
    </ThemeProvider>
  );
}