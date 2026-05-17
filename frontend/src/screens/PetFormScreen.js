import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { createPet, updatePet } from '../api/pets';

const PetFormScreen = ({ navigation, route }) => {
  const petData = route?.params?.pet;
  const isEditing = !!petData;

  const [name, setName] = useState(petData?.name || '');
  const [breed, setBreed] = useState(petData?.breed || '');
  const [dob, setDob] = useState(petData?.dob ? new Date(petData.dob).toISOString().split('T')[0] : '');
  const [selectedDate, setSelectedDate] = useState(dob ? new Date(dob) : null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [notes, setNotes] = useState(petData?.notes || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'nome do pet é obrigatório');
      return;
    }

    setIsLoading(true);
    try {
      const dobToSave = dob || '';
      if (isEditing) {
        await updatePet(petData._id, { name, breed, dob: dobToSave, notes });
        Alert.alert('sucesso', 'informações atualizadas');
      } else {
        await createPet(name, breed, dobToSave, notes);
        Alert.alert('sucesso', 'pet adicionado');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('erro', 'não conseguimos salvar informações do seu pet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{isEditing ? 'editar informações' : 'adicionar pet'}</Text>

      <View style={styles.form}>
        <Text style={styles.label}>nome</Text>
        <TextInput
          style={styles.input}
          placeholder="nome"
          value={name}
          onChangeText={setName}
          editable={!isLoading}
        />

        <Text style={styles.label}>raça</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: SRD"
          value={breed}
          onChangeText={setBreed}
          editable={!isLoading}
        />

        <Text style={styles.label}>data de nascimento</Text>
        <TouchableOpacity
          style={[styles.input, { justifyContent: 'center' }]}
          onPress={() => setDatePickerVisible(true)}
          disabled={isLoading}
        >
          <Text style={{ color: selectedDate ? '#333' : '#999' }}>
            {selectedDate
              ? `${String(selectedDate.getDate()).padStart(2, '0')}/${String(selectedDate.getMonth() + 1).padStart(2, '0')}/${selectedDate.getFullYear()}`
              : 'selecionar data'}
          </Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          date={selectedDate || new Date()}
          onConfirm={(date) => {
            setSelectedDate(date);
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            setDob(`${y}-${m}-${d}`);
            setDatePickerVisible(false);
          }}
          onCancel={() => setDatePickerVisible(false)}
          maximumDate={new Date()}
        />

        <Text style={styles.label}>notas</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="informações adicionais"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          editable={!isLoading}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'salvando...' : 'salvar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#82B1B7',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 24,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PetFormScreen;
