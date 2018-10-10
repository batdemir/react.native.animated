
import React, { Component } from 'react';
import { View, Text, Animated } from 'react-native';

class Ball extends Component{

    componentWillMount() {
        this.positions = new Animated.ValueXY(0,0);
        Animated.spring(this.positions,{toValue: { x:200, y:500}}).start();
    }

    render() {
        return (
            <Animated.View style={this.positions.getLayout()}>
                <View style={styles.ball}/>
            </Animated.View>    
        );
    }
}

const styles = {
    ball: {
        height: 60,
        width: 60,
        borderRadius: 30,
        borderWidth: 30,
        borderColor: 'black',
    }
};

export default Ball;