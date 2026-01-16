import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext'; // <--- Import

const WORKING_SOUND_URL = 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg';

export default function EarTrainerScreen({ navigation }) {
  const { theme } = useTheme(); // <--- Get Theme
  const [status, setStatus] = useState("Tap Play to Start");
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const soundRef = useRef(new Audio.Sound());

  useEffect(() => {
    initAudio();
    return () => { if (soundRef.current) soundRef.current.unloadAsync(); };
  }, []);

  const initAudio = async () => {
    try {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: false, shouldDuckAndroid: true });
      await soundRef.current.loadAsync({ uri: WORKING_SOUND_URL });
    } catch (e) {}
  };

  const playMysteryNote = async () => {
    setStatus("🔊 Listen carefully...");
    setCorrectAnswer(null);
    const isHigh = Math.random() > 0.5;
    setCorrectAnswer(isHigh ? 'High' : 'Low');
    try {
      const pitch = isHigh ? 1.5 : 0.8;
      await soundRef.current.setRateAsync(pitch, true);
      await soundRef.current.replayAsync();
    } catch (e) {}
  };

  const checkAnswer = (guess) => {
    if (!correctAnswer) { setStatus("Tap PLAY first! 🎵"); return; }
    setStatus(guess === correctAnswer ? "✅ Correct!" : "❌ Wrong!");
    setCorrectAnswer(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.icon} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Ear Trainer</Text>
        <View style={{width: 24}} />
      </View>

      <View style={styles.content}>
        <Ionicons name="musical-note" size={100} color="#9C27B0" style={{marginBottom: 20}} />
        
        <Text style={[styles.statusText, { color: theme.text }]}>{status}</Text>

        <TouchableOpacity style={styles.playBtn} onPress={playMysteryNote}>
          <Text style={styles.btnText}>▶ PLAY MYSTERY NOTE</Text>
        </TouchableOpacity>

        <View style={styles.row}>
          <TouchableOpacity style={[styles.guessBtn, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => checkAnswer('High')}>
            <Text style={[styles.btnText, { color: theme.text }]}>High ↑</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.guessBtn, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => checkAnswer('Low')}>
            <Text style={[styles.btnText, { color: theme.text }]}>Low ↓</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { marginTop: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  statusText: { fontSize: 22, fontWeight: 'bold', marginBottom: 40, textAlign: 'center', height: 60 },
  playBtn: { backgroundColor: '#9C27B0', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30, marginBottom: 40, elevation: 5 },
  row: { flexDirection: 'row', gap: 20 },
  guessBtn: { paddingVertical: 20, paddingHorizontal: 40, borderRadius: 15, borderWidth: 1 },
  btnText: { fontWeight: 'bold', fontSize: 16, color: 'white' }
});