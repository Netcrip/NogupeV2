// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyB71sdZD6BpfUYtD1pJgAaBQwfpDTuAAFg",
    authDomain: "nogupedev.firebaseapp.com",
    databaseURL: "https://nogupedev.firebaseio.com",
    projectId: "nogupedev",
    storageBucket: "nogupedev.appspot.com",
    messagingSenderId: "1510465035"
  /*   apiKey: "AIzaSyD8wjl77YJmAO636QxY7RmbNtLpDumenb0",
    authDomain: "nogupe-25eff.firebaseapp.com",
    databaseURL: "https://nogupe-25eff.firebaseio.com",
    projectId: "nogupe-25eff",
    storageBucket: "nogupe-25eff.appspot.com",
    messagingSenderId: "778139974379" */
  }
};
