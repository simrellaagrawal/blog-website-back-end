const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Post = require("../models/Post");


//update
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      const saltRounds = 10;
      const salt = await bcrypt.genSaltSync(saltRounds);
      req.body.password = await bcrypt.hashSync(req.body.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("you can update only your account");
  }
});

//DELETE
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    console.log(user);
    await Post.deleteMany({ username: user.username });
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted");
  } catch (err) {
    res.status(404).json(err.message);
  }
});
//GET USER
router.get("/:id" ,async(req,res)=>{
  try{
  const user =await User.findById(req.params.id);
  const {password, ...others}= user._doc;
  res.status(200).json(others);
  }
  catch(err){
    res.status(500).json(err.message);
  }
})



module.exports = router;
