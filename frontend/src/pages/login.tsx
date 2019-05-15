import Page from '../components/Page'
import Router from 'next/router'
import { withNamespaces } from '../utils/i18n'
import Form from '../components/Form'
import { useState } from 'react'

type LoginTypes = {
  email: string
  password: string
}

function Login({ t, lng }) {
  const initialState: LoginTypes = {
    email: '',
    password: ''
  }

  const [values, setValue] = useState(initialState)

  const onChange = (value: string, name: string) => {
    setValue({
      ...values,
      [name]: value
    })
  }

  const fields = [
    {
      fieldType: 'input',
      label: t('form.email'),
      name: 'email',
      type: 'email',
      size: 'lg',
      onChange
    },
    {
      fieldType: 'input',
      label: t('form.password'),
      name: 'password',
      type: 'password',
      size: 'lg',
      onChange
    },
    {
      fieldType: 'button',
      text: t('form.button'),
      size: 'lg',
      name: 'submit',
      theme: 'primary',
      type: 'button', // replace to submit later
      onClick: (e: Event) => {
        e.preventDefault()
        Router.push('/admin')
      }
    }
  ]

  return (
    <Page rtl={lng === 'ar'} layout="login" withoutHeader>
      <Form fields={fields} />
    </Page>
  )
}

Login.getInitialProps = async () => {
  return {
    namespacesRequired: ['login']
  }
}

export default withNamespaces('login')(Login)
