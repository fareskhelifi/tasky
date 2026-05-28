const express = require("express");

function createChatRouter({ autofillService }) {
  const router = express.Router();

  router.post("/chat", async (req, res, next) => {
    try {
      const message = (req.body.message || "").trim();

      if (!message) {
        return res.status(400).json({
          ok: false,
          message: "Message is required.",
        });
      }

      const result = await autofillService.handleUserQuery(message);
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  });

  return router;
}

module.exports = createChatRouter;
