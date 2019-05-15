import { memo } from 'react'
import * as Styled from './style'

type CheckboxProps = {
  label?: string
  checked: boolean
  error?: string
  onChange?: () => void
}

const Checkbox = memo(
  ({ label, checked = false, error, onChange }: CheckboxProps) => {
    return (
      <Styled.Checkbox checked={checked}>
        <Styled.Label>{label}</Styled.Label>
        <Styled.Input onChange={onChange} defaultChecked={checked} />
        <i className="material-icons">
          {checked ? 'check_box' : 'indeterminate_check_box'}
        </i>
        {error && <Styled.Error>{error}</Styled.Error>}
      </Styled.Checkbox>
    )
  }
)

export default Checkbox
