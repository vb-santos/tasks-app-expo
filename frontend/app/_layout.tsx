import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSegments, router } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../src/store/useAuthStore';

function useProtectedRoute() {
  const segments = useSegments();
  const { sessionToken } = useAuthStore();

  useEffect(() => {
    const inAuthGroup = segments[0] === 'login' || segments[0] === 'signup';

    if (!sessionToken && !inAuthGroup) {
      router.replace('/login');
    } else if (sessionToken && inAuthGroup) {
      router.replace('/');
    }
  }, [segments, sessionToken]);
}

export default function Layout() {
  useProtectedRoute();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#999',
        headerStyle: { backgroundColor: '#000' },
        headerTintColor: '#fff',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Minhas Tarefas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Configurações',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="signup"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="task/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}