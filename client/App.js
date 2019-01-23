import React, {Component} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, Platform, ListView, FlatList, Keyboard, AsyncStorage} from 'react-native';
import Header from './components/header';
import Footer from './components/footer';
import Row from './components/row';
import Auth0 from 'react-native-auth0';
import {DOMAIN, CLIENT_ID} from 'react-native-dotenv';
import API from './utils/API';

// console.log(DOMAIN, CLIENT_ID);

const auth0 = new Auth0({
  domain: DOMAIN,
  clientId: CLIENT_ID
});

// console.log(auth0);

const parseJwt = (token)  => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
};

const filterItems = (filter, items) => {
  return items.filter(item => {
    if (filter === "ALL") return true;
    if (filter === "COMPLETED") return item.complete;
    if (filter === "ACTIVE") return !item.complete
  })
};

class App extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      loading: true,
      allComplete: false,
      filter: "ALL",
      value: "",
      items: [],
      dataSource: ds.cloneWithRows([]),
      accessToken: null,
      idToken: null,
      userName: null,
      userEmail: null
    };

    this.setSource = this.setSource.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleUpdateText = this.handleUpdateText.bind(this);
    this.handleToggleEditing = this.handleToggleEditing.bind(this);
    this.handleClearComplete = this.handleClearComplete.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleToggleComplete = this.handleToggleComplete.bind(this);
    this.handleToggleAllComplete = this.handleToggleAllComplete.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this)
  }

  setSource(items, itemsDatasource, otherState = {}) {
    this.setState({
      items,
      dataSource: this.state.dataSource.cloneWithRows(itemsDatasource),
      ...otherState
    });
    AsyncStorage.setItem('items', JSON.stringify(items))
  }

  // -------------------------------------------------------------------------------------------------------------------
  handleLogin() {

    auth0.webAuth
      .authorize({
        scope: 'openid profile email',
        audience: `https://${DOMAIN}/userinfo`
      })
      .then(credentials => {
        console.log(credentials);

        API.getUser(credentials.accessToken)
          .then(res => {
            console.log(res.data);
            this.setState({
              accessToken: credentials.accessToken,
              idToken: credentials.idToken,
              userName: res.data.name,
              userEmail: res.data.email
            }, () => {
              console.log(this.state.accessToken);
              console.log(this.state.userName);
              console.log(this.state.userEmail)
            })
          })
          .catch(err => console.log(err))


        /*const user = parseJwt(credentials.idToken);
        console.log(user);

        this.setState({
          accessToken: credentials.accessToken,
          idToken: credentials.idToken,
          userName: user.name,
          userEmail: user.email
        }, () => {
          console.log(this.state.accessToken);
          console.log(this.state.userName);
          console.log(this.state.userEmail)
        })*/
      })
      .catch(err => console.log(err))

  }

  handleLogout() {
    if (Platform.OS === 'android') {
      this.setState({
        accessToken: null,
        idToken: null,
        userName: null,
        userEmail: null
      }, () => console.log('Logged Out', this.state.accessToken, this.state.userName))
    } else {
      auth0.webAuth
        .clearSession({})
        .then(success => {
          this.setState({
            accessToken: null,
            idToken: null,
            userName: null,
            userEmail: null
          }, () => console.log('Logged Out', this.state.accessToken, this.state.userName))
        })
        .catch(err => console.log(err))
    }
  }


  // -------------------------------------------------------------------------------------------------------------------
  handleUpdateText(key, text) {
    const newItems = this.state.items.map(item => {
      if (item.key !== key) return item;
      return {
        ...item,
        text
      }
    });
    this.setSource(newItems, filterItems(this.state.filter, newItems))
  }

  handleToggleEditing(key, editing) {
    const newItems = this.state.items.map(item => {
      if (item.key !== key) return item;
      return {
        ...item,
        editing
      }
    });
    this.setSource(newItems, filterItems(this.state.filter, newItems))
  }

  componentWillMount() {
    AsyncStorage.getItem('items').then(json => {
      try {
        const items = JSON.parse(json);
        this.setSource(items, items, {loading: false})
      } catch (e) {
        this.setState({
          loading: false
        })
      }
    })
  }

  handleClearComplete() {
    const newItems = filterItems("ACTIVE", this.state.items);
    this.setSource(newItems, filterItems(this.state.filter, newItems))
  }

  handleFilter(filter) {
    this.setSource(this.state.items, filterItems(filter, this.state.items), {filter})
  }

  handleRemoveItem(key) {
    const newItems = this.state.items.filter(item => {
      return item.key !== key
    });
    this.setSource(newItems, filterItems(this.state.filter, newItems))
  }

  handleToggleComplete(key, complete) {
    const newItems = this.state.items.map(item => {
      if (item.key !== key) return item;
      return {
        ...item,
        complete
      }
    });
    this.setSource(newItems, filterItems(this.state.filter, newItems))
  }

  handleToggleAllComplete() {
    const complete = !this.state.allComplete;
    const newItems = this.state.items.map(item => ({
      ...item,
      complete
    }));

    // console.table(newItems);

    this.setSource(newItems, filterItems(this.state.filter, newItems), {allComplete: complete})
  }

  handleAddItem() {
    if (!this.state.value) return;
    const newItems = [
      ...this.state.items,
      {
        key: Date.now(),
        text: this.state.value,
        complete: false
      }
    ];
    this.setSource(newItems, filterItems(this.state.filter, newItems), {value: ''})
  }

  render() {
    let loggedIn = this.state.accessToken !== null;
    return (
      <View style={styles.container}>
        <Header
          value={this.state.value}
          onAddItem={this.handleAddItem}
          onChange={value => this.setState({value})}
          onToggleAllComplete={this.handleToggleAllComplete}
          onLog={loggedIn ? this.handleLogout : this.handleLogin}
          btnTitle={loggedIn ? 'Logout' : 'Login'}
        />
        <View style={styles.content}>
          <ListView
            style={styles.list}
            enableEmptySections
            dataSource={this.state.dataSource}
            onScroll={() => Keyboard.dismiss()}
            renderRow={({key, ...value}) => {
              return (
                <Row
                  key={key}
                  onUpdate={text => this.handleUpdateText(key, text)}
                  onToggleEdit={editing => this.handleToggleEditing(key, editing)}
                  onComplete={(complete) => this.handleToggleComplete(key, complete)}
                  onRemove={() => this.handleRemoveItem(key)}
                  {...value}
                />
              )
            }}
            renderSeparator={(sectionId, rowId) => {
              return <View key={rowId} style={styles.separator}/>
            }}
          />
        </View>
        <Footer
          count={filterItems("ACTIVE", this.state.items).length}
          onFilter={this.handleFilter}
          filter={this.state.filter}
          onClearComplete={this.handleClearComplete}
        />
        {this.state.loading && <View style={styles.loading}>
          <ActivityIndicator
            animating
            size="large"
          />
        </View>}
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
  list: {
    backgroundColor: "#FFFFFF"
  },
  separator: {
    borderWidth: 1,
    borderColor: '#F5F5F5'
  },
  loading: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, .2)"
  }

});
