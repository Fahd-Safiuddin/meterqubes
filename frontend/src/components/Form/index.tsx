import * as Styled from './style'
import Input from '../Input'
import Button from '../Button'

export default function Form({ fields }) {
  return (
    <Styled.Form>
      {fields.map(({ fieldType, ...rest }) => {
        if (fieldType === 'input') {
          return (
            <Styled.Group key={rest.name}>
              <Input {...rest} fluid />
            </Styled.Group>
          )
        } else if (fieldType === 'button') {
          return (
            <Styled.Group key={rest.name}>
              <Button {...rest} />
            </Styled.Group>
          )
        }
      })}
    </Styled.Form>
  )
}
