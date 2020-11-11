const router = require("express").Router();

router.route("/users")
    // .post()
    .get()


router.route("/userLoginMethod/:id1/:id2")
    .get()
    
    
router.route("/users/:id1")
    .get()
    .put()
    
router.route("/matchesYes/:id1/:id2")
    .put()


router.route("/matchesNo/:id1/:id2")
    .put()

router.route("/allMatchesYes/:id1")
    .get()

router.route("/allMatchesNo/:id1")
    .get()

module.exports = routers;