import Document, { Html, Head, Main, NextScript } from 'next/document';

const RN_WEB_RESET = `
html, body, #__next {
  -webkit-overflow-scrolling: touch;
}
#__next {
  display: flex;
  flex-direction: column;
  height: 100%;
}
html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}
body {
  overflow-y: auto;
  overscroll-behavior-y: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -ms-overflow-style: scrollbar;
}
`;

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" style={{ height: '100%' }}>
        <Head>
          <style id="rn-web-reset" dangerouslySetInnerHTML={{ __html: RN_WEB_RESET }} />
        </Head>
        <body style={{ height: '100%', overflow: 'hidden' }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
