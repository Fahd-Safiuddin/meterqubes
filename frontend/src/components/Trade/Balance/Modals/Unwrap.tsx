import Modal, { ModalStyled } from '../../../Modal'
import { withNamespaces } from '../../../../utils/i18n'
import { colors } from '../../../../styles/colors'
import { ModalProps } from '../types'

export default withNamespaces('trade')(
  ({ t, open, weth, onClose }: ModalProps & { weth: string }) => (
    <Modal open={open} title={t('balance.modalUnwrap.title')} onClose={onClose}>
      <ModalStyled.Text weight="600">
        {t('balance.modalUnwrap.wrap')}{' '}
        <span style={{ color: colors.primary }}>{weth}</span> WETH
      </ModalStyled.Text>
      {t('balance.modalUnwrap.text', { returnObjects: true }).map(
        (text: string, i: number) => (
          <ModalStyled.Text key={i} weight="500">
            {text}
          </ModalStyled.Text>
        )
      )}
      <ModalStyled.Info>{t('balance.modalUnwrap.button')}</ModalStyled.Info>
    </Modal>
  )
)
