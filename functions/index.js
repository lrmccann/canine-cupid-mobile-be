const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors')
const app = express();
const firebase = require("firebase");
const {firestore} = require("firebase/firestore");
const bodyParser = require("body-parser");

// cors privacy policy solution
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin",  "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const firebaseConfig = {
    projectId: "canine-cupid-img-storage",
    apiKey: "AIzaSyD_o0bE2HYusxP7qTW_8vTEx0XPtxNyIrQ",
    authDomain: "canine-cupid-img-storage.firebaseapp.com",
    databaseURL: "canine-cupid-img-storage.firebaseio.com",
    storageBucket: "canine-cupid-img-storage.appspot.com",
    messagingSenderId: "677791653458",
    appId: "1:677791653458:ios:5912c4594c374449f7498b",
}

firebase.initializeApp(firebaseConfig)

var serviceAccount = require("./permissions.json");
const { user } = require('firebase-functions/lib/providers/auth');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://canine-cupid-img-storage.firebaseio.com"
});
const db = admin.database();
const ref = db.ref("canine-cupid-img-storage/users")

// Check credentials from login form
app.get("/userLoginMethod/:id1/:id2" , (req , res) => {
    console.log(req.params.id1)
    console.log(req.params.id2)
    var email = req.params.id1
    var password = req.params.id2
    const promise = firebase.default.auth().signInWithEmailAndPassword(email , password)
    // .then(firebase.default.auth().signInWithRedirect(promise))
    // .then(res => console.log(res, "this is signinwithredirect"))
    .then(function(snapshot){
        // const idk = ({...snapshot})
        const idkTwo = idk.user.toJSON()
        console.log(idkTwo)
        return res.json({
            userUid : idkTwo.uid
        }) 
    })
})
//////////

// Create and Verify Session Token using ID token
app.post('/sessionLogin' , (req , res) => {
    const idToken = req.body.idToken
    console.log(idToken)
    // const csrfToken = req.body.csrfToken
    // if (csrfToken !== req.cookies.csrfToken){
    //     res.status(401).send('UNAUTHORIZED REQUEST!');
    //     return;
    // }
    const expiresIn = 60 * 60 * 24 * 20;
    admin.auth().createSessionCookie(idToken , {expiresIn})
    .then((sessionCookie) => {
        const options = {maxAge : expiresIn , httpOnly : true , secure : true};
        res.cookie('session' , sessionCookie , options);
        res.end(JSON.stringify({status : 'success'}));
        return
    }
    ).catch((error) => {
        console.log(error)
    })
})
///////////

// Pull User's Data from Firestore
app.get("/userData" , (req , res) => {
    const promise = firebase.default.firestore().collection('users')
    .where("userName" , "==" , )

})
////

// Not sure yet
firebase.default.auth().onAuthStateChanged(function(user) {
    if(user){
        var displayName = user.userName
        var email = user.email
        var uid = user.uid
    }
})
//////////
app.get(`/getMatchesYesByName/:userName`, async (req , res) =>{
    const userName = req.params.userName
    const db = firebase.default.firestore().collection('users')
    await db.where("userName" , "==" , userName).get()
    // .then((snap) => {const items = snap.docs.reduce((res , item ) => ({...res , [item.userName] : item.data()}),
    .then((snap) => {const items = snap.docs.reduce((res , item ) => ({res , [item.userName] : item.data()}),

    {}
    )
    const yesArray = items.undefined.matchesYes
    // const yesArray = items
    console.log(yesArray)

    return res.json(
          yesArray
    )
})
    .catch((error) => {
        console.log(error)
    })
    // .then((res) => console.log(res))
})


app.get('/moreFirebaseStuff/:userArray' , async (req , res) => {
    console.log(req.body)
    const yesArray = req.body
    // const randomThing = firebase.default.firestore().collection('users').get()
    // return  (await randomThing).docs.map(doc => doc.data())
    // const db = firebase.default.firestore().collection('users')
    const snapshot = await firebase.default.firestore().collection('users').get()
    console.log(snapshot.docs.map(doc => doc.data().userName))
    const newSnapShot = snapshot.docs.map(doc => doc.data().userName)
    return res.json({
        data : newSnapShot
    })
    // .then((snap) => {const items = snap.docs.reduce((res , item) => ({...res , [item.userName] : item.data()}),
    // {}
    // )
    // console.log(items , "gello")
    // return res.json({
    //     userYesArrayFromFirebase : items
    // })

// })
    // .then((res) => console.log(res))
})

// app.get('/returnObjectsInYesArray/:userNames' , async (req , res) => {
//     console.log(req.params.userNames)
//     const getUser = req.params.userNames
//     const db = firebase.default.firestore().collection('users')
//     await db.where("userName" , "==" , getUser).get()
//     .then((snap) => {const items = snap.docs.reduce((res , item ) => ({...res , [item.userName] : item.data()}),
//     {}
//     )
//         console.log(items , " this should be two different users")
// })
// })
app.get('/getUserForMatchesModal/:id1' , async (req , res ) => {
    console.log(req.params.id1)
    const getUser = req.params.id1
    const db = firebase.default.firestore().collection('users')
    await db.where("userName" , "==" , getUser).get()
        // .then((snap) => {const items = snap.docs.reduce((res , item ) => ({...res , [item.userName] : item.data()}),
        .then((snap) => {const items = snap.docs.reduce((res , item ) => ({res , [item.userName] : item.data()}),

        {}
    )
        return res.json({
            userStuff : items
        })

        // console.log(items , "user Object")
})
})

exports.app = functions.https.onRequest(app);