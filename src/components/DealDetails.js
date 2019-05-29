import React, { Component } from 'react';
import {
  Platform,
  Dimensions,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Animated,
  PanResponder,
  TouchableOpacity
} from 'react-native';
import ajax from '../ajax';

class DealDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deal: this.props.deal,
      imageIndex: 0
    };
  }

  imageXposition = new Animated.Value(0);

  imagePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gs) => {
      this.imageXposition.setValue(gs.dx);
    },
    onPanResponderRelease: (evt, gs) => {
      this.width = Dimensions.get('window').width;
      if (Math.abs(gs.dx) > this.width * 0.4) {
        const direction = Math.sign(gs.dx);
        Animated.timing(this.imageXposition, {
          toValue: direction * this.width,
          duration: 250
        }).start(() => this.handleSwipe(-1 * direction));
      } else {
        Animated.spring(this.imageXposition, {
          toValue: 0
        }).start();
      }
    }
  });

  handleSwipe = indexDirection => {
    if (!this.state.deal.media[this.state.imageIndex + indexDirection]) {
      Animated.spring(this.imageXposition, {
        toValue: 0
      }).start();
      return;
    }
    this.setState(
      prevState => ({
        imageIndex: prevState.imageIndex + indexDirection
      }),
      () => {
        this.imageXposition.setValue(indexDirection * this.width);
        Animated.spring(this.imageXposition, {
          toValue: 0
        }).start();
      }
    );
  };

  async componentDidMount() {
    const fullDeal = await ajax.fetchDealDetail(this.state.deal.key);
    console.log(fullDeal);
    this.setState({
      deal: fullDeal
    });
  }

  render() {
    const deal = this.state.deal;
    return (
      <View style={style.deal}>
        <TouchableOpacity onPress={this.props.onBackPress}>
          <Text>Back</Text>
        </TouchableOpacity>
        <Animated.Image
          {...this.imagePanResponder.panHandlers}
          source={{ uri: deal.media[this.state.imageIndex] }}
          style={[{ left: this.imageXposition }, style.image]}
        />
        <View style={style.info}>
          <Text style={style.tite}>{deal.title}</Text>
          <View style={style.footer}>
            <Text style={style.cause}>{deal.cause.name}</Text>
            <Text style={style.price}>{`$${deal.price / 100}`}</Text>
          </View>
        </View>
        {deal.user && (
          <View>
            <Image source={{ uri: deal.user.avatar }} style={style.avatar} />
            <Text>{deal.user.name}</Text>
          </View>
        )}
        <View>
          <Text>{deal.description}</Text>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  deal: {},
  image: {
    width: '100%',
    height: 150,
    backgroundColor: '#ccc'
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
    padding: 10,
    backgroundColor: 'rgba(237,149,45,0.4)'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 15
  },
  cause: {
    flex: 1
  },
  price: {
    flex: 1,
    textAlign: 'right'
  },
  avatar: {
    width: 60,
    height: 60
  }
});

export default DealDetails;
