import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { RootStackParamList } from '../../navigation/types';
import { ErrorState } from '../../shared/ui/ErrorState';
import { LoadingState } from '../../shared/ui/LoadingState';
import {
  selectIsFavorite,
  selectIsPostDetailsLoading,
  selectPostDetails,
  selectPostDetailsError,
} from '../../store/selectors';
import { usePostsStore } from '../../store/postsStore';

type DetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'Details'>;

export function DetailsScreen({
  route,
}: DetailsScreenProps): React.JSX.Element {
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
    void loadPostDetails(postId);
  }, [loadPostDetails, postId]);

  useEffect(() => {
    requestDetails();
  }, [requestDetails]);

  const handleToggleFavorite = useCallback(() => {
    toggleFavorite(postId);
  }, [postId, toggleFavorite]);

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
    <ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <Image source={{ uri: details.imageUrl }} style={styles.image} />
      <View style={styles.card}>
        <Text style={styles.title}>{details.title}</Text>
        <Text style={styles.body}>{details.body}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={handleToggleFavorite}
          style={({ pressed }) => [
            styles.favoriteButton,
            isFavorite && styles.favoriteButtonActive,
            pressed && styles.pressed,
          ]}
        >
          <Text
            style={[
              styles.favoriteButtonText,
              isFavorite && styles.favoriteButtonTextActive,
            ]}
          >
            {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: {
    color: '#475569',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginTop: 16,
    padding: 18,
  },
  container: {
    backgroundColor: '#F8FAFC',
    flex: 1,
  },
  content: {
    padding: 16,
  },
  favoriteButton: {
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 14,
    marginTop: 24,
    paddingVertical: 14,
  },
  favoriteButtonActive: {
    backgroundColor: '#FEF3C7',
  },
  favoriteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  favoriteButtonTextActive: {
    color: '#92400E',
  },
  image: {
    alignSelf: 'center',
    backgroundColor: '#E2E8F0',
    borderRadius: 24,
    height: 300,
    width: 300,
  },
  pressed: {
    opacity: 0.72,
  },
  title: {
    color: '#111827',
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
    textTransform: 'capitalize',
  },
});
