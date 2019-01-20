import React, {Component} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';

class Header extends Component {
  render() {
    return (
      <View style={styles.header}>
        <TextInput
          placeholder="What needs to be done?"
          blurOnSubmit={false}
          returnKeyType="done"
          style={styles.input}
        />
      </View>
    )
  }
}

export default Header;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  input: {
    flex: 1,
    height: 50
  }
});