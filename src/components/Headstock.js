import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GUITAR_STRINGS } from '../services/TunerService';

const { width } = Dimensions.get('window');

export default function Headstock({ selectedString, currentNote, onSelect }) {
  
  // --- REAL GUITAR LAYOUT (Based on your Image) ---
  
  // Left Side (Top to Bottom): D (String 4), A (String 5), Low E (String 6)
  const leftSide = [
    { ...GUITAR_STRINGS[2], num: 4 }, // Top Left (D)
    { ...GUITAR_STRINGS[1], num: 5 }, // Mid Left (A)
    { ...GUITAR_STRINGS[0], num: 6 }, // Bot Left (Low E)
  ];

  // Right Side (Top to Bottom): G (String 3), B (String 2), High e (String 1)
  const rightSide = [
    { ...GUITAR_STRINGS[3], num: 3 }, // Top Right (G)
    { ...GUITAR_STRINGS[4], num: 2 }, // Mid Right (B)
    { ...GUITAR_STRINGS[5], num: 1 }, // Bot Right (High e)
  ];

  const renderPeg = (stringData, side) => {
    const isSelected = selectedString === stringData.notation;
    const isAutoMatch = selectedString === null && currentNote === stringData.note;
    const active = isSelected || isAutoMatch;

    return (
      <View key={stringData.notation} style={styles.pegWrapper}>
        {/* Left Side Labels (Letter) */}
        {side === 'left' && (
          <Text style={[styles.stringLabel, { marginRight: 10, textAlign: 'right' }]}>
            {stringData.note}
          </Text>
        )}

        {/* The Peg Button */}
        <TouchableOpacity
          style={[
            styles.peg, 
            active && styles.pegActive
          ]}
          onPress={() => onSelect(isSelected ? null : stringData.notation)}
        >
          <Text style={[styles.pegText, active && styles.pegTextActive]}>
            {stringData.note}
          </Text>
        </TouchableOpacity>

        {/* Right Side Labels (Letter) */}
        {side === 'right' && (
          <Text style={[styles.stringLabel, { marginLeft: 10, textAlign: 'left' }]}>
            {stringData.note}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Wood Headstock Shape */}
      <View style={styles.headstockShape}>
        <View style={styles.nut} />
        <Text style={styles.brandText}>Tuner</Text>
      </View>

      {/* Left Column Container (D, A, E) */}
      <View style={[styles.column, styles.columnLeft]}>
        {leftSide.map(str => renderPeg(str, 'left'))}
      </View>

      {/* Right Column Container (G, B, e) */}
      <View style={[styles.column, styles.columnRight]}>
        {rightSide.map(str => renderPeg(str, 'right'))}
      </View>

      {/* Auto Button */}
      <TouchableOpacity 
        style={[styles.autoButton, selectedString === null && styles.autoButtonActive]}
        onPress={() => onSelect(null)}
      >
        <Text style={[styles.autoText, selectedString === null && styles.autoTextActive]}>
          AUTO MODE
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 350,
    width: width,
    alignItems: 'center',
    marginTop: 30,
  },
  headstockShape: {
    width: 140,
    height: 300,
    backgroundColor: '#3E2723', // Dark Wood
    borderRadius: 15,
    borderWidth: 4,
    borderColor: '#1a1a1a',
    alignItems: 'center',
    paddingTop: 40,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  nut: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 12,
    backgroundColor: '#D7CCC8', // Bone color
    borderTopWidth: 1,
    borderColor: '#8D6E63'
  },
  brandText: {
    color: '#8D6E63',
    fontWeight: 'bold',
    fontSize: 24,
    fontFamily: 'serif',
    opacity: 0.5,
  },
  
  // Columns
  column: {
    position: 'absolute',
    height: 260, 
    top: 20,
    justifyContent: 'space-between',
  },
  columnLeft: {
    left: width / 2 - 130, 
    alignItems: 'flex-end', 
  },
  columnRight: {
    right: width / 2 - 130, 
    alignItems: 'flex-start', 
  },

  // Peg Styles
  pegWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stringLabel: {
    color: '#888',
    fontSize: 18,
    fontWeight: 'bold',
    width: 30,
  },
  peg: {
    width: 60,
    height: 60,
    backgroundColor: '#263238', 
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#37474F',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
  },
  pegActive: {
    backgroundColor: '#2E7D32', // Dark Green
    borderColor: '#4CAF50', // Bright Green
    shadowColor: '#4CAF50',
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  pegText: {
    color: '#B0BEC5',
    fontSize: 22,
    fontWeight: 'bold',
  },
  pegTextActive: {
    color: 'white',
  },

  // Auto Button
  autoButton: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#212121',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#424242',
    elevation: 5,
  },
  autoButtonActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#1B5E20',
  },
  autoText: { color: '#757575', fontWeight: 'bold', fontSize: 14 },
  autoTextActive: { color: '#fff' },
});