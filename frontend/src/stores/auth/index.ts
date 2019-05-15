import { observable, action } from 'mobx'
import { useStaticRendering } from 'mobx-react'
import { isServer } from '../../utils/isServer'
import { AuthStoreTypes } from './types'
import { getUserToken, setUserToken } from '../../utils/cookieService'
import { apiCaller } from '../../utils/apiCaller'
import { API_URL } from '../../config/api'
import { bind } from '../../utils/bind'

useStaticRendering(isServer)

class AuthStore {
  @observable authRequested: AuthStoreTypes['authRequested']
  @observable error: AuthStoreTypes['error']

  public constructor({}) {
    this.authRequested = false
    this.error = null
  }

  @bind
  @action
  private setError(error) {
    this.error = error
  }

  @bind
  @action
  private createSignature(publicAddress: string, nonce: string) {
    window.web3.personal.sign(
      `MeterQubes authentication with one-time nonce: ${nonce}`,
      publicAddress,
      async (err: string, signature: string) => {
        if (err) {
          this.setError(err)
        } else {
          const accessToken = await apiCaller(`${API_URL}/auth`, 'POST', {
            publicAddress,
            signature
          })

          setUserToken(accessToken)
          this.authRequested = false
        }
      }
    )
  }

  @bind
  @action
  public async createUser(publicAddress: string) {
    const { nonce } = await apiCaller(`${API_URL}/users`, 'POST', {
      publicAddress
    })

    if (nonce) {
      this.createSignature(publicAddress, nonce)
    }
  }

  @bind
  @action
  public async authUser(publicAddress: string) {
    const token = getUserToken()
    this.authRequested = true

    if (!token) {
      try {
        const { nonce } = await apiCaller(
          `${API_URL}/users?publicAddress=${publicAddress}`
        )

        this.createSignature(publicAddress, nonce)
      } catch (err) {
        this.createUser(publicAddress)
      }
    }
  }
}

export const initAuthStore = () => {
  return new AuthStore(isServer)
}
