import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity
} from 'react-native';

class DealItem extends Component {
  handlePress = () => {
    this.props.onPress(this.props.item.key);
  };

  render() {
    const deal = this.props.item;
    return (
      <TouchableOpacity onPress={this.handlePress}>
        <View style={style.deal}>
          <Image source={{ uri: deal.media[0] }} style={style.image} />
          <View style={style.info}>
            <Text style={style.tite}>{deal.title}</Text>
            <View style={style.footer}>
              <Text style={style.cause}>{deal.cause.name}</Text>
              <Text style={style.price}>{`$${deal.price / 100}`}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const style = StyleSheet.create({
  deal: {
    marginHorizontal: 12,
    marginTop: 12
  },
  image: {
    width: '100%',
    height: 150
  },
  info: {
    padding: 10,
    backgroundColor: '#fff',
    borderColor: '#bbb',
    borderWidth: 1,
    borderTopWidth: 0
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  },
  footer: {
    flexDirection: 'row'
  },
  cause: {
    flex: 1
  },
  price: {
    flex: 1,
    textAlign: 'right'
  }
});

export default DealItem;
