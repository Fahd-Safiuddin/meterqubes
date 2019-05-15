import * as Styled from './style'
import { PureComponent, createRef } from 'react'
import { EventChangeOptions } from 'next/router'
import Input from '../Input'
import { SelectProps, SelectState } from './types'

export default class Select extends PureComponent<SelectProps, SelectState> {
  select: {
    current: HTMLDivElement
  }

  constructor(props: SelectProps) {
    super(props)

    this.state = {
      open: false,
      searchTerm: ''
    }

    this.select = createRef<HTMLDivElement>()

    this._handleToggleSelect = this._handleToggleSelect.bind(this)
    this._handleSetValue = this._handleSetValue.bind(this)
    this._handleClickOutside = this._handleClickOutside.bind(this)
    this._onSearch = this._onSearch.bind(this)
  }

  componentDidMount() {
    window.addEventListener('click', this._handleClickOutside, true)
  }

  componentWillUnmount() {
    window.removeEventListener('click', this._handleClickOutside, true)
  }

  _handleClickOutside(event: EventChangeOptions) {
    const element = this.select
    if (!element.current.contains(event.target)) {
      this._handleToggleSelect(false)
    }
  }

  _handleToggleSelect(open: boolean) {
    this.setState({ open })
  }

  _handleSetValue(selected: SelectProps['selected']) {
    this._handleToggleSelect(false)
    this.setState({ searchTerm: '' })
    this.props.onSelect && this.props.onSelect(selected)
  }

  _onSearch(searchTerm: string) {
    this.setState({ searchTerm })
    this.props.onSearch && this.props.onSearch(searchTerm)
  }

  render() {
    const { open, searchTerm } = this.state
    const { selected, items, addon, search, caret, size } = this.props
    const selectedObject = items.find(({ id }) => id === selected)
    const selectedLabel = selectedObject && selectedObject.label

    const filteredItems = searchTerm
      ? [...items].filter(item => {
          return (
            item.label.toLowerCase().search(searchTerm.toLowerCase()) !== -1
          )
        })
      : items

    return (
      <Styled.Select ref={this.select} open={open} size={size}>
        {addon && (
          <>
            <Styled.Addon onFocus={() => this._handleToggleSelect(true)}>
              {addon}
            </Styled.Addon>
            <Styled.AddonDivider />
          </>
        )}
        <Styled.Toggler
          open={open}
          onClick={() => this._handleToggleSelect(true)}
        >
          {selectedLabel || items[0].label}
          {caret !== false && (
            <Styled.Caret className="material-icons">
              {open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
            </Styled.Caret>
          )}
        </Styled.Toggler>

        {open && (
          <Styled.Dropdown>
            {search !== false && (
              <Input
                value={searchTerm}
                onChange={this._onSearch}
                name="search"
                size="sm"
                icon="search"
              />
            )}
            <Styled.List>
              {filteredItems.map(({ id, label }, i) => (
                <Styled.ListItem
                  key={i}
                  active={selected === id}
                  onClick={() => this._handleSetValue(id)}
                >
                  {label}
                </Styled.ListItem>
              ))}
            </Styled.List>
          </Styled.Dropdown>
        )}
      </Styled.Select>
    )
  }
}
