// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  UUID_NAMESPACE: '7b921192-c856-5152-8444-bb08b1efac9b',
  TAINAN_PUBLIC_WITNESSING_PERMISSION_TOKEN: '3c8ec6c4-7a3b-43a6-82af-0d243d6a7fc7',
  DAY: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY','SUNDAY'],
  MOMENT_LOCALES: {
    ['en']: 'en',
    ['zh']: 'zh-tw',
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
