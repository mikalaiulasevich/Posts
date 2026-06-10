import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../../navigation/types';
import { createLogger } from '../../shared/lib/logger';
import { ErrorState } from '../../shared/ui/ErrorState';
import { LoadingState } from '../../shared/ui/LoadingState';
import {
  createAndroidRipple,
  createCardShadow,
  minimumHitSlop,
  radius,
  spacing,
  typography,
} from '../../shared/ui/theme/tokens';
import { useAppTheme } from '../../shared/ui/theme/useAppTheme';
import {
  selectIsFavorite,
  selectIsPostDetailsLoading,
  selectPostDetails,
  selectPostDetailsError,
} from '../../store/selectors';
import { usePostsStore } from '../../store/postsStore';

type DetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'Details'>;

const logger = createLogger('DetailsScreen');
const MIN_DETAILS_IMAGE_SIZE = 160;

export function DetailsScreen({
  route,
}: DetailsScreenProps): React.JSX.Element {
  const theme = useAppTheme();
  const { width } = useWindowDimensions();
  const { postId } = route.params;
  const details = usePostsStore(selectPostDetails(postId));
  const isLoading = usePostsStore(selectIsPostDetailsLoading(postId));
  const error = usePostsStore(selectPostDetailsError(postId));
  const isFavorite = usePostsStore(selectIsFavorite(postId));
  const loadPostDetails = usePostsStore(state => state.loadPostDetails);
  const toggleFavorite = usePostsStore(state => state.toggleFavorite);
  const [hasRequestedDetails, setHasRequestedDetails] = useState(false);

  const requestDetails = useCallback(() => {
    setHasRequestedDetails(true);
    logger.info('requestDetails', { id: postId });
    void loadPostDetails(postId);
  }, [loadPostDetails, postId]);

  useEffect(() => {
    requestDetails();
  }, [requestDetails]);

  const handleToggleFavorite = useCallback(() => {
    logger.info('toggleFavorite:press', { id: postId });
    toggleFavorite(postId);
  }, [postId, toggleFavorite]);
  const imageSize = Math.min(
    300,
    Math.max(MIN_DETAILS_IMAGE_SIZE, width - spacing.lg * 2),
  );

  if ((isLoading || !hasRequestedDetails) && details == null) {
    return <LoadingState label="Loading post details..." />;
  }

  if (error != null && details == null) {
    return <ErrorState message={error} onRetry={requestDetails} />;
  }

  if (details == null) {
    return (
      <ErrorState
        message="Post details are not available."
        onRetry={requestDetails}
      />
    );
  }

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Image
          accessibilityIgnoresInvertColors
          accessibilityLabel={`Image for post ${details.id}`}
          onError={() => logger.error('image:error', { id: details.id })}
          onLoad={() => logger.info('image:loaded', { id: details.id })}
          resizeMode="cover"
          source={{ uri: details.imageUrl }}
          style={[
            styles.image,
            {
              backgroundColor: theme.colors.surfaceAlt,
              height: imageSize,
              width: imageSize,
            },
          ]}
        />
        <View
          style={[
            styles.card,
            createCardShadow(theme),
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.metaRow}>
            <Text
              style={[styles.metaText, { color: theme.colors.textTertiary }]}
            >
              Post #{details.id}
            </Text>
            <Text
              style={[styles.metaText, { color: theme.colors.textTertiary }]}
            >
              User {details.userId}
            </Text>
          </View>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            {details.title}
          </Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary }]}>
            {details.body}
          </Text>
          <Pressable
            accessibilityLabel={
              isFavorite
                ? `Remove post ${details.id} from favorites`
                : `Add post ${details.id} to favorites`
            }
            accessibilityRole="button"
            accessibilityState={{ selected: isFavorite }}
            android_ripple={createAndroidRipple(theme)}
            hitSlop={minimumHitSlop}
            onPress={handleToggleFavorite}
            style={({ pressed }) => [
              styles.favoriteButton,
              {
                backgroundColor: isFavorite
                  ? theme.colors.favoriteBackground
                  : theme.colors.accent,
                borderColor: isFavorite
                  ? theme.colors.favoriteBorder
                  : theme.colors.accent,
              },
              pressed && styles.pressed,
            ]}
          >
            <Text
              accessibilityElementsHidden
              importantForAccessibility="no"
              style={[
                styles.favoriteButtonIcon,
                {
                  color: isFavorite ? theme.colors.favorite : '#FFFFFF',
                },
              ]}
            >
              {isFavorite ? '★' : '☆'}
            </Text>
            <Text
              style={[
                styles.favoriteButtonText,
                {
                  color: isFavorite ? theme.colors.favorite : '#FFFFFF',
                },
              ]}
            >
              {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    ...typography.body,
    marginTop: spacing.lg,
  },
  card: {
    borderRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: spacing.lg,
    padding: spacing.xl,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  favoriteButton: {
    alignItems: 'center',
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.xxl,
    minHeight: 52,
    overflow: 'hidden',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  favoriteButtonIcon: {
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 22,
  },
  favoriteButtonText: {
    ...typography.bodyStrong,
  },
  image: {
    alignSelf: 'center',
    borderRadius: radius.xl,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  metaText: {
    ...typography.caption,
    textTransform: 'uppercase',
  },
  pressed: {
    opacity: 0.78,
  },
  title: {
    ...typography.title,
    textTransform: 'capitalize',
  },
});
