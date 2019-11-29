const express = require("express");

const { check } = require("express-validator");

const router = express.Router();

const tour = require("../controllers/tour.controller");
const schedule = require("../controllers/schedule.controller");
const image = require("../controllers/image.controller");
const account = require("../controllers/account.controller");
const auth = require("../controllers/auth.controller");

//authencation
const authenticated = require("../middleware/auth.middleware");

//for tour
router.get("/tour", tour.read);
router.get("/tours", tour.listAll);
router.post("/tour", authenticated, tour.create); //sẽ tạo luôn một schedule tương ứng với idTour mới tạo
router.patch("/tour", authenticated, tour.update);
router.delete("/tour", authenticated, tour.delete);

//for schedule
router.get("/schedule", schedule.read);
router.get("/schedules", schedule.listAll);
router.post("/schedule", authenticated, schedule.create);
router.patch("/schedule", authenticated, schedule.update);
router.delete("/schedule", authenticated, schedule.delete);

//for img
router.get("/images", image.listAllImageTour);
router.get("/image", image.listAllImageTourById);
router.delete("/image", authenticated, image.delete);
router.post("/image", authenticated, image.create);
router.post("/upload", authenticated, image.upload);

//for account
router.get("/account", account.read);
router.get("/accounts", account.listAll);
router.post("/account", authenticated, account.create);
router.patch("/account", authenticated, account.update);
router.delete("/account", authenticated, account.delete);

//for authencation
router.post("/login", auth.login);
router.post("/register", auth.register);
// router.post("/logout", auth.logout);

module.exports = router;
