import React from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import gui from '../../lib/gui';

const TabIcon = ({ title, focused }) => {
  //   const Icon = focused ? SolidIcon : LightIcon;
  let iconName;
  switch (title) {
    case 'Scan':
      iconName = 'qrcode';
      break;
    case 'Explore':
      iconName = 'paper-plane';
      break;
    case 'Cá nhân':
      iconName = 'user';
      break;
    case 'Chú thích':
      iconName = 'book';
      break;
  }

  return (
    <FontAwesome
      name={iconName}
      size={25}
      color={focused ? gui.mainColor : '#4b515d'}
    />
  );
};

export default TabIcon;
