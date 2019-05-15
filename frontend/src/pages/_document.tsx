import * as React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import { colors } from '../styles/colors'

export default class Index extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App: React.ClassicComponentClass) => props =>
            sheet.collectStyles(<App {...props} />)
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <html>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <link
            rel="apple-touch-icon"
            sizes="76x76"
            href="/static/favicon/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/static/favicon/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/static/favicon/favicon-16x16.png"
          />
          <link rel="shortcut icon" href="/static/favicon/favicon.ico" />
          <link rel="manifest" href="/static/favicon/site.webmanifest" />
          <link
            rel="mask-icon"
            href="/static/favicon/safari-pinned-tab.svg"
            color="#0F1834"
          />
          <meta name="msapplication-TileColor" content="#0f1834" />
          <meta name="theme-color" content="#0f1834" />
          <link
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Montserrat:400,400i,500,500i,600,600i,700,700i,800,800i"
            rel="stylesheet"
          />
          <link href="/static/styles/reboot.css" rel="stylesheet" />

          <style>{`
            body {
              overflow-x: hidden;
              font-family: Montserrat, sans-serif;
              background: ${colors.bg};
              color: ${colors.white};
            }

            #nprogress {
              position: fixed;
              left: 0;
              top: 0;
              right: 0;
              height: 10px;
              background: transparent;
              opacity: 1;
              z-index: 1000;
            }

            #nprogress .bar {
              width: 100%;
              height: 2px;
              position: fixed;
              border-radius: 50%;
              background: ${colors.primary};
              box-shadow: 0 0 20px ${colors.primary};
            }

            body.modal-open {
              overflow: hidden;
            }

          `}</style>
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
