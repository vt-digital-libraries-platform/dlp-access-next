// Type declarations for custom web components

declare namespace JSX {
  interface IntrinsicElements {
    'vtlib-footer': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        swoop?: string;
      },
      HTMLElement
    >;
  }
}

export {};
