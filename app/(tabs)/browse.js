import React, { useEffect, useState } from 'react';
import { View,
         Text,
         StyleSheet,
         TextInput,
         FlatList,
         TouchableOpacity,
         Platform,
         PermissionsAndroid,
         ImageBackground
        } from 'react-native';
import Contacts from 'react-native-contacts';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const browse = () => {
  const [search, setSearch] = useState('');
  const [contacts, setContacts] = useState(null);
  const [filteredcontactLists, setFilteredcontactLists] = useState(null);
  const [disable, setDisable] = useState(true);

  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'android') {
        const value = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
          title: 'Contacts',
          message: 'JustCall would like to access your contacts.',
          buttonPositive: 'Allow',
        });
        
        if (value === 'granted') {
            Contacts.getAll().then(setContacts);
        };
      } else {
        Contacts.getAll().then(setContacts);
      };
    };
    requestPermission();
  }, []);

  const handleSearch = (text) => {
    if (text.length < 15) {
      setSearch(text);
    };
    
    if (text) {
      if (text.length > 9) {
        setDisable(false);
      } else {
        setDisable(true);
      };

      const filteredData = contacts.filter(contacts =>
        contacts.phoneNumbers.length > 0 && contacts.phoneNumbers[0].number.includes(text)
      );
      setFilteredcontactLists(filteredData);
    } else {
      setFilteredcontactLists(null);
      setDisable(true);
    };
  };

  return (
    <View style={styles.container}>
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
            }]} disabled={disable}
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

export default browse;