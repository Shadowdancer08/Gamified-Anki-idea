import { Question } from '../core/types';

export const questionBank: Question[] = [
  {
    id: 'cardio-1',
    category: 'Cardiology',
    difficulty: 'easy',
    prompt: 'Which heart sound is associated with closure of the aortic and pulmonic valves?',
    choices: ['S1', 'S2', 'S3', 'S4'],
    correctAnswerIndex: 1,
    explanation: 'S2 occurs when semilunar valves close at end-systole.'
  },
  {
    id: 'micro-1',
    category: 'Microbiology',
    difficulty: 'medium',
    prompt: 'A gram-positive, catalase-positive cocci in clusters is most likely:',
    choices: ['Streptococcus pyogenes', 'Staphylococcus aureus', 'Enterococcus faecalis', 'Neisseria meningitidis'],
    correctAnswerIndex: 1,
    explanation: 'Staphylococci form clusters and are catalase positive; S. aureus is classic.'
  },
  {
    id: 'neuro-1',
    category: 'Neurology',
    difficulty: 'hard',
    prompt: 'Lesion of the subthalamic nucleus classically causes:',
    choices: ['Athetosis', 'Hemiballismus', 'Resting tremor', 'Chorea'],
    correctAnswerIndex: 1,
    explanation: 'Contralateral hemiballismus is linked with subthalamic nucleus damage.'
  },
  {
    id: 'endo-1',
    category: 'Endocrinology',
    difficulty: 'easy',
    prompt: 'Primary hyperparathyroidism typically leads to which calcium/phosphate pattern?',
    choices: ['Low calcium, high phosphate', 'High calcium, low phosphate', 'Low calcium, low phosphate', 'High calcium, high phosphate'],
    correctAnswerIndex: 1,
    explanation: 'PTH increases calcium and renal phosphate excretion, giving high Ca and low phosphate.'
  }
];
