import { StyleSheet, Text, View, Linking } from 'react-native';
import React from 'react';
import { EventResponseInterface } from '@/types';
import { format } from 'date-fns';

const EventCard = ({ event }: { event: EventResponseInterface }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{event.name}</Text>
      <Text style={styles.sub}>
        🌠 {event.type}   👁 {event.visibilityScore}   🌕 {event.moonPhase}%
      </Text>

      <Text style={styles.time}>
        📅 {format(new Date(event.startTime), 'dd MMM yyyy, hh:mm a')} -{' '}
        {format(new Date(event.endTime), 'hh:mm a')}
      </Text>

      <Text numberOfLines={3} style={styles.description}>
        {event.description}
      </Text>

      <Text style={styles.meta}>
        🌍 Visible In: {event.visibilityRegions.join(', ')}
      </Text>

      <Text style={styles.meta}>
        ❤️ {event.interestedUserIds?.length || 0} interested
      </Text>

      {event.source && (
        <Text
          style={styles.source}
          onPress={() => Linking.openURL(event.source)}
        >
          🔗 Source
        </Text>
      )}
    </View>
  );
};

export default EventCard;

const styles = StyleSheet.create({
  card: {
    margin: 12,
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sub: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  time: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginTop: 6,
    marginBottom: 6,
  },
  meta: {
    fontSize: 13,
    color: '#444',
    marginTop: 4,
  },
  source: {
    color: '#1e90ff',
    marginTop: 8,
    fontSize: 14,
  },
});
