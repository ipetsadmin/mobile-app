import AsyncStorage from '@react-native-async-storage/async-storage';

const PUSH_PROMPT_STORAGE_KEY = 'push-prompt-answered';

export async function hasAnsweredPushPrompt() {
  return (await AsyncStorage.getItem(PUSH_PROMPT_STORAGE_KEY)) === 'true';
}

export function markPushPromptAnswered() {
  return AsyncStorage.setItem(PUSH_PROMPT_STORAGE_KEY, 'true');
}
