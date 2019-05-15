import * as Styled from './style'
import Input from '../../Input'
import Button from '../../Button'

type SearchProps = {
  onSearch: (term: string) => void
}

export default ({ onSearch }: SearchProps) => {
  return (
    <Styled.Search>
      <Input
        onChange={onSearch}
        size="sm"
        icon="search"
        placeholder="Search"
        fluid
        name="search"
      />
      <Button text="Favourites" onClick={() => {}} size="sm" />
    </Styled.Search>
  )
}
