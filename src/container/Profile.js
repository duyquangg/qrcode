import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import {Actions} from 'react-native-router-flux';


import Icon from 'react-native-vector-icons/FontAwesome';
const myIcon = <Icon name="rocket" size={30} color="#900" />;

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        {myIcon}
        <TouchableOpacity onPress={() => Actions.Login()}>
          <Text>LOG OUT</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  
});

export default App;
