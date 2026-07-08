import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ServerStatus from '../../components/server-status';
import api from '../../api/axiosconfig';

interface User {
  id: number;
  name: string;
  email: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ user?: string }>();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>('');

  const handleLogout = () => {
    router.replace('/(auth)/login');
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/api/users');
        setUsers(response.data.users || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (params.user) {
      try {
        const user = JSON.parse(params.user);
        setUserName(user.name);
      } catch (error) {
        console.error('Failed to parse user param:', error);
      }
    }

    fetchUsers();
  }, [params.user]);

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        {userName ? (
          <Text style={styles.welcomeText}>Welcome back {userName}</Text>
        ) : (
          <View />
        )}
        <View style={styles.topRight}>
          <ServerStatus />
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.header}>Users</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <>
          <View style={styles.counterBox}>
            <Text style={styles.counterLabel}>Registered Users</Text>
            <Text style={styles.counterValue}>{users.length}</Text>
          </View>

          <View style={styles.table}>
            <View style={[styles.row, styles.headerRow]}>
              <Text style={[styles.cell, styles.headerCell]}>ID</Text>
              <Text style={[styles.cell, styles.headerCell]}>Name</Text>
              <Text style={[styles.cell, styles.headerCell]}>Email</Text>
            </View>

            {users.map((user) => (
              <View key={user.id} style={styles.row}>
                <Text style={styles.cell}>{user.id}</Text>
                <Text style={styles.cell}>{user.name}</Text>
                <Text style={styles.cell}>{user.email}</Text>
              </View>
            ))}

            {users.length === 0 && !loading && (
              <Text style={styles.emptyText}>No users found.</Text>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  counterBox: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  counterLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  counterValue: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 4,
  },
  table: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#000',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  headerRow: {
    backgroundColor: '#000',
    borderBottomWidth: 0,
  },
  cell: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  headerCell: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    padding: 16,
    color: '#000',
  },
});
