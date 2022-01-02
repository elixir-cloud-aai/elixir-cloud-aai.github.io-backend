const express = require("express");
const router = new express.Router();
const axios = require("axios");

router.get("/", (req, res) => {
    res.send({ msg: "Hello World!" });
});

router.get("/news", async (req, res) => {
    try {
        const config = {
          headers: { Authorization: `Bearer ${process.env.TWITTER_TOKEN}` },
        };
        const query = "Covid19"
        //   "(%23elixir_cloud_aai OR %23elixircloudaai OR %23elixircloud_aai OR @ELIXIRcloud_aai has:mentions) OR ((%23cloudaai OR %23cloud_aai) (%23elixir OR %23elixireurope OR @ELIXIREurope has:mentions))";
        const nextValid = req.query.nextToken ? `&next_token=${req.query.nextToken}` : "";
        
        const response = await axios.get(
          `https://api.twitter.com/2/tweets/search/recent?query=${query}${nextValid}`,
          config
        );
        return res.send(response.data);
      } catch (e) {
        console.log(e);
        return res.send({ message: "Server error", error: e });
      }
});

module.exports = router;