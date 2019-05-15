import Modal, { ModalStyled } from '../../../Modal'
import { withNamespaces } from '../../../../utils/i18n'
import { colors } from '../../../../styles/colors'
import { ModalProps } from '../types'
import Loader from '../../../Loader'

export default withNamespaces('trade')(
  ({
    t,
    open,
    weth,
    onClose
  }: ModalProps & { weth: string; onRetry: () => void }) => (
    <Modal
      open={open}
      title={t('balance.modalUnwrapVerifying.title')}
      onClose={onClose}
    >
      <ModalStyled.Text weight="500">
        {t('balance.modalUnwrapVerifying.text')}
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
        {t('balance.modalUnwrapVerifying.wrap')}{' '}
        <span style={{ color: colors.primary }}>{weth}</span> WETH
      </ModalStyled.Text>
    </Modal>
  )
)
