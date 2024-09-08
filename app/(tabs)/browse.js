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

const browse = () => {
  const [search, setSearch] = useState('');
  const [contacts, setContacts] = useState(null);
  const [filteredcontactLists, setFilteredcontactLists] = useState(null);

  const contactLists = [
    { id: '1', name: 'John Doe', phone: '123-456-7890' },
    { id: '2', name: 'Jane Smith', phone: '987-654-3210' },
    { id: '3', name: 'Samuel Adams', phone: '456-789-0123' },
    { id: '4', name: 'Alice Brown', phone: '654-321-0987' },
  ];

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
    setSearch(text);
    if (text) {
      const filteredData = contacts.filter(contacts =>
        contacts.phoneNumbers[0].number.includes(text)
      );
      setFilteredcontactLists(filteredData);
    } else {
      setFilteredcontactLists(null);
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.title}>Browse</Text>
        <TextInput
          style={styles.searchBox}
          placeholder="Find a caller..."
          value={search}
          onChangeText={(text) => handleSearch(text)}
          keyboardType='phone-pad'
        />
      </View>

      <View style={styles.bottomContainer}>
        {filteredcontactLists ? (
          <FlatList
            data={filteredcontactLists}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.contactListItem} disabled={true}>
                <Text style={styles.contactListName}>{item.givenName}</Text>
                <Text style={styles.contactListPhone}>{item.phoneNumbers[0].number}</Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <>
            <ImageBackground
              source={require('../../assets/images/browse.png')}
              style={styles.image}
              imageStyle={{borderRadius: 40}}
            />
            <Text style={styles.noResults}>
              Browse from our chain, or from your contact...
            </Text>
          </>
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
  searchBox: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 15
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
    alignItems: 'stretch'
  },
  image: {
    width: '100%',
    height: 250,
    alignSelf: 'center',
  },
  noResults: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
  },
});

export default browse;