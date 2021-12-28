import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Z kopyta kulig rwiee");
});

export default router;
