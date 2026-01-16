import { Ionicons } from '@expo/vector-icons';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// 1. Import the Theme Hook
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  // 2. Get the current theme colors
  const { theme } = useTheme();

  return (
    // 3. Replace background colors with 'theme.background'
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          {/* Replace text color with 'theme.text' */}
          <Text style={[styles.brandName, { color: theme.text }]}>Guitar Master</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn}>
           <Ionicons name="person-circle-outline" size={40} color={theme.subText} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Tuner Card (Keep this dark or make dynamic? Let's make it match the theme card) */}
        <TouchableOpacity 
          style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => navigation.navigate('Tuner')}
          activeOpacity={0.9}
        >
          <View style={styles.heroContent}>
            <View style={[styles.heroIconCircle, { backgroundColor: theme.border }]}>
               <Ionicons name="musical-notes" size={40} color={theme.text} />
            </View>
            <View>
              <Text style={[styles.heroTitle, { color: theme.text }]}>Guitar Tuner</Text>
              <Text style={[styles.heroSubtitle, { color: theme.subText }]}>Standard & Drop Tunings</Text>
            </View>
          </View>
          <View style={styles.playIcon}>
             <Ionicons name="play-circle" size={50} color="#4CAF50" />
          </View>
        </TouchableOpacity>

        {/* Tools Section */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Tools</Text>
        <View style={styles.grid}>
          
          <TouchableOpacity 
            style={[styles.gridCard, { backgroundColor: theme.card, borderColor: theme.border }]} 
            onPress={() => navigation.navigate('Metronome')}
          >
            <Ionicons name="pulse" size={32} color="#FF9800" />
            <Text style={[styles.cardTitle, { color: theme.text }]}>Metronome</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.gridCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => navigation.navigate('Chords')}
          >
            <Ionicons name="grid" size={32} color="#2196F3" />
            <Text style={[styles.cardTitle, { color: theme.text }]}>Chords Lib</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.gridCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => navigation.navigate('EarTrainer')}
          >
            <Ionicons name="ear" size={32} color="#9C27B0" />
            <Text style={[styles.cardTitle, { color: theme.text }]}>Ear Trainer</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.gridCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-sharp" size={32} color="#aaa" />
            <Text style={[styles.cardTitle, { color: theme.text }]}>Settings</Text>
          </TouchableOpacity>

        </View>

        {/* Tip Card */}
        <View style={[styles.tipCard, { backgroundColor: theme.card }]}>
          <Text style={styles.tipHeader}>💡 PRO TIP</Text>
          <Text style={[styles.tipText, { color: theme.subText }]}>
            Always tune *up* to the note. If you are sharp, drop below the note and tighten it back up to pitch.
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 30 },
  greeting: { color: '#888', fontSize: 14 },
  brandName: { fontSize: 24, fontWeight: 'bold' },
  
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  // Hero Card
  heroCard: {
    borderRadius: 20,
    padding: 20,
    height: 140,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderWidth: 1,
    elevation: 5,
  },
  heroContent: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  heroIconCircle: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  heroTitle: { fontSize: 20, fontWeight: 'bold' },
  heroSubtitle: { fontSize: 12 },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },

  // Grid
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, justifyContent: 'space-between' },
  gridCard: {
    width: (width - 55) / 2, // 2 columns
    height: 100,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  cardTitle: { marginTop: 10, fontWeight: 'bold' },

  // Tip Card
  tipCard: { marginTop: 30, padding: 20, borderRadius: 15, borderLeftWidth: 4, borderLeftColor: '#4CAF50' },
  tipHeader: { color: '#4CAF50', fontWeight: 'bold', marginBottom: 5 },
  tipText: { lineHeight: 22 },
});