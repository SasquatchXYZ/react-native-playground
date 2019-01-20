import React, {Component} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import Header from './components/header';
import Footer from './components/footer';

class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Header/>
        <View style={styles.content}>

        </View>
        <Footer/>
      </View>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    ...Platform.select({
      ios: {paddingTop: 30}
    })
  },
  content: {
    flex: 1,
  },

});
