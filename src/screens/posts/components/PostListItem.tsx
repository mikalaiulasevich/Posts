import React, { memo, useCallback } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import type { PostListItem as PostListItemModel } from '../../../entities/post/types';
import { createLogger } from '../../../shared/lib/logger';
import { UiCard, UiPressable, UiText } from '../../../shared/ui/primitives';
import {
  radius,
  size,
  spacing,
  typography,
} from '../../../shared/ui/theme/tokens';
import { useAppTheme } from '../../../shared/ui/theme/useAppTheme';

const logger = createLogger('PostListItem');

type PostListItemProps = {
  post: PostListItemModel;
  isFavorite: boolean;
  onPress: (postId: number) => void;
};

function PostListItemComponent({
  post,
  isFavorite,
  onPress,
}: PostListItemProps): React.JSX.Element {
  const theme = useAppTheme();

  const handlePress = useCallback(() => {
    onPress(post.id);
  }, [onPress, post.id]);

  return (
    <UiCard
      background={isFavorite ? 'favoriteBackground' : 'surface'}
      border={isFavorite ? 'favoriteBorder' : 'border'}
      padding={false}
      shadow
      style={styles.card}
    >
      <UiPressable
        accessibilityLabel={`${isFavorite ? 'Favorite post' : 'Post'} ${post.id}. ${post.title}`}
        accessibilityState={{ selected: isFavorite }}
        onPress={handlePress}
        style={styles.pressable}
      >
        <Image
          accessibilityElementsHidden
          accessibilityIgnoresInvertColors
          importantForAccessibility="no"
          onError={() => logger.error('thumbnail:error', { id: post.id })}
          onLoad={() => logger.info('thumbnail:loaded', { id: post.id })}
          resizeMode="cover"
          source={{ uri: post.thumbnailUrl }}
          style={[
            styles.thumbnail,
            {
              backgroundColor: theme.colors.surfaceAlt,
              borderColor: isFavorite
                ? theme.colors.favoriteBorder
                : theme.colors.border,
            },
          ]}
        />
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <UiText
              numberOfLines={2}
              style={styles.title}
              transform="capitalize"
              variant="bodyStrong"
            >
              {post.title}
            </UiText>
            {isFavorite ? (
              <View
                accessibilityElementsHidden
                importantForAccessibility="no"
                style={[
                  styles.favoriteBadge,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.favoriteBorder,
                  },
                ]}
              >
                <UiText color="favorite" variant="badge">
                  ★
                </UiText>
                <UiText color="favorite" variant="badge">
                  Favorite
                </UiText>
              </View>
            ) : null}
          </View>
          <UiText
            color="textSecondary"
            numberOfLines={2}
            style={styles.body}
            variant="caption"
          >
            {post.body}
          </UiText>
        </View>
      </UiPressable>
    </UiCard>
  );
}

const styles = StyleSheet.create({
  body: {
    fontWeight: typography.caption.fontWeight,
    marginTop: spacing.xs,
  },
  card: {
    borderRadius: radius.lg,
  },
  content: {
    flex: 1,
  },
  favoriteBadge: {
    alignItems: 'center',
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: spacing.xs,
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  pressable: {
    alignItems: 'center',
    borderRadius: radius.lg,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: size.listItemMinHeight,
    overflow: 'hidden',
    padding: spacing.md,
  },
  thumbnail: {
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    height: size.thumbnail,
    width: size.thumbnail,
  },
  title: {
    flex: 1,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export const PostListItem = memo(PostListItemComponent);
