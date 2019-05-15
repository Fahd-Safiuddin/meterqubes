import Modal, { ModalStyled } from '../../../Modal'
import { withNamespaces } from '../../../../utils/i18n'
import { colors } from '../../../../styles/colors'
import { ModalProps } from '../types'

export default withNamespaces('trade')(
  ({ t, open, weth, onClose }: ModalProps & { weth: string }) => (
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
          {t('balance.modalUnwrapSuccess.title')}
        </>
      }
      onClose={onClose}
      closeButton={t('balance.modalUnwrapSuccess.button')}
    >
      <ModalStyled.Text weight="600">
        {t('balance.modalUnwrapSuccess.wrapStart')}{' '}
        <span style={{ color: colors.primary }}>{weth}</span>{' '}
        {t('balance.modalUnwrapSuccess.wrapEnd')}
      </ModalStyled.Text>
      <ModalStyled.Text weight="500">
        {t('balance.modalUnwrapSuccess.text')}
      </ModalStyled.Text>
    </Modal>
  )
)
