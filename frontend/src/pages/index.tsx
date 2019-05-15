import { ReactElement } from 'react'
import Router from 'next/router'
import Page from '../components/Page'
import Section from '../components/Section'
import Heading from '../components/Heading'
import Columns from '../components/Columns'
import Media from '../components/Media'
import { IMacWrapper, Roadmap } from '../components/Section/style'
import Grid from '../components/Grid'
import { withNamespaces } from '../utils/i18n'
import TokensHeader from '../components/TokensHeader'
import { ROUTES } from '../config/routes'
import { API_URL } from '../config/api'
import { apiCaller } from '../utils/apiCaller'

type CardItemProps = {
  title: string
  text: string | ReactElement
  image: string
}

const Landing = ({ t, lng, markets }) => {
  const cardImages = [
    '/static/img/exchange_icon/wallet.svg',
    '/static/img/exchange_icon/pin-code.svg',
    '/static/img/exchange_icon/presentation.svg',
    '/static/img/exchange_icon/presentation.svg',
    '/static/img/exchange_icon/shield.svg',
    '/static/img/exchange_icon/profits.svg'
  ]

  const cardItems: CardItemProps[] = t('instant.grid', {
    returnObjects: true
  }).map((elem: CardItemProps, i: number) => ({
    ...elem,
    image: cardImages[i]
  }))

  return (
    <>
      <TokensHeader data={markets} />
      <Page layout="mainPage" rtl={lng === 'ar'} withFooter>
        {/* Top Section */}
        <Section
          withHeader
          theme="dark"
          layout="mainPageSectionTop"
          rtl={lng === 'ar'}
        >
          <Heading.One align="center">{t('banner.title')}</Heading.One>
          <Heading.Two align="center" weight="light">
            {t('banner.text')}
          </Heading.Two>
          <Columns justify="space-between">
            <Media
              rtl={lng === 'ar'}
              title={t('banner.trading.title')}
              text={t('banner.trading.text')}
              image="/static/img/diagonal-arrow.svg"
              button={{
                text: t('banner.trading.button'),
                size: 'lg',
                theme: 'primary',
                onClick: () => Router.push(ROUTES.trade)
              }}
            />
            <Media
              rtl={lng === 'ar'}
              title={t('banner.exchange.title')}
              text={t('banner.exchange.text')}
              image="/static/img/exchange.svg"
              button={{
                text: t('banner.exchange.button'),
                size: 'lg',
                theme: 'primary',
                onClick: () => Router.push(ROUTES.exchange)
              }}
            />
          </Columns>
        </Section>

        {/* Get Started Section */}
        <Section theme="light" layout="getStarted" rtl={lng === 'ar'}>
          <Columns justify="space-between">
            <IMacWrapper rtl={lng === 'ar'}>
              <img src="/static/img/imac.png" alt="" />
            </IMacWrapper>
            <Media
              rtl={lng === 'ar'}
              title={t('getStarted.title')}
              text={t('getStarted.text')}
              button={{
                text: t('getStarted.button'),
                size: 'lg',
                theme: 'primary',
                onClick: () => Router.push(ROUTES.trade)
              }}
            />
          </Columns>
        </Section>

        {/* Another Block Heading Section */}
        <Section theme="light" layout="anotherBlock" rtl={lng === 'ar'}>
          <Columns justify="space-between" align="center" mobileReverse>
            <div>
              <Media
                rtl={lng === 'ar'}
                title={t('anotherBlock.media.title')}
                text={t('anotherBlock.media.text')}
              />

              <Media
                rtl={lng === 'ar'}
                image="/static/img/wallet.svg"
                text={t('anotherBlock.articleTop')}
                align="center"
                size="sm"
                style={{
                  maxWidth: '400px'
                }}
              />

              <Media
                rtl={lng === 'ar'}
                image="/static/img/database.svg"
                text={t('anotherBlock.articleTop')}
                align="center"
                size="sm"
                style={{
                  maxWidth: '400px'
                }}
              />
            </div>
            <img src="/static/img/circles.svg" alt="" />
          </Columns>
        </Section>

        {/* Exchange Section */}
        <Section theme="light" layout="exchange" rtl={lng === 'ar'}>
          <Heading.One>{t('instant.title')}</Heading.One>
          <Grid layout="exchange">
            {cardItems.map(({ title, text, image }: CardItemProps, i) => (
              <Media
                rtl={lng === 'ar'}
                image={image}
                title={title}
                text={text}
                vertical
                key={i}
              />
            ))}
          </Grid>
        </Section>
        <Roadmap />
      </Page>
    </>
  )
}

Landing.getInitialProps = async () => {
  try {
    const markets = await apiCaller(`${API_URL}/dashboard/landing`)
    if (markets) {
      return {
        markets,
        namespacesRequired: ['landing', 'banner']
      }
    }
  } catch (err) {
    console.error(err)
  }

  return {
    namespacesRequired: ['landing', 'banner']
  }
}

export default withNamespaces('landing')(Landing)
