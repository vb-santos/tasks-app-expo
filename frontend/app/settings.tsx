import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../src/store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';

export default function Settings() {
  const { logout, user } = useAuthStore();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Configurações</Text>

        {user && (
          <View style={styles.userInfo}>
            <Ionicons name="person-circle-outline" size={40} color="#666" />
            <View>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#f0f0f0', padding: 12, borderRadius: 8, marginBottom: 20 },
  userName: { fontSize: 16, fontWeight: 'bold' },
  userEmail: { fontSize: 14, color: '#666' },
  logoutButton: { backgroundColor: '#333', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 8, marginTop: 8 },
  logoutButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
});