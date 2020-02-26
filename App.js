import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import Animated, {and, diff, divide, lessThan, startClock, stopClock} from 'react-native-reanimated';
import {PanGestureHandler, State} from 'react-native-gesture-handler';

const {width} = Dimensions.get('window');

const {cond, eq, add, call, set, Value, event} = Animated;

const interact = (translation, gestureState) => {
    const dragging = new Value(0);
    const position = new Value(0);
    const start = new Value(0);
    const velocity = new Value(0);

    const clock = new Clock();
    const dt = divide(diff(clock), 1000);

    result = cond(
        eq(gestureState, gestureState.ACTIVE),
        [
            cond(eq(dragging, 0), [set(dragging, 1), set(dragging, 0)]),
            stopClock(clock),
            dt,
            set(position, add(start, translation)),
            console.log(position)
        ],
        [
            set(dragging, 0),
            startClock(clock),
            set(velocity, cond(lessThan(position, 0), 100, -100)),
            cond(and(
                lessThan(position, 1),
                lessThan(-1, position)
                ),
                [stopClock(clock), set(velocity, 0), set(position, 0)
                ]
            )
        ]
    );
    return result;
};

export default class App extends React.Component {
    constructor(props) {
        super(props);
        const dragX = new Value(0);
        const gestureState = new Value(-1);
        this._onGestureEvent = event([
            {
                nativeEvent: {
                    translationX: dragX,
                    state: gestureState,
                },
            },
        ]);

        this._transX = interact(dragX, gestureState);
    }

    render() {
        return (
            <PanGestureHandler
                onGestureEvent={this._onGestureEvent}
                onHandlerStateChange={this._onGestureEvent}>
                <Animated.View
                    style={[
                        styles.box,
                        {
                            transform: [
                                {translateX: this._transX},
                                {rotateX: '45deg'}
                            ],
                        },
                    ]}
                />
            </PanGestureHandler>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
