import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CardReview } from './components/CardReview';
import { colors } from './styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerForPush, scheduleDailyReminder } from './services/notifications';
import { StatusBar } from 'expo-status-bar';

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }: any) => {
  const handleEnd = (correct: number, total: number) => {
    navigation.navigate('Summary', { correct, total });
  };
  return <CardReview onSessionEnd={handleEnd} />;
};

const SummaryScreen = ({ route, navigation }: any) => {
  const { correct, total } = route.params;
  return (
    <View style={styles.center}>
      <Text style={styles.summaryText}>Session Complete!</Text>
      <Text style={styles.summaryText}>Correct: {correct} / {total}</Text>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.popToTop()}>
        <Text style={styles.btnText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function App() {
  useEffect(() => {
    (async () => {
      const firstLaunch = await AsyncStorage.getItem('firstLaunch');
      if (!firstLaunch) {
        const granted = await registerForPush();
        if (granted) await scheduleDailyReminder();
        await AsyncStorage.setItem('firstLaunch', 'true');
      }
    })();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Summary" component={SummaryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  summaryText: {
    fontSize: 22,
    marginBottom: 20,
    fontFamily: 'Roboto',
    color: colors.text,
  },
  btn: {
    backgroundColor: colors.accent,
    padding: 12,
    borderRadius: 8,
    width: '60%',
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
});
