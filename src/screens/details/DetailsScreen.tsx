import React, { useCallback, useEffect, useState } from 'react';
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../navigation/types';
import { createLogger } from '../../shared/lib/logger';
import {
  FadeInView,
  configureFavoriteLayoutAnimation,
  usePulseOnChange,
} from '../../shared/ui/animations';
import { ErrorState } from '../../shared/ui/ErrorState';
import { LoadingState } from '../../shared/ui/LoadingState';
import { UiButton, UiCard, UiScreen, UiText } from '../../shared/ui/primitives';
import { radius, size, spacing } from '../../shared/ui/theme/tokens';
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
  const favoritePulseStyle = usePulseOnChange(isFavorite);

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
    configureFavoriteLayoutAnimation();
    toggleFavorite(postId);
  }, [postId, toggleFavorite]);
  const imageSize = Math.min(
    size.detailsImageMax,
    Math.max(size.detailsImageMin, width - spacing.lg * 2),
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
    <UiScreen>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <FadeInView>
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
        </FadeInView>
        <UiCard shadow style={styles.card}>
          <FadeInView delay={80}>
            <View style={styles.metaRow}>
              <UiText
                color="textTertiary"
                transform="uppercase"
                variant="caption"
              >
                Post #{details.id}
              </UiText>
              <UiText
                color="textTertiary"
                transform="uppercase"
                variant="caption"
              >
                User {details.userId}
              </UiText>
            </View>
            <UiText transform="capitalize" variant="title">
              {details.title}
            </UiText>
          </FadeInView>
          <FadeInView delay={140}>
            <UiText color="textSecondary" style={styles.body} variant="body">
              {details.body}
            </UiText>
          </FadeInView>
          <FadeInView delay={200} style={styles.favoriteButton}>
            <Animated.View style={favoritePulseStyle}>
              <UiButton
                accessibilityLabel={
                  isFavorite
                    ? `Remove post ${details.id} from favorites`
                    : `Add post ${details.id} to favorites`
                }
                accessibilityState={{ checked: isFavorite }}
                icon={isFavorite ? '★' : '☆'}
                label={
                  isFavorite ? 'Remove from favorites' : 'Add to favorites'
                }
                onPress={handleToggleFavorite}
                variant={isFavorite ? 'favorite' : 'primary'}
              />
            </Animated.View>
          </FadeInView>
        </UiCard>
      </ScrollView>
    </UiScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    marginTop: spacing.lg,
  },
  card: {
    marginTop: spacing.lg,
  },
  content: {
    padding: spacing.lg,
  },
  favoriteButton: {
    marginTop: spacing.xxl,
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
});
