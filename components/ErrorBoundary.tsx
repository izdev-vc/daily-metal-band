import { Component, type ErrorInfo, type ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/colors';
import { captureError } from '../services/analytics';

type Props = { children: ReactNode };
type State = { hasError: boolean };

// Bez custom fontFamily — crash może nastąpić zanim fonty się załadują
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    captureError(error, { component_stack: info.componentStack ?? '' });
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <View style={styles.screen}>
        <View style={styles.badge}>
          <Text style={styles.bang}>!</Text>
        </View>
        <Text style={styles.title}>SOMETHING WENT WRONG</Text>
        <Text style={styles.text}>
          The app hit an unexpected error.{'\n'}It has been reported.
        </Text>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => this.setState({ hasError: false })}
          activeOpacity={0.7}
        >
          <Text style={styles.retryBtnText}>TRY AGAIN</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  badge: {
    width: 38,
    height: 38,
    borderWidth: 2,
    borderColor: COLORS.bone,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  bang: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.bone,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 3,
    color: COLORS.bone,
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.dim,
    textAlign: 'center',
    marginBottom: 26,
  },
  retryBtn: {
    borderWidth: 1,
    borderColor: COLORS.amber,
    paddingVertical: 12,
    paddingHorizontal: 22,
  },
  retryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 3,
    color: COLORS.amber,
  },
});
