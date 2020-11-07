import React from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

const TabIcon = ({ title, focused }) => {
  //   const Icon = focused ? SolidIcon : LightIcon;
  let iconName;
  switch (title) {
    case 'Trang chủ':
      iconName = 'home';
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
      color={focused ? 'red' : '#000'}
    />
  );
};

export default TabIcon;
