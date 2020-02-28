import React from 'react';
import {StyleSheet, View} from 'react-native';
import Animated from 'react-native-reanimated';
import {PanGestureHandler, State} from 'react-native-gesture-handler';

const {
    set,
    cond,
    startClock,
    stopClock,
    clockRunning,
    block,
    timing,
    debug,
    Value,
    Clock,
    divide,
    concat,
    event,
    diff,
    eq,
    lessThan,
    and,
    multiply,
    add
} = Animated;

const interact = (translation, gestureState) => {
    const dragging = new Value(0);
    const position = new Value(0);
    const start = new Value(0);
    const velocity = new Value(0);

    const clock = new Clock();
    const dt = divide(diff(clock), 1000);

    return cond(
        eq(gestureState, State.ACTIVE),
        [
            cond(eq(dragging, 0), [set(dragging, 1), set(start, position)]),
            stopClock(clock),
            dt,
            set(position, add(start, translation))
        ],
        [
            set(dragging, 0),
            startClock(clock),
            set(velocity, cond(lessThan(position, 0), 150, -150)),
            cond(and(
                lessThan(position, 1),
                lessThan(-1, position)
                ),
                [stopClock(clock), set(velocity, 0), set(position, 0)]
            ),
            set(position, add(position, multiply(velocity, dt)))
        ]
    );
};

const rotation = (translation, rotation, gestureState) => {
    const position = new Value(0);
    return cond(
        eq(gestureState, State.ACTIVE), [
            set(rotation, divide(translation, 500)),
            cond(lessThan(position, 250), [
                debug('ROTATION', rotation)
            ])
        ]
    )
};

export default class App extends React.Component {
    constructor(props) {
        super(props);

        const dragX = new Value(0);
        const rotationZ = new Value(0);
        const gestureState = new Value(-1);

        console.log(1);
        this._onGestureEvent = event([
            {
                nativeEvent: {
                    translationX: dragX,
                    rotateZ: rotationZ,
                    state: gestureState,
                },
            },
        ]);
        this._transX = interact(dragX, gestureState);
        // this._transX = new Value(0);
        this._rotationZ = rotation(dragX, rotationZ, gestureState);
    }

    render() {
        return (
            <View styles={styles.container}>
                <PanGestureHandler
                    onGestureEvent={this._onGestureEvent}
                    onHandlerStateChange={this._onGestureEvent}
                    // onGestureEvent={
                    //     event([
                    //         {
                    //             nativeEvent: ({translationX: x, state, rotateZ: z}) =>
                    //                 block([
                    //                     set(this._transX, x),
                    //                     set(this._rotationZ, divide(x, 150)),
                    //                     cond(lessThan(this._transX, 250), [
                    //                         debug('-45', this._transX)
                    //                     ], [
                    //                         console.log('45')
                    //                     ])
                    //                 ])
                    //         }
                    //     ])
                    // }
                >
                    <Animated.View
                        style={[
                            styles.box,
                            {
                                transform: [
                                    {translateX: this._transX},
                                    {rotateZ: this._rotationZ}
                                ],
                            },
                        ]}
                    />
                </PanGestureHandler>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    box: {
        justifyContent: 'center',
        width: 275,
        height: 300,
        backgroundColor: 'red',
        alignContent: 'center',
        alignItems: 'center',
        marginTop: 150,
        marginLeft: 40,
    }
});
