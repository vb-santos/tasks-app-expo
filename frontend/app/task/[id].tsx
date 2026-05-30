import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useTaskStore } from '../../src/store/useTaskStore';
import { Ionicons } from '@expo/vector-icons';

export default function TaskDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const tasks = useTaskStore((state) => state.tasks);
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const task = tasks.find(t => String(t._id) === String(id));

  if (!task) {
    console.log('❌ Task não encontrada para ID:', id);
    return (
      <View style={styles.center}>
        <Text>Tarefa não encontrada</Text>
        <Text style={styles.debugText}>ID buscado: {id}</Text>
        <Text style={styles.debugText}>Total de tasks: {tasks.length}</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Excluir Tarefa",
      `Tem certeza que deseja excluir "${task.text}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            deleteTask(task._id);
            router.back();
          }
        }
      ]
    );
  };

  const handleToggleComplete = () => {
    updateTask(
      task._id,
      task.text,
      !task.completed,
      task.dueDate || null,
      () => {}
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: task.text.length > 20 ? task.text.substring(0, 20) + '...' : task.text,
          headerRight: () => (
            <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
              <Ionicons name="trash-outline" size={24} color="#ff4444" />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>{task.text}</Text>

          <TouchableOpacity onPress={handleToggleComplete} style={styles.statusButton}>
            <Text style={styles.statusText}>
              Status: {task.completed ? '✅ Concluída' : '⏳ Pendente'}
            </Text>
          </TouchableOpacity>

          {task.dueDate && (
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={styles.infoText}>
                Data limite: {new Date(task.dueDate).toLocaleDateString()}
              </Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <Text style={styles.infoText}>
              ID: {task._id}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  statusButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 16,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  headerButton: {
    marginRight: 16,
  },
  debugText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#000',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});