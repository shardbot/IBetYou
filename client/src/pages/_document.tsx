import NextDocument, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

class Document extends NextDocument {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
          <div id="modal" />
        </body>
      </Html>
    );
  }
}

export default Document;
