Testing firebase as a backend for new projects.

Setup: `npm -g install firebase`; `firebase login`; `firebase init`  
This test app's web console is at https://console.firebase.google.com/project/fir-test-5ea52/overview

Hosting: `firebase deploy`. Dev/prod environments: create different projects on https://firebase.google.com for env isolation (not tested here).  
https://web.archive.org/web/20160310115701/https://www.firebase.com/blog/2015-10-29-managing-development-environments.html  
This test app's hosted at https://fir-test-5ea52.firebaseapp.com/ 
Easier than mucking about with github pages. I assume google's cdn will be reliable hosting, because google, but of course I haven't battle-tested it personally vs. github.

Auth: prebuilt auth UI and backend is firebase's killer feature, IMHO.  
Until the 1.0.1 release, build and install firebaseui manually (`dist` isn't in github) to get email `requireDisplayName` option: (once 1.0.1 is out this step should go away)  
`git clone git@github.com:firebase/firebaseui-web.git ; cd firebaseui-web && npm install && npm run build && npm link ; cd - && npm link firebaseui`
Config: https://github.com/firebase/firebaseui-web#starting-the-sign-in-flow
Copy the code in this test project. Careful with anonymous users (upgrading anon account/linking credentials not supported by ui yet, need to manually merge accounts).

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). [Usage](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).
