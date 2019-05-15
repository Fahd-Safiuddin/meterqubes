import Modal from '../../../Modal'
import { withNamespaces } from '../../../../utils/i18n'
import { ModalProps } from '../types'

export default withNamespaces('trade')(
  ({ t, open, onClose }: ModalProps & { weth: string; error: string }) => (
    <Modal
      open={open}
      title={t('balance.modalTransactionCanceled.title')}
      onClose={onClose}
      closeButton={t('balance.modalTransactionCanceled.button')}
    >
      {}
    </Modal>
  )
)
