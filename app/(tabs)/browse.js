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
         ActivityIndicator,
         Linking
        } from 'react-native';

//Import contact list manager package
import Contacts from 'react-native-contacts';

//Import vector icons
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Fontisto from '@expo/vector-icons/Fontisto';

//Import APIs and router
import { ethers, BrowserProvider } from 'ethers';
import '@walletconnect/react-native-compat';
import { useAppKitProvider } from '@reown/appkit-ethers-react-native';
import { Ionicons } from '@expo/vector-icons';

//Setup contract ABI and address
const contract = require("../../artifacts/contracts/JustCall.sol/JustCall.json");
const abi = contract.abi;
const contractAddress = process.env.EXPO_PUBLIC_CONTRACT_ADDR;

const Browse = () => {
  //Get wallet connection status and provider
  const { walletProvider } = useAppKitProvider();

  //useState hooks
  const [search, setSearch] = useState('');
  const [num, setNum] = useState('');
  const [name, setName] = useState('');
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
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CALL_PHONE,
            {
              title: 'Phone Call Permission',
              message: 'JustCall needs access to make phone calls.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'Allow',
            },
          );

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Phone call permission allowed.');
          } else {
            console.log('Phone call permission denied.');
          };

          const value = await PermissionsAndroid
          .request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
            title: 'Contacts Permission',
            message: 'JustCall would like to access your contacts.',
            buttonPositive: 'Allow',
          });
          
          if (value === 'granted') {
            //Fetch contacts from device
            fetchAndCleanContacts();
            console.log('Contact list permission allowed.');
          };
        } catch (error) {
          console.log(error);
        };
      };
    };
    requestPermission();
  }, []);

  //Function to clean phone number format
  const cleanPhoneNumber = (phoneNumber) => {
    // Step 1: Remove any non-numeric characters (except for '+')
    let cleanedNumber = phoneNumber.replace(/[^0-9+]/g, '');
  
    // Step 2: Ensure the number starts with +601 (for Malaysian numbers)
    if (cleanedNumber.startsWith('0')) {
      // Replace '0' at the beginning with '0'
      cleanedNumber = cleanedNumber.replace(/^0/, '+60');
    } else if (cleanedNumber.startsWith('60')) {
      // Replace '60' at the beginning with '+60'
      cleanedNumber = cleanedNumber.replace(/^60/, '+60');
    };
  
    return cleanedNumber;
  };

  const fetchAndCleanContacts = async () => {
    try {
      const contacts = await Contacts.getAll();
  
      // Process and clean phone numbers
      const cleanedContacts = contacts.map((contact) => {
        if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
          contact.phoneNumbers = contact.phoneNumbers.map((phoneNumber) => ({
            ...phoneNumber,
            number: cleanPhoneNumber(phoneNumber.number),
          }));
        };
        return contact;
      });
  
      // Set the cleaned contacts into state (or process further)
      setContacts(cleanedContacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    };
  };

  //Function to handle search bar
  const handleSearch = (text) => {
    //Limit search result maximum length
    if (text.length < 14) {
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
      ).sort((a, b) => a.displayName.localeCompare(b.displayName));
      setFilteredcontactLists(filteredData);
    } else {
      setFilteredcontactLists(null);
      setDisable(true);
    };
  };

  //Activate search modal
  const handleShowModal = async () => {
    setLoading(true);

    try {
      // Clean the phone number before calling the contract
      const cleanedPhoneNumber = await cleanPhoneNumber(search);

      // Update state with the cleaned phone number (optional)
      setSearch(cleanedPhoneNumber);

      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const justCall = new ethers.Contract(contractAddress, abi, signer);

      const profile = await justCall.getUserByPhoneNumber(cleanedPhoneNumber);
      console.log("User: ", profile);
      setName(profile[0]);
      setNum(profile[1]);
      setShowModal(true);
    } catch (error) {
        if (error.message.includes('Invalid phone number length.')) {
            console.log('Invalid phone number length.');
            alert('Invalid phone number length.');
        } else if (error.message.includes('Phone number is not registered')) {
            console.log('Phone number is not registered.');
            alert('Phone number is not registered.');
        } else {
            console.log('Error:', error);
        };
    };

    setLoading(false);
  };

  //Hide search modal
  const handleHideModal = () => {
    setShowModal(false);
    setName('');
    setNum('');
  };

  const handleCall = (num) => {
    if (Platform.OS === 'android') {
      Linking.openURL(`tel:${num}`);
    };
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
            <View style={styles.modalWrapper}>
              <View style={{justifyContent: 'center'}}>
                <Text style={styles.verifyText}>Verified</Text>
                <Text style={styles.nameText}>{name}</Text>
                <Text style={styles.phoneText}>{num}</Text>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={handleHideModal}>
                  <Fontisto name="close" size={33} color="black"/>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.callButton, {borderWidth: 2.8}]}
                  onPress={() => handleCall(num)}
                >
                  <Ionicons name="call" size={22} color="black"/>
                </TouchableOpacity>
              </View>
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
              <View style={styles.contactListItem} disabled={true}>
                <View>
                  <Text style={styles.contactListName}>{item.displayName}</Text>
                  <Text style={styles.contactListPhone}>
                    {item.phoneNumbers[0].number}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.callButton, 
                    {height: 40, width: 40, borderWidth: 2}
                  ]} 
                  onPress={() => handleCall(item.phoneNumbers[0].number)}
                >
                  <Ionicons name="call" size={25} color="black"/>
                </TouchableOpacity>
              </View>
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
    backgroundColor: 'black',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalWrapper: {
    backgroundColor: 'white',
    width: 300,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 15,
    paddingTop: 15,
    paddingHorizontal: 20
  },
  modalButtons: {
    paddingTop: 20,
    flexDirection: 'row',
    alignContent: 'space-between',
    alignSelf: 'center'
  },
  verifyText: {
    alignSelf: 'center',
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 16,
    paddingHorizontal: 15,
    paddingVertical: 3,
    backgroundColor: 'darkcyan',
    color: 'white',
    borderRadius: 20,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  phoneText: {
    fontSize: 20,
    fontWeight: '400',
    textAlign: 'center'
  },
  callButton: {
    padding: 3,
    marginLeft: 50,
    backgroundColor: 'transparent',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center'
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
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