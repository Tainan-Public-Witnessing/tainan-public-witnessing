// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBctAo4dEh7L22XmXqkW5iAnRyfDgvTlZQ',
    authDomain: 'tainan-public-witnessing-dev.firebaseapp.com',
    projectId: 'tainan-public-witnessing-dev',
    storageBucket: 'tainan-public-witnessing-dev.appspot.com',
    messagingSenderId: '1029341358770',
    appId: '1:1029341358770:web:a0647b48ffb0f4e0a977ab',
    measurementId: 'G-9S7J6K0HJ8',
  },
  UUID_NAMESPACE: '7b921192-c856-5152-8444-bb08b1efac9b',
  LINE_LOGIN:
    'https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=1657601373&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fline-login-callback&scope=profile%20openid&nonce=tpw',
  BACKEND_URL: 'http://localhost:8080',
  DAY: [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
  ],
  MOMENT_LOCALES: {
    ['en']: 'en',
    ['zh']: 'zh-tw',
  },
  EMULATOR: queryString('emulator'),
};
function queryString(key: string) {
  const query = new URLSearchParams(window.location.search.substring(1));
  return query.get(key);
}
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
