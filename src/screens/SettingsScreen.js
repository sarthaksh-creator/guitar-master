import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
// Import the hook
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen({ navigation }) {
  // Get the global settings
  const { isDark, toggleTheme, theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.icon} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
        <View style={{width: 24}} />
      </View>

      <View style={[styles.section, { backgroundColor: theme.card }]}>
        
        {/* THE REAL TOGGLE */}
        <View style={[styles.row, { borderBottomColor: theme.border }]}>
          <Text style={[styles.label, { color: theme.text }]}>Dark Theme</Text>
          <Switch 
            value={isDark} 
            onValueChange={toggleTheme} // Calls the global toggle
            trackColor={{false: "#767577", true: "#4CAF50"}} 
          />
        </View>

        <View style={[styles.row, { borderBottomColor: theme.border }]}>
          <Text style={[styles.label, { color: theme.text }]}>High Sensitivity Mic</Text>
          <Switch value={true} trackColor={{false: "#767577", true: "#2196F3"}} />
        </View>

        <View style={[styles.row, { borderBottomColor: 'transparent' }]}>
          <Text style={[styles.label, { color: theme.text }]}>Version</Text>
          <Text style={{ color: theme.subText }}>2.4.0</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { marginTop: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 18, fontWeight: 'bold' },
  section: { borderRadius: 10, padding: 15, elevation: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1 },
  label: { fontSize: 16 },
});