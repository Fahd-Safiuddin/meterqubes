import { withNamespaces } from '../../utils/i18n'
import Modal from '../Modal'
import Text from '../Text'
import { colors } from '../../styles/colors'
import Flex from '../Flex'
import Button from '../Button'

export default withNamespaces('exchange')(
  ({ t, open, onClose, onConfirm, value, from, to }) => {
    return (
      <Modal open={open} title={t('modalConfirm.title')} onClose={onClose}>
        <Text weight="medium">
          {t('modalConfirm.textStart')}{' '}
          <span style={{ color: colors.primary, fontWeight: 600 }}>
            {value}
          </span>{' '}
          {t('modalConfirm.textEnd', { from, to })}
        </Text>
        <Flex>
          <Button
            text={t('modalConfirm.buttonConfirm')}
            onClick={onConfirm}
            theme="primary"
          />
          <Button
            text={t('modalConfirm.buttonCancel')}
            onClick={onClose}
            theme="primary"
            transparent
          />
        </Flex>
      </Modal>
    )
  }
)
