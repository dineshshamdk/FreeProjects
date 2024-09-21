import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback
} from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import {
  collection,
  addDoc,
  orderBy,
  where,
  query,
  onSnapshot
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, database } from '../config/firebase';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import colors from '../colors';


export default function Chat() {

  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const  receiver  = route.params.value;
  const onSignOut = () => {
      signOut(auth).catch(error => console.log('Error logging out: ', error));
    };

  useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            style={{
              marginRight: 10
            }}
            onPress={onSignOut}
          >
            <AntDesign name="logout" size={24} color={colors.gray} style={{marginRight: 10}}/>
          </TouchableOpacity>
        )
      });
    }, [navigation]);


  useLayoutEffect(() => {

      const collectionRef = collection(database, 'ichats');

      const q = query(collectionRef, orderBy('createdAt', 'desc'), where ('user._id', 'in', [auth.currentUser.email,receiver]), where ('name', 'in', [auth.currentUser.email,receiver]));
     
  
      const unsubscribe = onSnapshot(q, querySnapshot => {
      console.log('querySnapshot unsusbscribe');
      
      querySnapshot.docs.forEach(i => {console.log(i.data().user._id);console.log(i.data().text);});
      
        setMessages(
          querySnapshot.docs.map(doc => ({  
            _id: doc.data()._id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user: doc.data().user,
            name: doc.data().name,
            currentUser: doc.data().currentUser,
          }))
        );
      });

     
      return unsubscribe;
    }, []);


    


  const onSend = useCallback((messages = []) => {
   
       setMessages(previousMessages =>
        GiftedChat.append(previousMessages, messages)
      );

      messages[0].name = receiver;
      messages[0].currentUser = ""
      const { _id, createdAt, text, user, name, currentUser } = messages[0];    
      addDoc(collection(database, 'ichats'), {
        _id,
        createdAt,
        text,
        user, 
        name,
        currentUser
        
      });
    }, []);

    return (
      // <>
      //   {messages.map(message => (
      //     <Text key={message._id}>{message.text}</Text>
      //   ))}
      // </>
      <GiftedChat
        messages={messages}
        showAvatarForEveryMessage={true}
        showUserAvatar={true}
        onSend={messages => onSend(messages)}
        messagesContainerStyle={{
          backgroundColor: '#fff'
        }}
        textInputStyle={{
          backgroundColor: '#fff',
          borderRadius: 20,
        }}
        user={{
          _id: auth?.currentUser?.email,
          avatar: 'https://i.pravatar.cc/300'
        }}
      />
    );
}
