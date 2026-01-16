import { Ionicons } from '@expo/vector-icons'; // Added for back button
import { Audio } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Adjust imports to point to your components
import Headstock from '../components/Headstock';
import TunerEngine from '../components/TunerEngine';
import TunerVisual from '../components/TunerVisual';
import { getCents, getCentsFromTarget, getNote, GUITAR_STRINGS } from '../services/TunerService';

export default function TunerScreen({ navigation }) {
  const [note, setNote] = useState("-");
  const [cents, setCents] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedString, setSelectedString] = useState(null);
  
  const silenceTimer = useRef(null);
  const soundRef = useRef(new Audio.Sound());
  const lastPlayedTime = useRef(0);

  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      try { await soundRef.current.loadAsync(require('../../assets/ping.mp3')); } catch (error) {}
    })();
    
    // Auto-start listening when entering screen
    setIsListening(true);
    return () => setIsListening(false); // Stop when leaving
  }, []);

  const playSuccessSound = async () => {
    const now = Date.now();
    if (now - lastPlayedTime.current > 2000) {
      try { await soundRef.current.replayAsync(); lastPlayedTime.current = now; } catch (e) {}
    }
  };

  const handleNoteDetected = (rawFreq) => {
    if (silenceTimer.current) clearTimeout(silenceTimer.current);
    if (!rawFreq || rawFreq < 40) return; 

    let finalFreq = rawFreq;
    let detectedNote = "-";
    let detectedCents = 0;

    if (selectedString === null) {
      detectedNote = getNote(finalFreq);
      detectedCents = getCents(finalFreq, detectedNote);
    } else {
      const target = GUITAR_STRINGS.find(s => s.notation === selectedString);
      if (target) {
        const ratio = finalFreq / target.frequency;
        if (ratio > 1.8 && ratio < 2.2) finalFreq = finalFreq / 2;
        detectedNote = target.note;
        detectedCents = getCentsFromTarget(finalFreq, target.frequency);
        if (Math.abs(detectedCents) > 1500) return; 
      }
    }

    setNote(detectedNote);
    setCents(detectedCents);

    if (Math.abs(detectedCents) < 4) playSuccessSound();

    silenceTimer.current = setTimeout(() => { setNote("-"); setCents(0); }, 400);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={styles.backText}>Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Standard Tuning</Text>
        <View style={{width: 60}} /> 
      </View>

      <Headstock selectedString={selectedString} currentNote={note} onSelect={setSelectedString} />

      <View style={styles.content}>
        <TunerVisual currentNote={note} cents={cents} />
        {/* Removed Start/Stop button because it auto-starts now for better UX */}
        
        {hasPermission && (
          <TunerEngine isListening={isListening} onNoteDetected={handleNoteDetected} />
        )}
      </View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    paddingHorizontal: 20, paddingTop: 40, paddingBottom: 10, backgroundColor: '#1E1E1E' 
  },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backText: { color: 'white', fontSize: 16, marginLeft: 5 },
  headerTitle: { color: '#aaa', fontSize: 16, fontWeight: 'bold' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 20 },
});