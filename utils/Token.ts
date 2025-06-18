import * as SecureStore from 'expo-secure-store';

// Store a token
export async function saveToken(key:string, value:string) {
  await SecureStore.setItemAsync(key, value);
}

// Retrieve a token
export async function getToken(key:string) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  } else {
    return null;
  }
}
export async function removeToken(key:string) {
  await SecureStore.deleteItemAsync(key)
}