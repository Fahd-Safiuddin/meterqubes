import Modal, { ModalStyled } from '../../../Modal'
import { withNamespaces } from '../../../../utils/i18n'
import { colors } from '../../../../styles/colors'
import { ModalProps } from '../types'

export default withNamespaces('trade')(
  ({ t, open, eth, onClose }: ModalProps & { eth: string }) => (
    <Modal open={open} title={t('balance.modalWrap.title')} onClose={onClose}>
      <ModalStyled.Text weight="600">
        {t('balance.modalWrap.wrap')}{' '}
        <span style={{ color: colors.primary }}>{eth}</span> ETH
      </ModalStyled.Text>
      {t('balance.modalWrap.text', { returnObjects: true }).map(
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
