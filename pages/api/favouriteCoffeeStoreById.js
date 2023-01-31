import db from "@/utils/db";
import coffeeStores from "@/models/coffee-stores";

const favouriteCoffeeStoreById = async (req, res) => {
  if (req.method === "PATCH") {
    const { id } = req.body;

    try {
      if (id) {
        await db.connect();
        console.log({ id });
        const doc = await coffeeStores.findOneAndUpdate(
          id,
          { $inc: { voting: 1 } },
          {
            new: true,
            runValidators: true,
          }
        );

        console.log({ doc });
        await db.disconnect();

        if (doc) {
          res.status(200).json(doc);
        } else {
          res.status(400).json({ nessage: "doc not found" });
        }
      } else {
        res.status(400).json({ message: "Id is missing" });
      }
    } catch (err) {
      console.log({ err });
      res.status(500).json({ message: "Something went wrong", err });
    }
  }
};

export default favouriteCoffeeStoreById;
