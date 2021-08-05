var express = require('express');
var mongoose = require('mongoose');



const Phonelist = require("../models/phoneList.js");
var Userlist = require("../models/userAccount");


module.exports.getLists = async function(req, res){
    
    const{id} = req.params;
    
    try {
        const lists = await Phonelist.find({'seller':id});
        res.status(200).json(lists);
    } catch(error) {
        res.status(404).json({message : error.message})
    }
}

 
module.exports.createList = async (req, res) => {
    const { title, brand, image, stock, seller, price, disabled } = req.body;

    var newlist = new Phonelist({ title, brand, image, stock, seller,price,createdAt: new Date()})


    try{
        await newlist.save();
        //200 = success creation
        res.status(201).json(newlist);

    }catch(error) {

        res.status(409).json({ message: error.message });
        console.log(error.message);

    }

}

// /profile/api/editlist/:id
module.exports.updateList = async (req,res) => {
    const {id } = req.params;
    const { title, brand, image, stock, price } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No list with id: ${id}`)
    const updateList = { title, brand, image, stock, price, _id: id,createdAt: new Date() };

    try{
        await Phonelist.findByIdAndUpdate(id, updateList, { new: true });
        //200 = success creation
        res.status(200).json(updateList);

    }catch(error) {

        res.status(409).json({ message: error.message });
        console.log(error.message);

    }

}

module.exports.deletelist = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No list with id: ${id}`);
    
    try{
        await Phonelist.findByIdAndRemove(id);

        //200 = success creation
        res.status(200).json({ message: "List deleted successfully." });

    }catch(error) {

        res.status(409).json({ message: error.message });
        console.log(error.message);

    }

}


module.exports.disablelist = async (req, res) => {
    const { id } = req.params;
    

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No list with id: ${id}`);

    const list =  await Phonelist.findById(id);
  
    if (list.disabled == ""){
        await Phonelist.findByIdAndUpdate(id,{$unset: { disabled:1 }});
    }else{
        await Phonelist.findByIdAndUpdate(id,{disabled:""});
    }

    res.status(200).json({ message: "List disabled/enabled successfully." });
}


module.exports.getUser = async function(req, res){
    const{id} = req.params;
    try {
        const user = await Userlist.findById(id);
        res.status(200).json(user);
    } catch(error) {
        res.status(404).json({message : error.message})
    }
}

module.exports.fetch_email = async function(req, res){
    const{email} = req.params;
    
    try{
        const userexist = await Userlist.find({'email':email});
        res.status(200).json(userexist.length!=0 ? true : false);
    }catch(error) {

        res.status(409).json({ message: error.message });
        console.log(error.message);

    }

}


module.exports.updateUser = async function(req, res){
    const {id } = req.params;
    const { firstname, lastname, email, password } = req.body;
    // console.log(11);

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No list with id: ${id}`)

    try{
        const updateuser = { firstname, lastname, email ,password, _id:id};
        await Userlist.findByIdAndUpdate(id, updateuser, { new: true });
        //200 = success creation
        res.status(200).json(updateuser);
    }catch(error) {

        res.status(409).json({ message: error.message });
        console.log(error.message);

    }



}

module.exports.getUserLists = async function(req, res){
    
    const{id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No list with id: ${id}`)

    try {
        const userlists = await Phonelist.find({'reviews.reviewer':id});
        res.status(200).json(userlists);
    } catch(error) {
        res.status(404).json({message : error.message})
    }
}



module.exports.updateRating = async function(req, res){
    
    const{id} = req.params;
    const listData = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No list with id: ${id}`)

    try {
        const userlists = await Phonelist.findByIdAndUpdate(id, listData, { new: true });
        res.status(200).json(userlists);
    } catch(error) {
        res.status(404).json({message : error})
    }
}

module.exports.updateComment = async function(req, res) {
    const{id} = req.params;
    const listData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No list with id: ${id}`)


    try {
        const userlists = await Phonelist.findByIdAndUpdate(id, listData, { new: true });
        res.status(200).json(userlists);
    } catch(error) {
        res.status(404).json({message : error})
    }



}
module.exports.deleteComment = async function(req, res) {
    const{id} = req.params;
    const listData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No list with id: ${id}`)


    try {
        const userlists = await Phonelist.findByIdAndUpdate(id, listData, { new: true });
        res.status(200).json(userlists);
    } catch(error) {
        res.status(404).json({message : error})
    }

}
