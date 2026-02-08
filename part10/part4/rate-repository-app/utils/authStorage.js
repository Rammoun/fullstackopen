import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthStorage {
  constructor(namespace = 'auth') {
    this.namespace = namespace;
  }

  getAccessKey() {
    return `${this.namespace}:accessToken`;
  }

  async getAccessToken() {
    const token = await AsyncStorage.getItem(this.getAccessKey());
    return token ? JSON.parse(token) : [];
  }

  async setAccessToken(accessToken) {
    await AsyncStorage.setItem(
      this.getAccessKey(),
      JSON.stringify(accessToken)
    );
  }

  async removeAccessToken() {
    await AsyncStorage.removeItem(this.getAccessKey());
  }
}

export default AuthStorage;