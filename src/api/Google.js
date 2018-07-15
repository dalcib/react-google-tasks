  /* eslint-disable */

  export async function logInAsync(config) /*: LogInConfig ): Promise<LogInResult>*/ {
    /*  let scopes = config.scopes
    if (!scopes) {
      scopes = ['profile', 'email']
    } */

    const auth = new Promise((resolve, reject) => {
      let logInResult
      gapi.auth2.authorize(
        {
          client_id: config.webClientId,
          scope: config.scopes.join(' ') || 'profile email',
          immediate: true,
          //cookie_policy: 'single_host_origin',
          response_type: 'id_token permission',
        },
        authResult => {
          //console.log(authResult)
          //logInResult = authResult
          if (authResult.error) {
            console.error(authResult.error)
            reject({
              type: 'cancel',
            })
          } else {
            logInResult = {
              type: 'success',
              accessToken: authResult.access_token,
              idToken: authResult.id_token,
              //refreshToken: null,
              //serverAuthCode: null,
            }
            resolve(getUserProfile(logInResult))
          }
        }
      )
    })

    return auth
  }

  async function getUserProfile(logInResult) {
    let userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${logInResult.accessToken}` },
    })
    userInfoResponse = await userInfoResponse.json()
    return {
      ...logInResult,
      user: {
        id: userInfoResponse.id,
        name: userInfoResponse.name,
        givenName: userInfoResponse.given_name,
        familyName: userInfoResponse.family_name,
        photoUrl: userInfoResponse.picture,
        email: userInfoResponse.email,
      },
    }
  }
  /*
  type LogInConfig = {
    androidClientId?: string,
    androidStandaloneAppClientId?: string,
    iosClientId?: string,
    iosStandaloneAppClientId?: string,
    webClientId?: string,
    behavior?: 'system' | 'web',
    scopes?: Array<string>,
  };

  type LogInResult =   | {
      type: 'cancel',
    }
    | {
      type: 'success',
      accessToken?: ?string,
      idToken: ?string,
      refreshToken: ?string,
      serverAuthCode: ?string,
      user: {
        id: string,
        name: string,
        givenName: string,
        familyName: string,
        photoUrl?: ?string,
        email?: ?string,
      },
    };

  async function getUserInfo(accessToken) {
    let userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}`},
    });

    return userInfoResponse;
  }
    */
