import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Animated,
  Easing
} from 'react-native';
import ajax from './src/ajax';
import DealList from './src/components/DealList';
import DealDetails from './src/components/DealDetails';
import SearchBar from './src/components/SearchBar';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deals: [],
      dealsFormSearch: [],
      currentDealId: null
    };
  }

  titleXYpos = new Animated.ValueXY();

  animateTitle = (direction = 1) => {
    Animated.spring(this.titleXYpos, {
      toValue: { x: 0, y: direction * 100 },
      duration: 1000,
      easing: Easing.linear
    }).start(({ finished }) => {
      if (finished) {
        this.animateTitle(-1 * direction);
      }
    });
  };

  async componentDidMount() {
    this.animateTitle();
    const deals = await ajax.fetchInitialDeals();
    console.log(deals);
    this.setState({
      deals: deals
    });
  }

  setCurrentDeal = dealId => {
    console.log('Hello');
    this.setState({
      currentDealId: dealId
    });
  };

  searchDeals = async searchTerm => {
    let dealsFormSearch = [];
    if (searchTerm) {
      dealsFormSearch = await ajax.fetchDealSearchResults(searchTerm);
    }
    this.setState({ dealsFormSearch: dealsFormSearch });
  };

  unSetCurrentDeal = () => {
    console.log('Hello');
    this.setState({
      currentDealId: null
    });
  };

  currentDeal = () => {
    return this.state.deals.find(deal => deal.key === this.state.currentDealId);
  };

  render() {
    if (this.state.currentDealId) {
      return (
        <View style={styles.main}>
          <DealDetails
            deal={this.currentDeal()}
            onBackPress={this.unSetCurrentDeal}
          />
        </View>
      );
    }

    const dealsToDisplay =
      this.state.dealsFormSearch.length > 0
        ? this.state.dealsFormSearch
        : this.state.deals;

    if (dealsToDisplay.length > 0) {
      return (
        <View style={styles.main}>
          <SearchBar searchDeals={this.searchDeals} />
          <DealList deals={dealsToDisplay} onItemPress={this.setCurrentDeal} />
        </View>
      );
    }
    return (
      <Animated.View style={[this.titleXYpos.getLayout(), styles.container]}>
        <Text style={styles.header}>Bakesale</Text>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    marginTop: 30
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    fontSize: 40
  }
});
