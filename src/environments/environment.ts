// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  shortdateformatpipe: 'dd-MM-yyyy',
  longdateformatpipe: 'dd-MMM-yyyy hh:mm a',
  //  apiUrl: 'http://localhost:8010/rms',
  //  imageUrl:'http://localhost:8010/staticfiles/'
  //apiUrl: 'http://acuberfid.fortiddns.com:8004/fat'
  // apiUrl: 'http://acuberfid.fortiddns.com:4480/fatwebapi/fat',
  //imageUrl: 'http://acuberfid.fortiddns.com:4480/fatwebapi/staticfiles/'
  //  apiUrl: 'http://acuberfid.fortiddns.com:4480/fatwebapimassar/fat',
  //  imageUrl: 'http://acuberfid.fortiddns.com:4480/fatwebapimassar/staticfiles/'
  apiUrl: 'http://acuberfid.fortiddns.com:4480/rmsapi/rms',
  imageUrl: 'http://acuberfid.fortiddns.com:4480/rmsapi/staticfiles/'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
