import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

//import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query
} from 'firebase/firestore';
import { db } from './firebaseConfig';

export default function App() {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
 /* const [messages, setMessages] = useState([
    { id: '1', text: 'Hey there!', sender: 'other', timestamp: new Date() },
    { id: '2', text: 'Hi! How are you?', sender: 'me', timestamp: new Date() },
  ]); */
  //const [inputText, setInputText] = useState('');

  useEffect(() => {
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  const sendMessage = async () => {
    const cuteInput = input + ' 💕';
    if (setInput.trim() === '') return;

    try {
      await addDoc(collection(db, 'messages'), {
        text: setInput,
        sender: 'me',
        timestamp: new Date()
      });
      setInput('');
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  }

    
  /*  const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'me',
      timestamp: new Date()
    };
    
    setMessages([...messages, newMessage]);
    setInputText('');
  }; */

  // Format the timestamp for display
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }


  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'me' ? styles.myMessage : styles.otherMessage
    ]}>
      <Text style={[
        styles.messageText,
        item.sender === 'me' ? styles.myMessageText : styles.otherMessageText
      ]}>
        {item.text}
      </Text>
        <Text style = {[styles.timestampText, item.sender === 'me' ? styles.myTimestampText : styles.otherTimestampText]}>
          {formatTime(item.timestamp)}
        </Text>
    </View>
  );

  if(loading) {
    return (
      <View style = {styles.loadingContainer}>
        <Text style = {styles.loadingText}>Loading...</Text>
      </View> 
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      extraScrollHeight={20}
      //behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style = {styles.headerImageContainer}>
          <Image
            source = {require('/Users/stiffanyvillanueva/MessagingApp/assets/images/MiffyPurple.png')}
            style = {[styles.headerImage, {width: 100, height: 100, marginRight:10}, {alignItems: 'center'}]}
            
            />
          <View>
        <Text style={styles.headerTitle}>Miffy Messages</Text>
        <Text style = {styles.headerSubtitle}>{messages.length} messages</Text>
        </View> 
      </View>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messagesList}
        showsVerticalScrollIndicator={false}
        scrollEnabled = {true}
      />

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={input}
          onChangeText={setInput}
         // color='black'
          placeholder="Type a message...<3"
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={sendMessage}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#db8acecc',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 12,
    borderRadius: 15,
    maxWidth: '80%',
  },
  myMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  otherMessage: {
    backgroundColor: '#db8acecc',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
  },
  myMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 16,
    color: 'black',
  },
  sendButton: {
    backgroundColor: '#f1add7cc',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  headerSubtitle: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    fontSize: 18,
    color: '#555',
  },

  timestampText: {
    fontSize: 10,
    marginTop: 5,
  },

  myTimestampText: {
    color: '#d1e3ff',
    alignSelf: 'flex-end',
  }, 

  otherTimestampText: {
    color: '#555',
    alignSelf: 'flex-start',
  },


});