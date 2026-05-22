import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TaskItem as TaskType } from '../utils/handle-api';
import { useTaskStore } from "../store/useTaskStore";

interface TaskItemProps {
  task: TaskType;
  onUpdate?: (task: TaskType) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate }) => {
  const router = useRouter();
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  const handlePress = () => {
    console.log('📱 Navegando para detalhes da task:', task._id);
    router.push(`/task/${task._id}`);
  };

  const handleEdit = () => {
    console.log('✏️ Editando task:', task._id);
    if (onUpdate) {
      onUpdate(task);
    } else {
      router.push(`/task/${task._id}?edit=true`);
    }
  };

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
            console.log('🗑️ Deletando task:', task._id);
            deleteTask(task._id);
          }
        }
      ]
    );
  };

  const handleToggleComplete = () => {
    console.log('🔄 Toggle complete:', task._id, 'de', task.completed, 'para', !task.completed);
    updateTask(
      task._id,
      task.text,
      !task.completed,
      task.dueDate || null,
      task.priority || 'Baixa',
      () => {}
    );
  };;

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.task}>
        <View style={styles.contentContainer}>
          <Text style={[styles.text, !!task.completed && styles.textCompleted]}>
            {task.text}
          </Text>
          {task.dueDate && (
            <Text style={[styles.dateText, isOverdue ? styles.dateOverdue : styles.dateOnTime]}>
              Até: {new Date(task.dueDate).toLocaleDateString()}
            </Text>
          )}
        </View>
        <View style={styles.icons}>
          {/* Botão de toggle como um botão separado */}
          <TouchableOpacity
            onPress={handleToggleComplete}
            accessibilityRole="button"
            style={styles.toggleButton}
          >
            <Feather
              name={task.completed ? "check-circle" : "circle"}
              size={20}
              color="#fff"
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleEdit} accessibilityRole="button">
            <Feather name="edit" size={20} color="#fff" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} accessibilityRole="button">
            <AntDesign name="delete" size={20} color="#fff" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  task: {
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 1,
    marginRight: 10,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  textCompleted: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  dateText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: 'bold',
  },
  dateOverdue: {
    color: '#e53935',
  },
  dateOnTime: {
    color: '#43a047',
  },
  icons: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  toggleButton: {
    padding: 2,
  },
  icon: {
    padding: 2,
  },
});

export default TaskItem;