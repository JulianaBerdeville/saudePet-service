import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { styles } from './Styles';


const EventsGrid = ({ navigation, pets, events, isLoadingEvents = false, onDeleteEvent }) => {
  const navHook = useNavigation();
  const nav = navigation || navHook;

  const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

  const listData = [{ __create: true }, ...(events || [])];

  return (
    <View style={styles.eventsSection}>
      {isLoadingEvents ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      ) : events.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}> sem eventos por aqui </Text>
        </View>
      ) : (
        <FlatList
          data={listData}
          keyExtractor={(item) => (item.__create ? 'create' : item._id)}
          renderItem={({ item }) => (
            item.__create ? (
              <TouchableOpacity
                style={styles.eventCard}
                onPress={() => {
                  // Prefer to open the form for the first pet if available
                  if (!pets || pets.length === 0) {
                    Alert.alert('Atenção', 'Nenhum pet cadastrado. Adicione um pet primeiro.');
                    return;
                  }
                  nav.navigate('EventForm', { petId: pets[0]._id });
                }}
                activeOpacity={0.85}
              >
                <View style={[styles.eventCardContent, { justifyContent: 'center', flex: 1, width: '100%' }]}>
                  <Text style={[styles.eventPetName, { textAlign: 'center' }]}> criar entrada</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.eventCard}
                onPress={() => nav.navigate('EventForm', { event: item })}
                activeOpacity={0.85}
              >
                <View style={styles.eventCardContent}>
                  <Text style={styles.eventPetName}>{item.pet?.name || ''}</Text>
                  <Text style={styles.eventType}>{item.type}:</Text>
                  <Text style={styles.eventDate}>{formatDate(item.date)}</Text>
                </View>
              </TouchableOpacity>
            )
          )}
          contentContainerStyle={styles.eventsListContent}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
      )}
    </View>
  )
}

export default EventsGrid;