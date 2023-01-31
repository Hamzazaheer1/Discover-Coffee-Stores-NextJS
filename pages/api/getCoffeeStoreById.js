import db from "@/utils/db";
import coffeeStores from "@/models/coffee-stores";

const getCoffeeStoreById = async (req, res) => {
  if (req.method === "GET") {
    const { id } = req.query;

    try {
      if (id) {
        console.log({ id });
        await db.connect();
        const existingCoffeeStore = await coffeeStores.findOne({ id: id });
        console.log({ existingCoffeeStore });
        if (existingCoffeeStore) {
          await db.disconnect();
          res.status(422).json(existingCoffeeStore);
          return;
        } else {
          await db.disconnect();
          res.status(400).json({ message: "id could not be found" });
        }
      } else {
        await db.disconnect();
        res.status(400).json({ message: "Id is missing" });
      }
    } catch (err) {
      console.log({ err });
      res.status(500).json({ message: "Error finding a store", err });
    }
  }
};

export default getCoffeeStoreById;
