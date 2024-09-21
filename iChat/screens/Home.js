import React, { useEffect, useState} from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet,FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import colors from '../colors';
import { Entypo } from '@expo/vector-icons';
import { auth, database } from "../config/firebase";
import {
    collection,
    addDoc,
    orderBy,
    where,
    query,
    onSnapshot
  } from 'firebase/firestore';

const catImageUrl = "https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=49ed3252c0b2ffb49cf8b508892e452d";


const Home = () => {
    const [chats, setChats] = useState(new Set());
    const addItem = (newItem) => {
        //setChats(prevItems => [...prevItems, newItem]);
        
        setChats(prevSet => new Set([...prevSet, newItem]));
    };
    console.log(auth.currentUser.email);
    const navigation = useNavigation();
    const collectionRef = collection(database, 'ichats');
    const q = query(collectionRef, orderBy('name', 'desc'), where ('user._id', 'in', [auth.currentUser.email]));
    const q1 = query(collectionRef, orderBy('name', 'desc'), where ('name', 'in', [auth.currentUser.email]));

    useEffect(() => {

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            if (!querySnapshot.empty) {
                querySnapshot.docs.map( doc => {
                    if (!doc.data().name == ""){
                    addItem(doc.data().name);
                    console.log("==========");
                    console.log(doc.data().name);
                    console.log("======++++====");
                }
                })
              const distinctValue = querySnapshot.docs[0].data().name;
              console.log('Distinct value:', distinctValue);
              console.log('Distincts value:', chats);
            } else {
              console.log('No distinct values found');
            }
          });

          const unsubscribe1 = onSnapshot(q1, (querySnapshot) => {
            if (!querySnapshot.empty) {
                querySnapshot.docs.map( doc => {
                    if (!doc.data().user._id == ""){
                    addItem(doc.data().user._id);
                    console.log("==========");
                    console.log(doc.data().user._id);
                    console.log("======++++====");
                }
                })
              const distinctValue = querySnapshot.docs[0].data().name;
              console.log('Distinct value:', distinctValue);
              console.log('Distincts value:', chats);
            } else {
              console.log('No distinct values found');
            }
          });
    }, [navigation]);
    const handleSearchIconPress = () => {
        navigation.navigate('Search'); // Replace 'Search' with your actual screen name
      };
    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity onPress={handleSearchIconPress}>
                <FontAwesome name="search" size={24} color={colors.gray} style={{marginLeft: 15}} />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <Image
                    source={{ uri: catImageUrl }}
                    style={{
                        width: 40,
                        height: 40,
                        marginRight: 15,
                    }}
                />
            ),
        });
    }, [navigation]);



  return (<View style={styles.chatList}>
    <FlatList
      data={[...chats]} // Ensure chats array has multiple strings
      renderItem={({ item, index }) => (
        <TouchableOpacity
          key={index} // Use index as a unique identifier
          onPress={() => {
            navigation.navigate("Chat", { value: item }); // Pass chat string to Chat screen
            console.log([...chats]);
          }}
          style={styles.chatButton}
        >
          <Text style={styles.chatName}>{item}</Text>
        </TouchableOpacity>
      )}
      keyExtractor={(item, index) => index.toString()} // Extract unique key based on index
      ItemSeparatorComponent={() => <View style={{ borderBottomWidth: 1, borderColor: 'gray' }} />}
    />
  </View>
  
)

    };

    export default Home;

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            backgroundColor: "#gfg",
        },
        chatButton: {
            backgroundColor: colors.lightGray,
            height: 100,
            width: 430,
            borderRadius: 0,
            borderWidth: 1, // Set the border width to 1 (or any desired value)
            borderColor: 'gray', // Set the border color
            alignItems: 'left',
            justifyContent: 'center',
            paddingLeft: 10, // Left padding
            paddingRight: 10, // Right padding
            shadowColor: colors.primary,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: .9,
            shadowRadius: 8,
            marginRight: 20,
            marginBottom:   
     2,
        },
        chatList: {
            flex: 5,
            padding: 10,
        },
        chatItem: {
            flexDirection: 'row',
            marginBottom: 10,
        },
        chatAvatar: {
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 10,
        },
        chatName: {
            fontSize: 35,
            fontWeight: 'bold',
        },
        chatLastMessage: {
            fontSize: 14,
            color: 'gray',
        },
    });