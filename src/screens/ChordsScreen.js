import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext'; // <--- Import

const CHORDS_DATA = [
  { name: "C Major", tab: "x32010" },
  { name: "D Major", tab: "xx0232" },
  { name: "E Major", tab: "022100" },
  { name: "G Major", tab: "320003" },
  { name: "A Major", tab: "x02220" },
  { name: "Am", tab: "x02210" },
  { name: "Em", tab: "022000" },
  { name: "F Major", tab: "133211" },
  { name: "Dm", tab: "xx0231" },
  { name: "B7", tab: "x21202" },
];

const ChordDiagram = ({ tab, theme }) => {
  const strings = tab.split(''); 
  return (
    <View style={styles.diagramContainer}>
      {/* Nut Color: Dark grey usually works on both, or use theme.border */}
      <View style={[styles.nut, { backgroundColor: '#999' }]} />

      <View style={styles.grid}>
        {[0, 1, 2, 3, 4, 5].map(i => <View key={`s${i}`} style={[styles.stringLine, { top: i * 14 + 7, backgroundColor: theme.subText }]} />)}
        {[1, 2, 3, 4, 5].map(i => <View key={`f${i}`} style={[styles.fretLine, { right: i * 18, backgroundColor: theme.subText }]} />)}
      </View>

      {strings.map((char, index) => {
        const rowIndex = index; 
        const fret = parseInt(char);
        const isMuted = char.toLowerCase() === 'x';
        const isOpen = !isNaN(fret) && fret === 0;
        const isFretted = !isNaN(fret) && fret > 0;
        
        return (
          <View key={index} style={[styles.rowLayer, { top: rowIndex * 14 }]}>
            <Text style={[styles.stringLabel, { color: theme.subText }]}>{["E","A","D","G","B","e"][index]}</Text>
            <View style={styles.markerBox}>
              {isMuted && <Text style={styles.muteMark}>✕</Text>}
              {isOpen && <Text style={styles.openMark}>○</Text>}
            </View>
            {isFretted && <View style={[styles.dot, { right: 28 + (fret * 18) - 9 }]} />}
          </View>
        );
      })}
    </View>
  );
};

export default function ChordsScreen({ navigation }) {
  const { theme } = useTheme(); // <--- Use Theme

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.icon} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Chord Library</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView contentContainerStyle={{paddingBottom: 40}}>
        {CHORDS_DATA.map((chord, index) => (
          <View key={index} style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.textContainer}>
              <Text style={[styles.chordName, { color: theme.text }]}>{chord.name}</Text>
              <Text style={[styles.tabText, { color: theme.subText }]}>Tab: {chord.tab}</Text>
            </View>
            <View style={[styles.diagramWrapper, { backgroundColor: theme.background }]}>
              {/* Pass theme to diagram so lines can change color if needed */}
              <ChordDiagram tab={chord.tab} theme={theme} />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { marginTop: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 18, fontWeight: 'bold' },
  
  card: { 
    borderRadius: 15, padding: 15, marginBottom: 15, 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderLeftWidth: 5, borderLeftColor: '#4CAF50', elevation: 3
  },
  textContainer: { justifyContent: 'center' },
  chordName: { fontSize: 22, fontWeight: 'bold' },
  tabText: { marginTop: 5, fontFamily: 'monospace' },

  diagramWrapper: { width: 140, height: 100, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  diagramContainer: { width: 130, height: 84, position: 'relative' },

  nut: { position: 'absolute', right: 24, top: 5, width: 5, height: 74, zIndex: 2 },
  grid: { position: 'absolute', right: 28, top: 0, width: 100, height: 84 },
  stringLine: { position: 'absolute', right: 0, width: 100, height: 1 },
  fretLine: { position: 'absolute', top: 7, width: 1, height: 70 },
  rowLayer: { position: 'absolute', right: 0, width: 130, height: 14 },
  stringLabel: { position: 'absolute', right: 0, width: 12, textAlign: 'center', fontSize: 9, fontWeight: 'bold', top: 1 },
  markerBox: { position: 'absolute', right: 12, width: 12, alignItems: 'center', top: -1 },
  muteMark: { color: '#D32F2F', fontSize: 10, fontWeight: 'bold' },
  openMark: { color: '#4CAF50', fontSize: 9, fontWeight: 'bold' },
  dot: { position: 'absolute', width: 12, height: 12, borderRadius: 6, backgroundColor: '#4CAF50', top: 1, zIndex: 10 }
});