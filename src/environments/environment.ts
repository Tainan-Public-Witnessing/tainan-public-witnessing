// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  UUID_NAMESPACE: '7b921192-c856-5152-8444-bb08b1efac9b',
  firebase: {
    apiKey: 'AIzaSyAhxopqv6yBwq-M_scVqFiRKKzMsIIWAgo',
    authDomain: 'tainan-public-witnessing.firebaseapp.com',
    databaseURL: 'https://tainan-public-witnessing.firebaseio.com',
    projectId: 'tainan-public-witnessing',
    storageBucket: 'tainan-public-witnessing.appspot.com',
    messagingSenderId: '1087540310197',
    appId: '1:1087540310197:web:30dfe6842e3d12af'
  },
  FIRESTORE_ROOT: 'DEV/DEV/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
