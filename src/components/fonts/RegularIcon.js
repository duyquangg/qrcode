'use strict';
import React from 'react';
import {
  View,
  StyleSheet
} from 'react-native';
import {
  createIconSet
} from 'react-native-vector-icons';

import glyphMap from './FontAwesome5.json';
// import Colors from '../../constants/Colors';

/**
 * func createIconSet:
 * 2nd argument: fontFamily - must match PostScript name for iOS
 * 3rd argument: fontFile - change to match fontFamily before linking
 */
const Icon = createIconSet(
  glyphMap,
  'FontAwesome5Pro-Regular',
  'FontAwesome5Pro-Regular.otf',
);

class FontAwesomeRegular extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      iconProps,
      style,
      color,
      name,
      size
    } = this.props;
    return (<View style={
      [styles.container, {
        width: size + 4 || 20
      }, style]
    }>
      <Icon
        color={color || (style && style.color ? style.color : 'black')}
        size={size || (style && style.fontSize ? style.fontSize : 16)}
        name={name}
        {...iconProps}
      />
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

FontAwesomeRegular.Icon = Icon;

export default FontAwesomeRegular;
