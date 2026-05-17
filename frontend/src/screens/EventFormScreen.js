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
import { Modal } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { createEvent, updateEvent } from '../api/events';

const EventFormScreen = ({ navigation, route }) => {
  const { petId, event: eventData } = route.params;
  const isEditing = !!eventData;

  const [date, setDate] = useState(
    eventData ? new Date(eventData.date).toISOString().split('T')[0] : ''
  );
  const [selectedDate, setSelectedDate] = useState(date ? new Date(date) : null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isVaccineDatePickerVisible, setVaccineDatePickerVisible] = useState(false);
  const [isManufactureMonthPickerVisible, setManufactureMonthPickerVisible] = useState(false);
  const [isTypeModalVisible, setTypeModalVisible] = useState(false);
  const [notes, setNotes] = useState(eventData?.notes || '');
  const [type, setType] = useState(eventData?.type || 'outro');
  const [vaccineApplied, setVaccineApplied] = useState(
    eventData?.type === 'vacina' && eventData.vaccine?.applicationDate ? true : false
  );
  const [vaccine, setVaccine] = useState({
    name: eventData?.vaccine?.name || '',
    manufactureDate: eventData?.vaccine?.manufactureDate || '',
    part: eventData?.vaccine?.part || '',
    serialNumber: eventData?.vaccine?.serialNumber || '',
    applicationDate: eventData?.vaccine?.applicationDate
      ? new Date(eventData.vaccine.applicationDate).toISOString().split('T')[0]
      : '',
    additionalInfo: eventData?.vaccine?.additionalInfo || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const eventTypes = [
    { label: 'vacina', value: 'vacina' },
    { label: 'consulta', value: 'consulta' },
    { label: 'medicamento', value: 'medicamento' },
    { label: 'banho', value: 'banho' },
    { label: 'tosa', value: 'tosa' },
    { label: 'outro', value: 'outro' },
  ];

  const handleSave = async () => {
    if (!date.trim()) {
      Alert.alert('Erro', 'data é obrigatória');
      return;
    }

    // If type is vacina and user indicates it was applied, validate vaccine fields
    if (type === 'vacina' && vaccineApplied) {
      if (!vaccine.name || !vaccine.name.trim()) {
        Alert.alert('Erro', "nome da vacina é obrigatório");
        return;
      }
      if (vaccine.name.length > 20) {
        Alert.alert('Erro', 'nome da vacina deve ter no máximo 20 caracteres');
        return;
      }
      if (!vaccine.manufactureDate || !vaccine.manufactureDate.trim()) {
        Alert.alert('Erro', 'data de fabricação é obrigatória');
        return;
      }
      const mdRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
      if (!mdRegex.test(vaccine.manufactureDate)) {
        Alert.alert('Erro', 'data de fabricação deve estar no formato YYYY-MM');
        return;
      }
      if (!vaccine.applicationDate || !vaccine.applicationDate.trim()) {
        Alert.alert('Erro', 'data da aplicação é obrigatória');
        return;
      }
    }

    setIsLoading(true);
    try {
      if (isEditing) {
        const payload = {
          date: new Date(date).toISOString(),
          notes,
          type,
        };
        if (type === 'vacina' && vaccineApplied) {
          payload.vaccine = {
            ...vaccine,
            applicationDate: new Date(vaccine.applicationDate).toISOString(),
          };
        }
        await updateEvent(eventData._id, payload);
        Alert.alert('Sucesso', 'evento atualizado com sucesso');
      } else {
        const payload = {
          date: new Date(date).toISOString(),
          petId,
          notes,
          type,
        };
        if (type === 'vacina' && vaccineApplied) {
          payload.vaccine = {
            ...vaccine,
            applicationDate: new Date(vaccine.applicationDate).toISOString(),
          };
        }
        await createEvent(payload);
        Alert.alert('Sucesso', 'evento criado com sucesso');
      }
      try {
        navigation.navigate('Home', { refresh: Date.now() });
      } catch (e) {
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Erro', 'falha ao salvar evento');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{isEditing ? 'editar Evento' : 'novo evento'}</Text>

      <View style={styles.form}>
        <Text style={styles.label}>data</Text>
        <TouchableOpacity
          style={[styles.input, { justifyContent: 'center' }]}
          onPress={() => setDatePickerVisible(true)}
          disabled={isLoading}
        >
          <Text style={{ color: selectedDate ? '#333' : '#999' }}>
            {selectedDate
              ? `${String(selectedDate.getDate()).padStart(2, '0')}/${String(selectedDate.getMonth() + 1).padStart(2, '0')}/${selectedDate.getFullYear()}`
              : 'Selecionar data'}
          </Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          date={selectedDate || new Date()}
          onConfirm={(dt) => {
            setSelectedDate(dt);
            const y = dt.getFullYear();
            const m = String(dt.getMonth() + 1).padStart(2, '0');
            const d = String(dt.getDate()).padStart(2, '0');
            setDate(`${y}-${m}-${d}`);
            setDatePickerVisible(false);
          }}
          onCancel={() => setDatePickerVisible(false)}
          maximumDate={new Date()}
        />

        <DateTimePickerModal
          isVisible={isVaccineDatePickerVisible}
          mode="date"
          date={vaccine.applicationDate ? new Date(vaccine.applicationDate) : new Date()}
          onConfirm={(dt) => {
            const y = dt.getFullYear();
            const m = String(dt.getMonth() + 1).padStart(2, '0');
            const d = String(dt.getDate()).padStart(2, '0');
            const iso = `${y}-${m}-${d}`;
            setVaccine((s) => ({ ...s, applicationDate: iso }));
            setVaccineDatePickerVisible(false);
          }}
          onCancel={() => setVaccineDatePickerVisible(false)}
          maximumDate={new Date()}
        />

        <Text style={styles.label}>tipo de evento</Text>
        <TouchableOpacity
          style={[styles.input, { justifyContent: 'center' }]}
          onPress={() => setTypeModalVisible(true)}
          disabled={isLoading}
        >
          <Text style={{ color: type ? '#333' : '#999' }}>
            {eventTypes.find((et) => et.value === type)?.label || 'selecionar tipo'}
          </Text>
        </TouchableOpacity>

        <Modal
          visible={isTypeModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setTypeModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPressOut={() => setTypeModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>escolha o tipo</Text>
              {eventTypes.map((et) => (
                <TouchableOpacity
                  key={et.value}
                  style={styles.modalOption}
                  onPress={() => {
                    setType(et.value);
                    setTypeModalVisible(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{et.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        <Text style={styles.label}>notas</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Adicione informações sobre o evento"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          editable={!isLoading}
        />

        {type === 'vacina' && (
          <>
            <Text style={styles.label}>Vacina aplicada?</Text>
            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
              <TouchableOpacity
                style={[styles.smallOption, vaccineApplied && styles.smallOptionActive]}
                onPress={() => setVaccineApplied(true)}
                disabled={isLoading}
              >
                <Text style={{ color: vaccineApplied ? '#fff' : '#333' }}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.smallOption, !vaccineApplied && styles.smallOptionActive, { marginLeft: 8 }]}
                onPress={() => setVaccineApplied(false)}
                disabled={isLoading}
              >
                <Text style={{ color: !vaccineApplied ? '#fff' : '#333' }}>Não</Text>
              </TouchableOpacity>
            </View>

            {vaccineApplied && (
              <>
                <Text style={styles.label}>nome da vacina</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Raiva"
                  value={vaccine.name}
                  onChangeText={(t) => setVaccine((s) => ({ ...s, name: t }))}
                  editable={!isLoading}
                />

                <Text style={styles.label}>data de fabricação (AAAA-MM)</Text>
                <TouchableOpacity
                  style={[styles.input, { justifyContent: 'center' }]}
                  onPress={() => setManufactureMonthPickerVisible(true)}
                  disabled={isLoading}
                >
                  <Text style={{ color: vaccine.manufactureDate ? '#333' : '#999' }}>
                    {vaccine.manufactureDate ? vaccine.manufactureDate : 'Selecionar mês'}
                  </Text>
                </TouchableOpacity>

                <DateTimePickerModal
                  isVisible={isManufactureMonthPickerVisible}
                  mode="date"
                  // show a reasonable default
                  date={vaccine.manufactureDate ? new Date(vaccine.manufactureDate + '-01') : new Date()}
                  onConfirm={(dt) => {
                    const y = dt.getFullYear();
                    const m = String(dt.getMonth() + 1).padStart(2, '0');
                    const ym = `${y}-${m}`;
                    setVaccine((s) => ({ ...s, manufactureDate: ym }));
                    setManufactureMonthPickerVisible(false);
                  }}
                  onCancel={() => setManufactureMonthPickerVisible(false)}
                  maximumDate={new Date()}
                />

                <Text style={styles.label}>part (opcional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="***/**"
                  value={vaccine.part}
                  onChangeText={(t) => setVaccine((s) => ({ ...s, part: t }))}
                  editable={!isLoading}
                />

                <Text style={styles.label}>numero de série (opcional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123456789"
                  value={vaccine.serialNumber}
                  onChangeText={(t) => setVaccine((s) => ({ ...s, serialNumber: t }))}
                  editable={!isLoading}
                />

                <Text style={styles.label}>data da aplicação</Text>
                <TouchableOpacity
                  style={[styles.input, { justifyContent: 'center' }]}
                  onPress={() => setVaccineDatePickerVisible(true)}
                  disabled={isLoading}
                >
                  <Text style={{ color: vaccine.applicationDate ? '#333' : '#999' }}>
                    {vaccine.applicationDate
                      ? vaccine.applicationDate
                      : 'Selecionar data'}
                  </Text>
                </TouchableOpacity>

                <Text style={styles.label}>informações adicionais (opcional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Observações sobre a vacina"
                  value={vaccine.additionalInfo}
                  onChangeText={(t) => setVaccine((s) => ({ ...s, additionalInfo: t }))}
                  multiline
                  numberOfLines={3}
                  editable={!isLoading}
                />
              </>
            )}
          </>
        )}

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
  smallOption: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  smallOptionActive: {
    backgroundColor: '#82B1B7',
    borderColor: '#82B1B7',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '50%'
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOptionText: {
    fontSize: 16,
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

export default EventFormScreen;
