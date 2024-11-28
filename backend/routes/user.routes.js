const express = require("express");
const router = express.Router();
const { user } = require("../controllers");
const { allowedTo, verifyToken, fileHandler } = require("../middlewares");
const { roles } = require("../utils");

router
  .route("/")
  .post(
    verifyToken,
    allowedTo(roles.ADMIN),
    fileHandler.single("avatar"),
    user.createUser
  )
  .get(
    verifyToken,
    allowedTo(roles.ADMIN, roles.EDITOR, roles.VIEWER),
    user.getAllUsers
  );
router
  .route("/:id")
  .get(
    verifyToken,
    allowedTo(roles.ADMIN, roles.EDITOR, roles.VIEWER),
    user.getSingleUser
  )
  .delete(verifyToken, allowedTo(roles.ADMIN), user.deleteUser)
  .patch(verifyToken, allowedTo(roles.ADMIN, roles.EDITOR), user.updateUser);

module.exports = router;
