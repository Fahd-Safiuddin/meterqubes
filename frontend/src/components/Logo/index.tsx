import Link from '../Link'
import * as Styled from './style'
import { LogoPropsTypes } from './types'

export default function Logo({ src, alt }: LogoPropsTypes) {
  return (
    <Styled.Logo>
      <Link href="/" prefetch>
      <Styled.LogoImage src={src} alt={alt || ''} />
    </Link>
    </Styled.Logo>
  )
}