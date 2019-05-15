import { I18nTProps } from '../../../utils/i18n'

export type ModalProps = {
  t: I18nTProps
  open: boolean
  onClose: () => void
}
