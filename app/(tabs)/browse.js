import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';

const browse = () => {
  const [search, setSearch] = useState('');
  const [filteredContacts, setFilteredContacts] = useState(contacts);

  const contacts = [
    { id: '1', name: 'John Doe', phone: '123-456-7890' },
    { id: '2', name: 'Jane Smith', phone: '987-654-3210' },
    { id: '3', name: 'Samuel Adams', phone: '456-789-0123' },
    { id: '4', name: 'Alice Brown', phone: '654-321-0987' },
  ];

  const handleSearch = (text) => {
    setSearch(text);
    if (text) {
      const filteredData = contacts.filter(contact =>
        contact.phone.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredContacts(filteredData);
    } else {
      setFilteredContacts(contacts);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Browse</Text>
      <TextInput
        style={styles.searchBox}
        placeholder="Find a caller..."
        value={search}
        onChangeText={(text) => handleSearch(text)}
        keyboardType='phone-pad'
      />

      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.contactItem} disabled={true}>
            <Text style={styles.contactName}>{item.name}</Text>
            <Text style={styles.contactPhone}>{item.phone}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.noResults}>No contacts found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 70
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
    paddingLeft: 15,
    marginBottom: 20,
  },
  contactItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactPhone: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
  noResults: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
  },
});

export default browse;