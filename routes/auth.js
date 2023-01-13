const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER

router.post("/register", async (req, res) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSaltSync(saltRounds);
  const hash = await bcrypt.hashSync(req.body.password, salt);
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password:hash,
    });
    const user = await newUser.save();
    console.log(newUser);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});
//LOGIN
router.post("/login", async (req, res) => {
    try {
      const user = await User.findOne({username: req.body.username});
      if(!user) return res.status(400).json("Wrong Credentials");

      const validated = await bcrypt.compare(req.body.password, user.password);
      if(!validated) return res.status(400).json("Wrong Credentials");

     const { password,  ...otherDetails } = user._doc;
     
       res.status(200).json(otherDetails);
    } catch (err) {
      res.status(500).json(err); 
    }
  });




module.exports = router;
