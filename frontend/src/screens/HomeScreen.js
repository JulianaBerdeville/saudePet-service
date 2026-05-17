import { useEffect, useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { getPets } from '../api/pets';
import { getEvents } from '../api/events';
import { useAuth } from '../stores/authContext';
const petIcon = require('../../Assets/petIcon.png');

import EventsGrid from '../components/EventsGrid/EventsGrid';

const HomeScreen = ({ navigation, route }) => {
  const marginRightForChevron = 16;
  const marginRightCarrousselItem = 48;

  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvents] = useState([]);
  const [userName, setUserName] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const loadPets = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getPets();
      setPets(data.pets || []);
    } catch (error) {
      Alert.alert('Erro', 'falha ao carregar pets');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const { state, signOut } = useAuth();
  const { user } = state || {};

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert('Erro', 'falha ao sair da conta');
    } finally {
      setIsLoading(false);
    }
  }, [signOut]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadPets(), loadEvents()]);
    setRefreshing(false);
  }, [loadPets, loadEvents]);

  useFocusEffect(
    useCallback(() => {
      loadPets();
      loadEvents();
    }, [loadPets, loadEvents])
  );

  useEffect(() => {
    extractUserName(user);
  }, [user]);

  useEffect(() => {
    if (route?.params?.refresh) {
      loadEvents();
      try {
        navigation.setParams({ refresh: undefined });
      } catch (e) {
        Alert.alert('Ops!', 'ocorreu um erro. Feche e abra o app novamente');

      }
    }
  }, [route?.params?.refresh]);


  const extractUserName = (user) => {
    if (!user || typeof user.name !== 'string') {
      setUserName('');
      return;
    }
    const trimmed = user.name.trim();

    const firstName = (trimmed.split(/\s+/)[0]) || '';

    setUserName(firstName);
  };

  const { width: screenWidth } = Dimensions.get('window');
  const carouselRef = useRef(null);

  const goToNext = (index) => {
    if (!carouselRef.current) return;
    const nextIndex = Math.min(index + 1, (pets || []).length - 1);
    const itemWidth = (screenWidth - marginRightCarrousselItem) + marginRightForChevron;
    try {
      carouselRef.current.scrollToOffset({ offset: nextIndex * itemWidth, animated: true });
    } catch (e) {
      try {
        carouselRef.current.scrollToIndex({ index: nextIndex, animated: true });
      } catch (err) {
      }
    }
  };

  const goToPrev = (index) => {
    if (!carouselRef.current) return;
    const prevIndex = Math.max(index - 1, 0);
    const itemWidth = (screenWidth - marginRightCarrousselItem) + marginRightForChevron;
    try {
      carouselRef.current.scrollToOffset({ offset: prevIndex * itemWidth, animated: true });
    } catch (e) {
      try {
        carouselRef.current.scrollToIndex({ index: prevIndex, animated: true });
      } catch (err) {
        Alert.alert('Erro', 'erro ao exibir pets');

      }
    }
  };

  const renderPetItem = ({ item, index }) => (
    <View style={[styles.carouselItemWrapper, { width: screenWidth - marginRightCarrousselItem }]}>
      <TouchableOpacity
        style={styles.carouselItem}
        onPress={() => navigation.navigate('PetDetails', { petId: item._id })}
        activeOpacity={0.8}
      >
        <Image source={petIcon} style={styles.carouselImage} />
        <Text style={styles.carouselName} numberOfLines={1}>{item.name}</Text>
        {item.notes ? <Text style={styles.carouselNotes} numberOfLines={2}>{item.notes}</Text> : null}
      </TouchableOpacity>
      {index > 0 ? (
        <TouchableOpacity style={styles.moreIndicatorLeft} onPress={() => goToPrev(index)}>
          <Text style={styles.moreIndicatorText}>‹</Text>
        </TouchableOpacity>
      ) : null}
      {pets.length > 1 && index < pets.length - 1 ? (
        <TouchableOpacity style={styles.moreIndicator} onPress={() => goToNext(index)}>
          <Text style={styles.moreIndicatorText}>›</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  const loadEvents = useCallback(async () => {
    try {
      setIsLoadingEvents(true);
      const data = await getEvents();
      setEvents(data.events || []);
    } catch (error) {
      Alert.alert('Erro', 'falha ao carregar eventos');
    } finally {
      setIsLoadingEvents(false);
    }
  }, []);


  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#82B1B7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.menuIcon} onPress={openMenu}>
          <Text style={styles.menuIconText}>☰</Text>
        </TouchableOpacity>
        {
          userName ?
            <Text style={styles.title}> bem vinda(o),<Text style={styles.name}> {`${userName}` || ''} </Text></Text>
            :
            <Text style={styles.title}> bem vinda(o)!</Text>
        }
      </View>

      {/* Full-screen modal menu */}
      <Modal visible={menuVisible} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Menu</Text>

          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              closeMenu();
              navigation.navigate('PetForm');
            }}
          >
            <Text style={styles.modalButtonText}> adicionar pet </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              closeMenu();
              navigation.navigate('Profile');
            }}
          >
            <Text style={styles.modalButtonText}> perfil </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalButton}
            onPress={closeMenu}
          >
            <Text style={styles.modalButtonText}> fechar menu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              closeMenu();
              handleLogout();
            }}
          >
            <Text style={styles.logOutButtonText}> sair da conta </Text>
          </TouchableOpacity>

        </View>
      </Modal>

      {pets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}> nenhum pet por aqui! </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('PetForm')}
          >
            <Text style={styles.emptyButtonText}> adicionar pet</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.carouselContainer}>
          <FlatList
            ref={carouselRef}
            data={pets}
            keyExtractor={(item) => item._id}
            renderItem={renderPetItem}
            horizontal
            pagingEnabled={false}
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            decelerationRate="fast"
            onRefresh={onRefresh}
            refreshing={refreshing}
            contentContainerStyle={styles.carouselListContent}
            getItemLayout={(_, index) => ({ length: screenWidth - 48 + 16, offset: index * (screenWidth - 48 + 16), index })}
            initialNumToRender={3}
          />
        </View>
      )}

      <EventsGrid
        navigation={navigation}
        pets={pets}
        events={events}
        isLoadingEvents={isLoadingEvents}
      />
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 16,
    color: '#333',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  profileButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  profileButtonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  petCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  petBreed: {
    fontSize: 12,
    color: '#666',
  },
  petNotes: {
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
    fontSize: 18,
    fontWeight: 'bold',
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
  carouselContainer: {
    paddingVertical: 20,
  },
  carouselListContent: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  carouselItemWrapper: {
    marginRight: 16,
    alignItems: 'center',
  },
  carouselItem: {
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  carouselImage: {
    marginBottom: 12,
  },
  carouselName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  carouselBreed: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  carouselNotes: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  eventsSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  navButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  navButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  logoutButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#82B1B7"
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#82B1B7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIconText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 24,
  },
  modalButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#82B1B7',
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  logOutButtonText: {
    color: '#82B1B7',
    fontWeight: '700',
    fontSize: 16,
  },
  moreIndicator: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -12 }],
    backgroundColor: 'rgba(0,0,0,0.35)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreIndicatorLeft: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: [{ translateY: -12 }],
    backgroundColor: 'rgba(0,0,0,0.35)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreIndicatorText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  eventsListContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    flex: 1,
    aspectRatio: 1,
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
  eventType: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  eventDate: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginTop: 6,
  },
  deleteBtnCard: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
