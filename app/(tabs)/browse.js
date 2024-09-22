import React, { useEffect, useState } from 'react';
import { View,
         Text,
         StyleSheet,
         TextInput,
         FlatList,
         TouchableOpacity,
         Platform,
         PermissionsAndroid,
         ImageBackground,
         Modal,
         ActivityIndicator
        } from 'react-native';

//Import contact list manager package
import Contacts from 'react-native-contacts';

//Import vector icons
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Fontisto from '@expo/vector-icons/Fontisto';

const Browse = () => {
  //useState hooks
  const [search, setSearch] = useState('');
  const [contacts, setContacts] = useState(null);
  const [filteredcontactLists, setFilteredcontactLists] = useState(null);
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  //Fetch contact list at first render
  useEffect(() => {
    //Function to manage access permission to contacts
    const requestPermission = async () => {
      if (Platform.OS === 'android') {
        const value = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
          title: 'Contacts Permission',
          message: 'JustCall would like to access your contacts.',
          buttonPositive: 'Allow',
        });
        
        if (value === 'granted') {
          //Fetch contacts from device
          Contacts.getAll().then(setContacts);
          console.log('Contact list permission allowed.')
        };
      } else {
        Contacts.getAll().then(setContacts);
      };
    };
    requestPermission();
  }, []);

  //Function to handle search bar
  const handleSearch = (text) => {
    //Limit search result maximum length
    if (text.length < 15) {
      setSearch(text);
    };
    
    if (text) {
      //Manage search button
      if (text.length > 9) {
        setDisable(false);
      } else {
        setDisable(true);
      };

      //Filter contact list based on search result
      const filteredData = contacts.filter(contacts =>
        contacts.phoneNumbers.length > 0 && contacts.phoneNumbers[0].number.includes(text)
      );
      setFilteredcontactLists(filteredData);
    } else {
      setFilteredcontactLists(null);
      setDisable(true);
    };
  };

  //Activate search modal
  const handleShowModal = () => {
    setShowModal(true);
  };

  //Hide search modal
  const handleHideModal = () => {
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      {loading && (
        <Modal
          transparent={true}
          animationType='fade'
          visible={loading}
          onRequestClose={() => setLoading(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.loadingWrapper}>
              <ActivityIndicator size='large' color='white'/>
              <Text style={{color: 'white', fontWeight: '400'}}>Loading...</Text>
            </View>
          </View>
        </Modal>
      )}

      {showModal && (
        <Modal
          transparent={true}
          animationType='fade'
          visible={showModal}
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.loadingWrapper}>
              <View style={{justifyContent: 'center'}}>
                <Text style={styles.nameText}>Al-Sultan Abdullah Ri'ayatuddin Al-Mustafa Billah Shah ibni Almarhum Sultan Haji Ahmad Shah</Text>
                <Text style={styles.phoneText}>+6001987817855</Text>
              </View>
              <TouchableOpacity style={{paddingTop: 20}} onPress={handleHideModal}>
                <Fontisto name="close" size={25} color="black"/>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      
      <View style={styles.topContainer}>
        <Text style={styles.title}>Browse</Text>

        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchBox}
            placeholder="Find a caller..."
            value={search}
            onChangeText={(text) => handleSearch(text)}
            keyboardType='phone-pad'
          />
          <TouchableOpacity style={[styles.searchButton, {
              backgroundColor: (disable) ? 'gray' : 'black'
            }]} disabled={disable} onPress={(handleShowModal)}
          >
            <FontAwesome name="chain-broken" size={24} color="white"/>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        {filteredcontactLists ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={filteredcontactLists}
            keyExtractor={(item) => item.rawContactId}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.contactListItem} disabled={true}>
                <Text style={styles.contactListName}>{item.displayName}</Text>
                <Text style={styles.contactListPhone}>{item.phoneNumbers[0].number}</Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={{paddingTop: 25, height: '75%'}}>
            <ImageBackground
              source={require('../../assets/images/browse.png')}
              style={styles.image}
              imageStyle={{borderRadius: 40}}
            />
            <Text style={styles.noResults}>
              Browse from our chain, or from your contact...
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 70
  },
  modalBackground: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  loadingWrapper: {
      backgroundColor: 'white',
      width: 300,
      borderRadius: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: 20,
      paddingTop: 15,
      paddingHorizontal: 20
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 20,
    textAlign: 'center'
  },
  phoneText: {
    fontSize: 20,
    fontWeight: '400',
    textAlign: 'center'
  },
  topContainer: {
    alignContent: 'center',
    marginBottom: 20
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingBottom: 15
  },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  searchBox: {
    height: 50,
    width: '82%',
    borderColor: '#ddd',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 15
  },
  searchButton: {
    width: '15%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  contactListItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
  },
  contactListName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactListPhone: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
  bottomContainer: {
    justifyContent: 'center',
    alignItems: 'stretch',
    marginBottom: 125
  },
  image: {
    width: '100%',
    height: 250,
    alignSelf: 'center'
  },
  noResults: {
    textAlign: 'center',
    fontSize: 15,
    color: 'gray',
    marginTop: 20,
  },
});

export default Browse;