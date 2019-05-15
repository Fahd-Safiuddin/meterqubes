import * as Styled from './style'
import Text from '../Text'
import { DropdownItemTypes } from './types'

function Dropdown({ list }: { list: DropdownItemTypes[] }) {
  return (
    <Styled.Dropdown>
      {Array.isArray(list) &&
        list.map(({ icon, image, label, onClick }: DropdownItemTypes) => (
          <Styled.DropdownItem key={label} onClick={onClick}>
            {icon && <i className="material-icons">{icon}</i>}
            {image && <img src={image} />}
            <Text>{label}</Text>
          </Styled.DropdownItem>
        ))}
    </Styled.Dropdown>
  )
}

export default Dropdown
