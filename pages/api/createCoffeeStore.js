import db from "@/utils/db";
import coffeeStores from "@/models/coffee-stores";

const createCoffeeStore = async (req, res) => {
  if (req.method === "POST") {
    const { id, name, neighbourhood, address, imgUrl, voting } = req.body;
    // console.log({ id, name, neighbourhood, address, imgUrl, voting });
    try {
      if (id) {
        // console.log({ id });
        await db.connect();
        const existingCoffeeStore = await coffeeStores.findOne({ id: id });
        // console.log({ existingCoffeeStore });
        if (existingCoffeeStore) {
          res.status(422).json({ message: "coffee store exists already!" });
          await db.disconnect();
          return;
        } else {
          if (id && name) {
            await db.connect();
            const newCoffeeStores = await coffeeStores({
              id,
              name,
              address,
              neighbourhood,
              voting,
              imgUrl,
            });
            const CS = await newCoffeeStores.save();
            await db.disconnect();
            res.status(201).json(CS);
          } else {
            res.status(400).json({ message: "Id or name is missing" });
          }
        }
      } else {
        res.status(400).json({ message: "Id is missing" });
      }
    } catch (err) {
      console.log({ err });
      res
        .status(500)
        .json({ message: "Error creating or finding a store", err });
    }
  }
};

export default createCoffeeStore;
