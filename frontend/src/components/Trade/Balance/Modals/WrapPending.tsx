import Modal, { ModalStyled } from '../../../Modal'
import { withNamespaces } from '../../../../utils/i18n'
import { colors } from '../../../../styles/colors'
import { ModalProps } from '../types'
import Loader from '../../../Loader'

export default withNamespaces('trade')(
  ({
    t,
    open,
    eth,
    onClose
  }: ModalProps & { eth: string; onRetry: () => void }) => (
    <Modal
      open={open}
      title={t('balance.modalWrapVerifying.title')}
      onClose={onClose}
    >
      <ModalStyled.Text weight="500">
        {t('balance.modalWrapVerifying.text')}
      </ModalStyled.Text>
      <ModalStyled.Text weight="600">
        <span
          style={{
            marginRight: '1rem',
            display: 'inline-block',
            verticalAlign: 'top'
          }}
        >
          <Loader theme="primary" />
        </span>
        {t('balance.modalWrapVerifying.wrap')}{' '}
        <span style={{ color: colors.primary }}>{eth}</span> ETH
      </ModalStyled.Text>
    </Modal>
  )
)
