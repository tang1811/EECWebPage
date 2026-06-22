import 'react';

// Allow CSS custom properties (--foo) in inline style objects project-wide.
declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
