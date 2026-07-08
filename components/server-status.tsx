import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import axios from 'axios';
import { baseURL } from '../api/axiosconfig';

export default function ServerStatus() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const checkServer = async () => {
      try {
        await axios.get(`${baseURL}/api/test`, { timeout: 3000 });
        setIsOnline(true);
      } catch {
        setIsOnline(false);
      }
    };

    checkServer();
    const interval = setInterval(checkServer, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.dot,
          isOnline === true && styles.online,
          isOnline === false && styles.offline,
          isOnline === null && styles.unknown,
        ]}
      />
      <Text style={styles.text}>
        {isOnline === true ? 'Online' : isOnline === false ? 'Offline' : 'Checking...'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  online: {
    backgroundColor: '#28a745',
  },
  offline: {
    backgroundColor: '#dc3545',
  },
  unknown: {
    backgroundColor: '#6c757d',
  },
  text: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});
