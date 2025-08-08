const express= require("express");
const { getAllTravelLists, getTravelListById } = require("../controllers/travelListController");


const router = express.Router();

router.get("/", getAllTravelLists);
router.get("/:id", getTravelListById);

module.exports = router;