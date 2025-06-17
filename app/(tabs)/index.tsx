import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';

export default function App() {
  const [screen, setScreen] = useState('login');
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [info, setInfo] = useState('');

  const handleRegister = async () => {
    if (!user || !password) return alert('Preencha usuário e senha');
    const data = await AsyncStorage.getItem('users');
    const users = data ? JSON.parse(data) : {};

    if (users[user]) return alert('Usuário já existe');

    users[user] = { password };
    await AsyncStorage.setItem('users', JSON.stringify(users));
    alert('Usuário cadastrado com sucesso!');
  };

  const handleLogin = async () => {
    const data = await AsyncStorage.getItem('users');
    const users = data ? JSON.parse(data) : {};

    if (users[user] && users[user].password === password) {
      await AsyncStorage.setItem('currentUser', user);
      setCurrentUser(user);
      setScreen('home');
    } else {
      alert('Usuário ou senha incorretos!');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('currentUser');
    setCurrentUser(null);
    setInfo('');
    setScreen('login');
  };

  useEffect(() => {
    AsyncStorage.getItem('currentUser').then((user) => {
      if (user) {
        setCurrentUser(user);
        setScreen('home');
      }
    });
  }, []);

  const renderInfoBox = () => {
    if (!info) return null;
    return (
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>{info}</Text>
      </View>
    );
  };

  if (screen === 'login') {
    return (
      <View style={styles.container}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Login / Cadastro</Text>
        <TextInput placeholder="Usuário" style={styles.input} value={user} onChangeText={setUser} />
        <TextInput placeholder="Senha" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.secondary]} onPress={handleRegister}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (screen === 'home') {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Bem-vindo(a), {currentUser}</Text>

        <TouchableOpacity
          style={[styles.button, styles.info]}
          onPress={() =>
            setInfo(
              'Olá! 👋\nSua amostra está sendo processada com todo o cuidado e em breve o resultado do seu exame genético estará disponível.\n\nA GenoTrack agradece a sua confiança. Estamos aqui para conectar você à sua saúde com precisão, inovação e responsabilidade.\n\nFique tranquilo(a), avisaremos assim que o resultado estiver pronto. 🧬'
            )
          }
        >
          <Text style={styles.buttonText}>📋 Resultados de exames</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.info]}
          onPress={() =>
            setInfo(
              'Estamos entrando em contato com seu geneticista de confiança. Em breve você receberá um retorno especializado com base em seu histórico genético.'
            )
          }
        >
          <Text style={styles.buttonText}>🧬 Contate seu geneticista</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.info]}
          onPress={() =>
            setInfo(
              'A genética personalizada ajuda a identificar predisposições e otimizar sua saúde. Fique por dentro das tecnologias que conectam ciência e bem-estar.'
            )
          }
        >
          <Text style={styles.buttonText}>ℹ️ Saiba mais</Text>
        </TouchableOpacity>

        {renderInfoBox()}

        <TouchableOpacity style={[styles.button, styles.logout]} onPress={handleLogout}>
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
    backgroundColor: '#0d6efd',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  secondary: {
    backgroundColor: '#198754',
  },
  logout: {
    backgroundColor: '#dc3545',
  },
  info: {
    backgroundColor: '#6f42c1',
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#e9f7ff',
    borderLeftWidth: 5,
    borderLeftColor: '#0d6efd',
    padding: 15,
    marginTop: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    color: '#004085',
    lineHeight: 22,
  },
});
