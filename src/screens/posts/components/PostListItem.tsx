import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { PostListItem as PostListItemModel } from '../../../entities/post/types';
import { createLogger } from '../../../shared/lib/logger';

const logger = createLogger('PostListItem');

type PostListItemProps = {
  post: PostListItemModel;
  isFavorite: boolean;
  onPress: () => void;
};

export function PostListItem({
  post,
  isFavorite,
  onPress,
}: PostListItemProps): React.JSX.Element {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        isFavorite && styles.favoriteContainer,
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
        style={styles.thumbnail}
      />
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text numberOfLines={2} style={styles.title}>
            {post.title}
          </Text>
          {isFavorite ? <Text style={styles.favoriteBadge}>★</Text> : null}
        </View>
        <Text numberOfLines={2} style={styles.body}>
          {post.body}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  body: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 12,
  },
  content: {
    flex: 1,
  },
  favoriteBadge: {
    color: '#F59E0B',
    fontSize: 18,
    fontWeight: '900',
    marginLeft: 8,
  },
  favoriteContainer: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
  },
  pressed: {
    opacity: 0.72,
  },
  thumbnail: {
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    height: 32,
    width: 32,
  },
  title: {
    color: '#111827',
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 21,
    textTransform: 'capitalize',
  },
  titleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
});
