import Modal, { ModalStyled } from '../../../Modal'
import { withNamespaces } from '../../../../utils/i18n'
import { colors } from '../../../../styles/colors'
import { ModalProps } from '../types'

export default withNamespaces('trade')(
  ({ t, open, eth, onClose }: ModalProps & { eth: string }) => (
    <Modal
      open={open}
      title={
        <>
          <i
            className="material-icons"
            style={{
              fontSize: '2.5rem',
              color: colors.success,
              verticalAlign: 'text-top',
              marginRight: '0.5rem'
            }}
          >
            check
          </i>
          {t('balance.modalWrapSuccess.title')}
        </>
      }
      onClose={onClose}
      closeButton={t('balance.modalWrapSuccess.button')}
    >
      <ModalStyled.Text weight="600">
        {t('balance.modalWrapSuccess.wrapStart')}{' '}
        <span style={{ color: colors.primary }}>{eth}</span>{' '}
        {t('balance.modalWrapSuccess.wrapEnd')}
      </ModalStyled.Text>
      <ModalStyled.Text weight="500">
        {t('balance.modalWrapSuccess.text')}
      </ModalStyled.Text>
    </Modal>
  )
)
