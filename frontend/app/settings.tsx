import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTaskStore } from '../src/store/useTaskStore';
import { Ionicons } from '@expo/vector-icons';

export default function Settings() {
  const { tasks, deleteAllTasks } = useTaskStore();

  const handleClearAll = () => {
    Alert.alert(
      "Limpar Tudo",
      `Tem certeza que deseja excluir todas as ${tasks.length} tarefas?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir Todas",
          style: "destructive",
          onPress: () => {
            deleteAllTasks();
            Alert.alert("Sucesso", "Todas as tarefas foram excluídas!");
          }
        }
      ]
    );
  };

  const handleClearStorage = () => {
    Alert.alert(
      "Limpar Cache",
      "Isso removerá todas as tarefas salvas localmente. Continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar",
          style: "destructive",
          onPress: () => {
            localStorage.removeItem('tasks-storage');
            Alert.alert("Sucesso", "Cache limpo! Reinicie o app.");
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Configurações</Text>

        <View style={styles.stats}>
          <Text style={styles.statsText}>Total de Tarefas: {tasks.length}</Text>
        </View>

        <TouchableOpacity style={styles.dangerButton} onPress={handleClearAll}>
          <Ionicons name="trash-outline" size={24} color="#fff" />
          <Text style={styles.dangerButtonText}>Excluir Todas as Tarefas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.warningButton} onPress={handleClearStorage}>
          <Ionicons name="refresh-outline" size={24} color="#fff" />
          <Text style={styles.warningButtonText}>Limpar Cache Local</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  stats: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  statsText: {
    fontSize: 16,
    textAlign: 'center',
  },
  dangerButton: {
    backgroundColor: '#ff4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  dangerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  warningButton: {
    backgroundColor: '#ff9800',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  warningButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});