import { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Svg, { Line, Path } from 'react-native-svg';

const { width } = Dimensions.get('window');
const METER_SIZE = width - 40;

export default function TunerVisual({ currentNote, cents }) {
  const rotation = useSharedValue(0);

  const isPerfect = currentNote !== "-" && Math.abs(cents) < 5;
  const needleColor = isPerfect ? '#00FF00' : '#FF3D00'; 

  useEffect(() => {
    // If "Silence" (note is "-"), drift back to 0
    if (currentNote === "-") {
      rotation.value = withSpring(0, { damping: 20, stiffness: 90 }); 
      return;
    }

    // Clamp values to stop needle from hitting the physical edge
    // +/- 50 cents is the max range of the gauge
    let visualCents = cents;
    if (visualCents > 50) visualCents = 50;
    if (visualCents < -50) visualCents = -50;

    // Convert to degrees (-45 to +45)
    const targetRotation = (visualCents / 50) * 45; 
    
    // Animate smoothly
    rotation.value = withSpring(targetRotation, { 
      damping: 15,    // Higher = less bouncy
      stiffness: 120, // Higher = faster response
      mass: 0.8       // Lower = lighter needle
    });
  }, [cents, currentNote]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: METER_SIZE / 2 }, 
      { rotate: `${rotation.value}deg` },
      { translateY: -METER_SIZE / 2 },
    ],
  }));

  return (
    <View style={styles.container}>
      {/* Note Circle */}
      <View style={[styles.noteContainer, isPerfect && styles.noteContainerPerfect]}>
        <Text style={[styles.noteText, isPerfect && { color: '#fff' }]}>
          {currentNote}
        </Text>
      </View>

      {/* Visual Gauge */}
      <View style={styles.gaugeContainer}>
        <Svg height={100} width={METER_SIZE} viewBox="0 0 200 100">
          <Line x1="100" y1="10" x2="100" y2="25" stroke="#777" strokeWidth="2" />
          <Line x1="50" y1="25" x2="55" y2="35" stroke="#444" strokeWidth="2" />
          <Line x1="150" y1="25" x2="145" y2="35" stroke="#444" strokeWidth="2" />
          <Path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="#222"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </Svg>

        {/* The Needle */}
        <Animated.View style={[styles.needleContainer, animatedStyle]}>
          <View style={[styles.needle, { backgroundColor: needleColor }]} />
          <View style={[styles.needleBase, { backgroundColor: needleColor }]} />
        </Animated.View>
      </View>

      <Text style={styles.statusText}>
        {currentNote === "-" ? "Play a String" : isPerfect ? "PERFECT" : cents < 0 ? "Too Low" : "Too High"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  noteContainer: {
    width: 80, height: 80,
    borderRadius: 40,
    backgroundColor: '#1E1E1E',
    borderWidth: 2,
    borderColor: '#333',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
  },
  noteContainerPerfect: {
    backgroundColor: '#4CAF50', 
    borderColor: '#4CAF50',
    elevation: 10,
  },
  noteText: { fontSize: 40, fontWeight: 'bold', color: '#fff' },
  gaugeContainer: { height: 100, width: METER_SIZE, overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end' },
  needleContainer: { position: 'absolute', bottom: 0, alignItems: 'center', height: 100, justifyContent: 'flex-start' },
  needle: { width: 4, height: 90, borderRadius: 2 },
  needleBase: { width: 14, height: 14, borderRadius: 7, marginTop: -7 },
  statusText: { marginTop: 10, color: '#888', fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase' }
});