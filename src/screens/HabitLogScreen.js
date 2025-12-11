// src/screens/HabitLogScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../services/supabaseClient';

const HABITS = [
  { type: 'water', label: 'Log Water' },
  { type: 'sleep', label: 'Log Sleep' },
  { type: 'exercise', label: 'Log Exercise' },
  { type: 'journal', label: 'Log Journal' },
];

export default function HabitLogScreen() {
  const [loadingType, setLoadingType] = useState(null);

  const logHabit = async (type) => {
    setLoadingType(type);
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) {
        Alert.alert('Sign in required', 'Please sign in to log habits.');
        return;
      }

      const { error } = await supabase.from('habits').insert({
        user_id: user.id,
        type,
      });
      if (error) throw error;

      Alert.alert('Logged!', `Successfully logged ${type}.`);
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to log habit.');
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>The Last Habit</Text>
      <Text style={styles.subtitle}>Fuel your survival by logging real habits.</Text>

      <View style={styles.grid}>
        {HABITS.map((h) => (
          <TouchableOpacity
            key={h.type}
            style={[
              styles.button,
              loadingType === h.type ? styles.buttonDisabled : null,
            ]}
            onPress={() => logHabit(h.type)}
            disabled={loadingType === h.type}
          >
            <Text style={styles.buttonText}>
              {loadingType === h.type ? `Logging ${h.type}...` : h.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 24 },
  grid: { gap: 12 },
  button: {
    backgroundColor: '#1f6feb',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: '#93b5f5' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
