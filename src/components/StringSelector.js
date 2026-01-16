import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GUITAR_STRINGS } from '../services/TunerService';

export default function StringSelector({ selectedString, onSelect }) {
  return (
    <View style={styles.container}>
      {/* Auto Button */}
      <TouchableOpacity
        style={[styles.button, selectedString === null && styles.activeButton]}
        onPress={() => onSelect(null)}
      >
        <Text style={[styles.text, selectedString === null && styles.activeText]}>Auto</Text>
      </TouchableOpacity>

      {/* String Buttons */}
      {GUITAR_STRINGS.map((str, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.circleButton, 
            selectedString === str.notation && styles.activeButton
          ]}
          onPress={() => onSelect(str.notation)}
        >
          <Text style={[styles.text, selectedString === str.notation && styles.activeText]}>
            {str.note}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#555',
  },
  circleButton: {
    width: 45,
    height: 45,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: '#4CAF50', // Green for active
    borderColor: '#4CAF50',
  },
  text: {
    color: '#aaa',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeText: {
    color: 'white',
  }
});