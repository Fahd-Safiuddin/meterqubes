import Modal from '../../../Modal'
import { withNamespaces } from '../../../../utils/i18n'
import Button from '../../../Button'
import Flex from '../../../Flex'
import { ModalProps } from '../types'
import Text from '../../../Text'

export default withNamespaces('trade')(
  ({
    t,
    open,
    title,
    text,
    onClose
  }: ModalProps & { weth: string; text: string; title: string }) => (
    <Modal
      open={open}
      title={title || t('balance.modalError.title')}
      onClose={onClose}
      size="sm"
    >
      {text && <Text>{text}</Text>}
      <br />
      <br />
      <Flex justify="center">
        <Button
          text={t('balance.modalError.button')}
          onClick={onClose}
          theme="primary"
        />
      </Flex>
    </Modal>
  )
)
