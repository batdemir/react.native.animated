import React, {Component} from 'react';
import {
    View,
    PanResponder,
    Animated,
    Dimensions
} from 'react-native';

const SCREEN_WITDH= Dimensions.get('window').width
const SCREEN_HEIGHT= Dimensions.get('window').height
const SWIPE_THRESHOLD = 0.60 * SCREEN_WITDH
const SWIPE_OUT_DURATION = 250;

class Deck extends React.Component{
    
    static defaultProps = {
        onSwipeRight: () => {},
        onSwipeLeft: () => {}
    }

    constructor(props){
        super(props);
        const position = new Animated.ValueXY();
        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,//touch everything ==> if true touchable event is on && if false touchable event is off
            onPanResponderMove: (event,gesture) => { //fiziksel olarak hareketi algılıyor && gesture=> bize hareketin bilgisini getiyor.OnTouch
                position.setValue({x:gesture.dx,y:gesture.dy});
            },
            onPanResponderRelease: (event,gesture) => { //Touch işlemi bittiğinde çağırılıyor
                if(gesture.dx > SWIPE_THRESHOLD){
                    this.forceSwipe('right');
                }else if(gesture.dx < -SWIPE_THRESHOLD){
                    this.forceSwipe('left');
                }else {
                    this.resetPosition();
                }
            } 
        });
        this.state = {panResponder,position,index: 0};
    }

    forceSwipe(direction) {
        const x = direction === 'right' ? SCREEN_WITDH : -SCREEN_WITDH;
        Animated.timing(this.state.position,{
        toValue: {x: x, y:0},
            duration: SWIPE_OUT_DURATION
        }).start(() => this.onSwipeComplete(direction));    
    }

    onSwipeComplete(direction) {
        const { onSwipeLeft, onSwipeRight, data } = this.props;
        const item = data[this.state.index];
        direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
        this.state.position.setValue({ x:0, y:0 });
        this.setState({ index: this.state.index+1 });
    }

    onSwipeLeft(item){
        
    }
    onSwipeRight(item){

    }

    resetPosition() {
        Animated.spring(this.state.position, {
            toValue: { x:0,y:0 }
        }).start();
    }

    getCardStyle() {
        const{position} = this.state;
        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WITDH ,0,SCREEN_WITDH], //Aslında animasyon gideceği yol kısa olursa çok döner fazla olursa az döner
            outputRange: ['-90deg','0deg','90deg']
        });

        return {
            ...position.getLayout(),
            transform: [{rotate}]
        };
    }

    renderCards(){
        return this.props.data.map((item,index) => {
            if(index === 0){
                return (
                    <Animated.View
                        key={item.id}
                        style={this.getCardStyle()}
                        {...this.state.panResponder.panHandlers}
                    >
                        {this.props.renderCard(item)}
                    </Animated.View>
                )
            }
            return this.props.renderCard(item);
        });
    }

    render(){
        return (

            <View >
                {this.renderCards()}
            </View>
        );
    }
}

export default Deck;