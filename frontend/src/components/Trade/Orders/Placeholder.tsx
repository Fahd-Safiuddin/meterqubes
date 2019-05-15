import * as Styled from './style'
import { withNamespaces } from '../../../utils/i18n'
import Link from '../../Link'

export default withNamespaces('trade')(({ t }) => {
  return (
    <Styled.Placeholder>
      <Styled.Image src="/static/img/card_placeholder.svg" />
      <Styled.Text>
        {t('orders.placeholder.textStart')}
        <Link href="/connect">{t('orders.placeholder.link')}</Link>{' '}
        {t('orders.placeholder.textEnd')}
      </Styled.Text>
    </Styled.Placeholder>
  )
})
