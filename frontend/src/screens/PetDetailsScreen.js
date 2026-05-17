import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { getEvents, deleteEvent } from '../api/events';

const PetDetailsScreen = ({ route, navigation }) => {
  const { petId } = route.params;
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getEvents({ petId });
      setEvents(data.events || []);
    } catch (error) {
      Alert.alert('Erro', 'falha ao carregar eventos');
    } finally {
      setIsLoading(false);
    }
  }, [petId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  }, [loadEvents]);

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [loadEvents])
  );

  const handleDeleteEvent = useCallback((eventId) => {
    Alert.alert(
      'confirmar',
      'deseja mesmo apagar o evento?',
      [
        { text: 'cancelar', onPress: () => {} },
        {
          text: 'apagar',
          onPress: async () => {
            try {
              await deleteEvent(eventId);
              loadEvents();
              Alert.alert('sucesso', 'evento apagado');
            } catch (error) {
              Alert.alert('erro', 'falha ao apagar o evento');
            }
          },
          style: 'destructive',
        },
      ]
    );
  }, [loadEvents]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const renderEventItem = ({ item }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => navigation.navigate('EventForm', { event: item, petId })}
      activeOpacity={0.85}
    >
      <View style={styles.eventCardContent}>
        <Text style={styles.eventPetName}>{item.pet?.name || ''}</Text>
        <Text style={styles.eventType}>{item.type}:</Text>
        <Text style={styles.eventDate}>{formatDate(item.date)}</Text>
      </View>

      <TouchableOpacity
        style={styles.deleteBtnCard}
        onPress={() => handleDeleteEvent(item._id)}
      >
        <Text style={styles.deleteBtnText}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#82B1B7',
" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>eventos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('EventForm', { petId })}
        >
          <Text style={styles.addButtonText}> novo</Text>
        </TouchableOpacity>
      </View>

      {events.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}> sem eventos por aqui </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('EventForm', { petId })}
          >
            <Text style={styles.emptyButtonText}> adicionar evento</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item._id}
          renderItem={renderEventItem}
          onRefresh={onRefresh}
          refreshing={refreshing}
          contentContainerStyle={styles.listContent}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#82B1B7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    flex: 1,
    aspectRatio: 1, // square
    marginHorizontal: 8,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  eventCardContent: {
    padding: 12,
    alignItems: 'flex-start',
  },
  eventPetName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  eventInfo: {
    flex: 1,
  },
  eventType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  eventDate: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  eventNotes: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 2,
  },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  deleteBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteBtnCard: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 14,
    backgroundColor: '#b4b4b4ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: '#82B1B7',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default PetDetailsScreen;
