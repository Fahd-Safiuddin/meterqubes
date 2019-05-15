import { memo } from 'react'
import * as Styled from './style'
import { InputProps } from './types'

function Input({
  label,
  error,
  icon,
  addon,
  type,
  name,
  rtl,
  ...rest
}: InputProps) {
  const addonType = typeof addon === 'string' ? 'text' : 'button'

  const onChange = ({ target: { value, name } }) => {
    rest.onChange && rest.onChange(value, name)
  }

  const onKeyPress = (event: { which: number; preventDefault: () => void }) => {
    if (type === 'number') {
      if (
        (event.which != 8 && event.which != 0 && event.which < 46) ||
        event.which > 57
      ) {
        event.preventDefault()
      }
    }
  }
  const maxLengthNumber =
    rest.value && rest.value.toString().split('.').length - 1 + 18

  return (
    <Styled.Wrapper fluid={rest.fluid}>
      {label && typeof label === 'string' ? (
        <Styled.Label>{label}</Styled.Label>
      ) : (
        label
      )}
      <Styled.AddonGroup>
        {typeof icon === 'string' ? (
          <i className="material-icons">{icon}</i>
        ) : (
          icon
        )}

        {type === 'file' ? (
          <>
            <Styled.Input
              {...rest}
              type="file"
              name={name}
              onChange={onChange}
              onKeyPress={onKeyPress}
            />
            <Styled.FileButton />
          </>
        ) : (
          <Styled.Input
            {...rest}
            icon={!!icon}
            name={name}
            onChange={onChange}
            onKeyPress={onKeyPress}
            maxLength={type === 'number' ? maxLengthNumber : 50}
          />
        )}

        <Styled.Background />

        <Styled.Addon rtl={rtl} addonType={addonType}>
          {addon}
        </Styled.Addon>
      </Styled.AddonGroup>
      {error && <Styled.Error>{error}</Styled.Error>}
    </Styled.Wrapper>
  )
}

export default memo(Input)
