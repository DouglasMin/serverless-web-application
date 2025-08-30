import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
  CognitoUserAttribute,
  CognitoRefreshToken
} from 'amazon-cognito-identity-js'
import type { User, LoginCredentials, AuthTokens } from '../types'

// Cognito configuration - these should come from environment variables
const COGNITO_CONFIG = {
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
  Region: import.meta.env.VITE_AWS_REGION
}

// Debug: Log configuration
console.log('🔧 Cognito 설정:', {
  UserPoolId: COGNITO_CONFIG.UserPoolId,
  ClientId: COGNITO_CONFIG.ClientId,
  Region: COGNITO_CONFIG.Region
})

// Validate configuration
if (!COGNITO_CONFIG.UserPoolId || !COGNITO_CONFIG.ClientId) {
  console.error('❌ Cognito 설정이 누락되었습니다:', COGNITO_CONFIG)
  throw new Error('Cognito configuration is missing. Please check your environment variables.')
}

// Initialize Cognito User Pool
const userPool = new CognitoUserPool({
  UserPoolId: COGNITO_CONFIG.UserPoolId,
  ClientId: COGNITO_CONFIG.ClientId
})

export interface CognitoSignUpData {
  email: string
  password: string
  name?: string
  phoneNumber?: string
}

export interface CognitoError {
  code: string
  message: string
  name: string
}

class CognitoService {
  // Sign up a new user
  async signUp(userData: CognitoSignUpData): Promise<{ userSub: string; codeDeliveryDetails: any }> {
    return new Promise((resolve, reject) => {
      console.log('🔧 CognitoService.signUp 호출:', { email: userData.email, name: userData.name })
      
      const attributeList: CognitoUserAttribute[] = []

      // Add email attribute
      attributeList.push(
        new CognitoUserAttribute({
          Name: 'email',
          Value: userData.email
        })
      )

      // Add given_name attribute if provided
      if (userData.name) {
        attributeList.push(
          new CognitoUserAttribute({
            Name: 'given_name',
            Value: userData.name
          })
        )
      }

      // Add phone number if provided
      if (userData.phoneNumber) {
        attributeList.push(
          new CognitoUserAttribute({
            Name: 'phone_number',
            Value: userData.phoneNumber
          })
        )
      }

      console.log('📝 속성 리스트:', attributeList.map(attr => ({ name: attr.getName(), value: attr.getValue() })))

      userPool.signUp(
        userData.email,
        userData.password,
        attributeList,
        [],
        (err, result) => {
          if (err) {
            console.error('❌ Cognito signUp 에러:', err)
            reject(err)
            return
          }
          if (result) {
            console.log('✅ Cognito signUp 성공:', {
              userSub: result.userSub,
              codeDeliveryDetails: result.codeDeliveryDetails
            })
            resolve({
              userSub: result.userSub,
              codeDeliveryDetails: result.codeDeliveryDetails
            })
          } else {
            console.error('❌ Cognito signUp 결과 없음')
            reject(new Error('회원가입 결과를 받지 못했습니다.'))
          }
        }
      )
    })
  }

  // Confirm sign up with verification code
  async confirmSignUp(email: string, confirmationCode: string): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('🔧 CognitoService.confirmSignUp 호출:', { email, code: confirmationCode })
      
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool
      })

      cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
        if (err) {
          console.error('❌ Cognito confirmRegistration 에러:', err)
          reject(err)
          return
        }
        console.log('✅ Cognito confirmRegistration 성공:', result)
        resolve()
      })
    })
  }

  // Sign in user
  async signIn(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    return new Promise((resolve, reject) => {
      const authenticationDetails = new AuthenticationDetails({
        Username: credentials.email,
        Password: credentials.password
      })

      const cognitoUser = new CognitoUser({
        Username: credentials.email,
        Pool: userPool
      })

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (session: CognitoUserSession) => {
          // Get user attributes
          cognitoUser.getUserAttributes((err, attributes) => {
            if (err) {
              reject(err)
              return
            }

            // Parse user attributes
            const userAttributes: Record<string, string> = {}
            attributes?.forEach(attr => {
              userAttributes[attr.getName()] = attr.getValue()
            })

            const user: User = {
              id: session.getIdToken().payload.sub,
              email: userAttributes.email || credentials.email,
              name: userAttributes.given_name || userAttributes.name || userAttributes.email || credentials.email,
              role: userAttributes['custom:role'] || 'user',
              createdAt: new Date(session.getIdToken().payload.iat * 1000).toISOString(),
              updatedAt: new Date().toISOString()
            }

            const tokens: AuthTokens = {
              accessToken: session.getAccessToken().getJwtToken(),
              refreshToken: session.getRefreshToken().getToken(),
              expiresAt: session.getAccessToken().getExpiration() * 1000
            }

            resolve({ user, tokens })
          })
        },
        onFailure: (err) => {
          reject(err)
        },
        newPasswordRequired: (_userAttributes, _requiredAttributes) => {
          // Handle new password required scenario
          reject(new Error('New password required'))
        }
      })
    })
  }

  // Sign out user
  async signOut(): Promise<void> {
    return new Promise((resolve) => {
      const cognitoUser = userPool.getCurrentUser()
      if (cognitoUser) {
        cognitoUser.signOut()
      }
      resolve()
    })
  }

  // Refresh tokens
  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    return new Promise((resolve, reject) => {
      const cognitoUser = userPool.getCurrentUser()

      if (!cognitoUser) {
        reject(new Error('No current user found'))
        return
      }

      const cognitoRefreshToken = new CognitoRefreshToken({
        RefreshToken: refreshToken
      })

      cognitoUser.refreshSession(cognitoRefreshToken, (err, session) => {
        if (err) {
          reject(err)
          return
        }

        const tokens: AuthTokens = {
          accessToken: session.getAccessToken().getJwtToken(),
          refreshToken: session.getRefreshToken().getToken(),
          expiresAt: session.getAccessToken().getExpiration() * 1000
        }

        resolve(tokens)
      })
    })
  }

  // Get current user session
  async getCurrentSession(): Promise<CognitoUserSession | null> {
    return new Promise((resolve) => {
      const cognitoUser = userPool.getCurrentUser()

      if (!cognitoUser) {
        resolve(null)
        return
      }

      cognitoUser.getSession((err: any, session: CognitoUserSession) => {
        if (err || !session.isValid()) {
          resolve(null)
          return
        }
        resolve(session)
      })
    })
  }

  // Get current user profile
  async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const cognitoUser = userPool.getCurrentUser()

      if (!cognitoUser) {
        resolve(null)
        return
      }

      cognitoUser.getSession((err: any, session: CognitoUserSession) => {
        if (err || !session.isValid()) {
          resolve(null)
          return
        }

        cognitoUser.getUserAttributes((err, attributes) => {
          if (err) {
            reject(err)
            return
          }

          const userAttributes: Record<string, string> = {}
          attributes?.forEach(attr => {
            userAttributes[attr.getName()] = attr.getValue()
          })

          const user: User = {
            id: session.getIdToken().payload.sub,
            email: userAttributes.email || '',
            name: userAttributes.given_name || userAttributes.name || userAttributes.email || '',
            role: userAttributes['custom:role'] || 'user',
            createdAt: new Date(session.getIdToken().payload.iat * 1000).toISOString(),
            updatedAt: new Date().toISOString()
          }

          resolve(user)
        })
      })
    })
  }

  // Forgot password
  async forgotPassword(email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool
      })

      cognitoUser.forgotPassword({
        onSuccess: (data) => {
          resolve(data)
        },
        onFailure: (err) => {
          reject(err)
        }
      })
    })
  }

  // Confirm forgot password
  async confirmPassword(email: string, confirmationCode: string, newPassword: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool
      })

      cognitoUser.confirmPassword(confirmationCode, newPassword, {
        onSuccess: () => {
          resolve()
        },
        onFailure: (err) => {
          reject(err)
        }
      })
    })
  }

  // Change password
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const cognitoUser = userPool.getCurrentUser()

      if (!cognitoUser) {
        reject(new Error('No current user found'))
        return
      }

      cognitoUser.getSession((err: any, session: CognitoUserSession) => {
        if (err || !session.isValid()) {
          reject(new Error('Invalid session'))
          return
        }

        cognitoUser.changePassword(oldPassword, newPassword, (err, _result) => {
          if (err) {
            reject(err)
            return
          }
          resolve()
        })
      })
    })
  }
}

// Export singleton instance
export const cognitoService = new CognitoService()
export default cognitoService