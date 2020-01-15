const axios = require('axios');
const Dev = require('../models/Dev.js');
const parseStringAsArray = require('../utils/parseStringAsArray.js');

module.exports = {
    async index(request, response){
        const devs = await Dev.find();

        return response.json(devs);
    },

    async store(request, response){
        const { github_username, techs, latitude, longitude } = request.body;
        
        let dev = await Dev.findOne({ github_username });

        if(!dev){
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    
            const { name = login, avatar_url, bio } = apiResponse.data;
        
            const techsArray = parseStringAsArray(techs);
        
            const location = {
                type: "Point",
                coordinates: [longitude, latitude],
            };
        
            const dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            })
        }

        return response.json(dev);
    },
    async update(request, response){
        const github_username = request.params.id;
        const { type, value } = request.body;

        const types_default = ["name", "bio", "avatar_url"];

        if(types_default.indexOf(type) >= 0){
            Dev.findOne({ "github_username": github_username}, function(err, doc){
                doc[type] = value;
                doc.save();

                response.json(doc);
            }) 
        }else if(type == "techs"){
            Dev.findOne({ "github_username": github_username}, function(err, doc){
                doc.techs = parseStringAsArray(value);
                doc.save();

                response.json(doc);
            }) 
        }else if(type == "location"){ 
            Dev.findOne({ "github_username": github_username}, function(err, doc){
                doc.location.coordinates = parseStringAsArray(value);
                doc.save();

                response.json(doc);
            })        
        }else{
            response.json({ error: "Não é permitido alterar essa propiedade." })
        }
    },

    async destroy(request, response){

        Dev.deleteOne({ "github_username": request.params.id }, function(err){
            if(err){
                return response.json({ error: err})
            }else{
                response.json({ status: "ok" });
            }
        });
    },
}