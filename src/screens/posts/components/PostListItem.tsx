import React, { memo, useCallback } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { PostListItem as PostListItemModel } from '../../../entities/post/types';
import { createLogger } from '../../../shared/lib/logger';
import {
  createAndroidRipple,
  createCardShadow,
  minimumHitSlop,
  radius,
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
    <Pressable
      accessibilityLabel={`${isFavorite ? 'Favorite post' : 'Post'} ${post.id}. ${post.title}`}
      accessibilityRole="button"
      accessibilityState={{ selected: isFavorite }}
      android_ripple={createAndroidRipple(theme)}
      hitSlop={minimumHitSlop}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        createCardShadow(theme),
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
        isFavorite && {
          backgroundColor: theme.colors.favoriteBackground,
          borderColor: theme.colors.favoriteBorder,
        },
        pressed && styles.pressed,
      ]}
    >
      <Image
        accessibilityIgnoresInvertColors
        accessibilityLabel={`Thumbnail for post ${post.id}`}
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
          <Text
            numberOfLines={2}
            style={[styles.title, { color: theme.colors.textPrimary }]}
          >
            {post.title}
          </Text>
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
              <Text
                style={[styles.favoriteIcon, { color: theme.colors.favorite }]}
              >
                ★
              </Text>
              <Text
                style={[styles.favoriteText, { color: theme.colors.favorite }]}
              >
                Favorite
              </Text>
            </View>
          ) : null}
        </View>
        <Text
          numberOfLines={2}
          style={[styles.body, { color: theme.colors.textSecondary }]}
        >
          {post.body}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  body: {
    ...typography.caption,
    fontWeight: '500',
    marginTop: spacing.xs,
  },
  container: {
    alignItems: 'center',
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 72,
    padding: spacing.md,
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
  favoriteIcon: {
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 14,
  },
  favoriteText: {
    ...typography.caption,
    fontSize: 12,
    lineHeight: 14,
  },
  pressed: {
    opacity: 0.78,
  },
  thumbnail: {
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    height: 32,
    width: 32,
  },
  title: {
    ...typography.bodyStrong,
    flex: 1,
    textTransform: 'capitalize',
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export const PostListItem = memo(PostListItemComponent);
