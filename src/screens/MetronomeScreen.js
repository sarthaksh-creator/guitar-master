import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext'; // <--- Import Hook

// Standard sound URL (Reliable Google Link)
const GOOGLE_CLICK_URL = 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg';

export default function MetronomeScreen({ navigation }) {
  // 1. Get Theme
  const { theme } = useTheme(); 
  
  const [bpm, setBpm] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef(new Audio.Sound());
  const timerRef = useRef(null);

  useEffect(() => {
    initAudio();
    return () => stopMetronome();
  }, []);

  const initAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playThroughEarpieceAndroid: false,
        shouldDuckAndroid: true,
      });
      await soundRef.current.loadAsync({ uri: GOOGLE_CLICK_URL });
    } catch (e) {}
  };

  const playBeat = async () => {
    try { await soundRef.current.replayAsync(); } 
    catch (e) { try { await soundRef.current.playFromPositionAsync(0); } catch(err) {} }
  };

  const startMetronome = () => {
    setIsPlaying(true);
    const interval = 60000 / bpm;
    playBeat();
    timerRef.current = setInterval(playBeat, interval);
  };

  const stopMetronome = () => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const changeBpm = (amount) => {
    const newBpm = Math.min(240, Math.max(40, bpm + amount));
    setBpm(newBpm);
    if (isPlaying) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(playBeat, 60000 / newBpm);
    }
  };

  return (
    // 2. Use theme.background
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.icon} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Metronome</Text>
        <View style={{width: 24}} />
      </View>

      <View style={styles.content}>
        
        {/* Circle Background: theme.card, Border: theme.border */}
        <View style={[styles.bpmCircle, { backgroundColor: theme.card, borderColor: theme.border }, isPlaying && styles.bpmActive]}>
          <Text style={[styles.bpmText, { color: theme.text }]}>{bpm}</Text>
          <Text style={styles.bpmLabel}>BPM</Text>
        </View>

        <View style={styles.controls}>
          {/* Buttons stay dark for contrast, or you can use theme.card */}
          <TouchableOpacity style={styles.btnSmall} onPress={() => changeBpm(-10)}><Text style={styles.btnText}>-10</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btnSmall} onPress={() => changeBpm(-1)}><Text style={styles.btnText}>-1</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btnSmall} onPress={() => changeBpm(1)}><Text style={styles.btnText}>+1</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btnSmall} onPress={() => changeBpm(10)}><Text style={styles.btnText}>+10</Text></TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.playBtn, isPlaying ? styles.btnStop : styles.btnStart]} 
          onPress={() => isPlaying ? stopMetronome() : startMetronome()}
        >
          <Ionicons name={isPlaying ? "stop" : "play"} size={40} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { marginTop: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  
  bpmCircle: { 
    width: 220, height: 220, borderRadius: 110, borderWidth: 4, 
    alignItems: 'center', justifyContent: 'center', marginBottom: 30 
  },
  bpmActive: { borderColor: '#4CAF50', elevation: 10 },
  bpmText: { fontSize: 70, fontWeight: 'bold' },
  bpmLabel: { color: '#4CAF50', fontSize: 18, letterSpacing: 2 },
  
  controls: { flexDirection: 'row', gap: 15, marginBottom: 50 },
  btnSmall: { backgroundColor: '#333', width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#444' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  
  playBtn: { width: 90, height: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center', elevation: 10 },
  btnStart: { backgroundColor: '#4CAF50' },
  btnStop: { backgroundColor: '#D32F2F' }
});