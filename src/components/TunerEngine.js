import { View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function TunerEngine({ onNoteDetected, isListening }) {
  
  const tuningScript = `
    <!DOCTYPE html>
    <html>
    <body>
      <script>
        const BUFFER_SIZE = 4096; // Max precision for Bass

        let audioContext;
        let analyser;
        let scriptProcessor;

        async function start() {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
              audio: { 
                echoCancellation: false, 
                autoGainControl: false, 
                noiseSuppression: false,
                latency: 0
              } 
            });

            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const microphone = audioContext.createMediaStreamSource(stream);
            
            // Low Pass Filter (Focus on Guitar Frequencies)
            const filter = audioContext.createBiquadFilter();
            filter.type = "lowpass";
            filter.frequency.value = 900; 

            analyser = audioContext.createAnalyser();
            analyser.fftSize = BUFFER_SIZE;

            microphone.connect(filter);
            filter.connect(analyser);
            
            scriptProcessor = audioContext.createScriptProcessor(BUFFER_SIZE, 1, 1);
            analyser.connect(scriptProcessor);
            scriptProcessor.connect(audioContext.destination);

            scriptProcessor.onaudioprocess = function() {
              const buffer = new Float32Array(BUFFER_SIZE);
              analyser.getFloatTimeDomainData(buffer);
              
              const freq = detectPitch(buffer, audioContext.sampleRate);
              if (freq > 0) {
                // Send JUST the frequency (Tuner Mode)
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'pitch', frequency: freq }));
              }
            };
          } catch (err) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: err.message }));
          }
        }

        // --- YIN / AUTOCORRELATION ALGORITHM ---
        function detectPitch(buffer, sampleRate) {
          const SIZE = buffer.length;
          let rms = 0;
          for (let i = 0; i < SIZE; i++) rms += buffer[i] * buffer[i];
          rms = Math.sqrt(rms / SIZE);

          if (rms < 0.03) return -1; // Noise Gate

          let r1 = 0, r2 = SIZE - 1;
          const thres = 0.2;
          for (let i = 0; i < SIZE / 2; i++) if (Math.abs(buffer[i]) < thres) { r1 = i; break; }
          for (let i = 1; i < SIZE / 2; i++) if (Math.abs(buffer[SIZE - i]) < thres) { r2 = SIZE - i; break; }

          const buf = buffer.slice(r1, r2);
          const c = new Array(buf.length).fill(0);
          
          for (let i = 0; i < buf.length; i++) {
            for (let j = 0; j < buf.length - i; j++) {
              c[i] = c[i] + buf[j] * buf[j + i];
            }
          }

          let d = 0; while (c[d] > c[d + 1]) d++;
          let maxval = -1, maxpos = -1;
          for (let i = d; i < buf.length; i++) {
            if (c[i] > maxval) { maxval = c[i]; maxpos = i; }
          }

          let T0 = maxpos;
          const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
          if (x1 && x2 && x3) {
             const a = (x1 + x3 - 2 * x2) / 2;
             const b = (x3 - x1) / 2;
             if (a) T0 = T0 - b / (2 * a);
          }

          return sampleRate / T0;
        }

        start();
      </script>
    </body>
    </html>
  `;

  return (
    <View style={{ height: 0, width: 0, opacity: 0 }}>
      {isListening && (
        <WebView
          originWhitelist={['*']}
          source={{ html: tuningScript, baseUrl: 'https://localhost' }}
          onPermissionRequest={(req) => req.grant(req.resources)}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          mediaPlaybackRequiresUserAction={false}
          mixedContentMode="always"
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              // Make sure to send the correct data format
              if (data.type === 'pitch') onNoteDetected(data.frequency);
            } catch (e) {}
          }}
        />
      )}
    </View>
  );
}