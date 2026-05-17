import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '../stores/authContext';

const ProfileScreen = () => {
  const { state, signOut, deactivateAccount } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      'confirmar',
      'quer mesmo sair?',
      [
        { text: 'cancelar', onPress: () => { } },
        {
          text: 'sair',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('erro', 'falha ao sair da conta');
            }
          },
        },
      ]
    );
  };

  const handleDeactivate = async () => {
    Alert.alert(
      'desativar conta',
      'desativaremos sua conta e manteremos seus dados seguros',
      [
        { text: 'cancelar', onPress: () => { } },
        {
          text: 'desativar',
          onPress: async () => {
            setIsLoading(true);
            try {
              await deactivateAccount();
              Alert.alert('sucesso', 'conta desativada');
            } catch (error) {
              Alert.alert('erro', 'falha ao desativar a conta');
            } finally {
              setIsLoading(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (!state.user) {
    return (
      <View style={styles.centerContainer}>
        <Text>carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {state.user.name?.charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text style={styles.userName}>{state.user.name}</Text>
        <Text style={styles.userEmail}>{state.user.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>configurações</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleLogout}
          disabled={isLoading}
        >
          <Text style={styles.menuItemText}>sair da Conta</Text>
          <Text style={styles.menuItemArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, styles.dangerMenu]}
          onPress={handleDeactivate}
          disabled={isLoading}
        >
          <Text style={[styles.menuItemText, styles.dangerText]}>
            Desativar Conta
          </Text>
          <Text style={[styles.menuItemArrow, styles.dangerText]}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoText}>SaudePet v1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    paddingVertical: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#82B1B7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    textTransform: 'uppercase',
    backgroundColor: '#f9f9f9',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dangerMenu: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  dangerText: {
    color: '#ff3b30',
  },
  menuItemArrow: {
    fontSize: 20,
    color: '#ccc',
  },
  infoSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  infoText: {
    fontSize: 12,
    color: '#999',
  },
});

export default ProfileScreen;
