import { LayoutAnimation } from 'react-native';

export function configureFavoriteLayoutAnimation(): void {
  LayoutAnimation.configureNext({
    create: {
      property: LayoutAnimation.Properties.opacity,
      type: LayoutAnimation.Types.easeInEaseOut,
    },
    delete: {
      property: LayoutAnimation.Properties.opacity,
      type: LayoutAnimation.Types.easeInEaseOut,
    },
    duration: 220,
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
    },
  });
}
