import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Card, getDueCards, answerCard } from '../services/anki';
import { ProgressRing } from './ProgressRing';
import { colors } from '../styles/theme';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';

interface Props {
  onSessionEnd: (correct: number, total: number) => void;
}

const { width } = Dimensions.get('window');
const SESSION_LIMIT = 5;
const SESSION_DURATION = 3 * 60 * 1000; // 3 minutes

export const CardReview: React.FC<Props> = ({ onSessionEnd }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [index, setIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [correct, setCorrect] = useState(0);
  const startTime = useRef(Date.now());

  const anim = useSharedValue(0);

  useEffect(() => {
    (async () => {
      const data = await getDueCards(SESSION_LIMIT);
      setCards(data);
    })();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (Date.now() - startTime.current > SESSION_DURATION) {
        clearInterval(timer);
        onSessionEnd(correct, cards.length);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [cards, correct]);

  const handleAnswer = async (gotIt: boolean) => {
    const card = cards[index];
    await answerCard(card.id, gotIt);
    if (gotIt) setCorrect(c => c + 1);
    anim.value = withTiming(1, { duration: 300 }, () => {
      anim.value = 0;
      runOnJS(nextCard)();
    });
    Haptics.selectionAsync();
  };

  const nextCard = () => {
    const next = index + 1;
    if (next >= cards.length || next >= SESSION_LIMIT) {
      onSessionEnd(correct, cards.length);
    } else {
      setShowBack(false);
      setIndex(next);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(showBack ? 0.95 : 1) }, { translateY: anim.value * 300 }],
    opacity: 1 - anim.value,
  }));

  const onGesture = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.translationX > 50) {
      handleAnswer(true);
    } else if (event.nativeEvent.translationX < -50) {
      handleAnswer(false);
    }
  };

  if (!cards.length) return <Text style={styles.text}>No cards due 🎉</Text>;
  const card = cards[index];

  return (
    <View style={styles.container}>
      <PanGestureHandler onEnded={onGesture}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowBack(!showBack)}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.cardText}>{showBack ? card.back : card.front}</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>

      <ProgressRing duration={60000} onComplete={() => handleAnswer(false)} />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.btn} onPress={() => handleAnswer(true)}>
          <Text style={styles.btnText}>✔️ Got It</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => handleAnswer(false)}>
          <Text style={styles.btnText}>🔄 Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    width: width - 40,
    height: 250,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cardText: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Roboto',
    color: colors.text,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  btn: {
    backgroundColor: colors.accent,
    flex: 1,
    marginHorizontal: 5,
    padding: 12,
    borderRadius: 8,
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
  text: {
    marginTop: 40,
    fontSize: 18,
    fontFamily: 'Roboto',
    color: colors.text,
  },
});
