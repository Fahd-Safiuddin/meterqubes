import { withNamespaces } from '../../utils/i18n'
import Modal from '../Modal'
import Text from '../Text'
import { colors } from '../../styles/colors'
import Button from '../Button'

export default withNamespaces('exchange')(
  ({ t, open, onClose, value, from, to }) => {
    return (
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
            {t('modalSuccess.title')}
          </>
        }
        onClose={onClose}
      >
        {t('modalSuccess.text', { returnObjects: true, value, from, to }).map(
          (text: string, i: number) => (
            <Text key={i} weight="medium">
              {text}
            </Text>
          )
        )}
        <Button
          text={t('modalSuccess.button')}
          onClick={onClose}
          theme="primary"
        />
      </Modal>
    )
  }
)
