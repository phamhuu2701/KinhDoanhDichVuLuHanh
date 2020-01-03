const express = require("express");

// const { check } = require("express-validator");

const router = express.Router();

const tour = require("../controllers/tour.controller");
const schedule = require("../controllers/schedule.controller");
const image = require("../controllers/image.controller");
const order = require("../controllers/order.controller");
const account = require("../controllers/account.controller");
const auth = require("../controllers/auth.controller");
const favorite = require("../controllers/favorite.controller");
//authencation
const authenticated = require("../middleware/auth.middleware");
//report
const report = require("../controllers/report.controller");
//for tour
router.get("/tour", tour.read);
router.get("/tours", tour.listAll);
router.post("/tours/search", tour.listTourSearch);
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
router.post("/image", image.create);
router.post("/avatar", image.avatar);
router.post("/upload", image.upload);

//for account
router.get("/account", authenticated, account.read);
router.get("/accountWithEmail", authenticated, account.readByEmail);

router.get("/accounts", authenticated, account.listAll);
router.post("/account", authenticated, account.create);
router.patch("/account", authenticated, account.update);
router.delete("/account", authenticated, account.delete);

//for payment
router.post("/getLinkPayment", order.getLinkPayment);
router.post("/resultPayment", order.resultPayment);
router.post("/cancelPayment", order.cancelPayment);
//for order`
router.get("/order", order.read);
router.get("/orderWithEmail", order.readByEmail);
router.get("/orders", order.listAll);
router.post("/order", order.create);
router.patch("/order", order.update);
router.delete("/order", authenticated, order.delete);

//favorites
router.get("/favoritesWithEmail", favorite.readByEmail);

//for authencation
router.post("/login", auth.login);
router.post("/register", auth.register);
router.get("/verify", auth.verify);
router.post("/forgotPasswordStep1", auth.forgotPasswordStep1);
router.post("/forgotPasswordStep2", auth.forgotPasswordStep2);

//report
router.get("/report", authenticated, report.getReport);

module.exports = router;
