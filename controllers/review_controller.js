const Review = require('../model/review_model')
const admin = require('../config/firebase-config')

async function createReview(req, res){
    try{
        const {scribeId, studentId, reviewText, rating} = req.body;

        if(!scribeId || !studentId || !reviewText || !rating){
            return res.status(400).json({msg: "Bad request, missing values!"})
        }
        else{
            var review = await Review.create({
                scribeId: scribeId,
                studentId: studentId,
                reviewText: reviewText,
                rating: rating
            });

            var topic = `scribe_${updateData.scribeId.substring(1)}`;

            var payload = {
                notification: {
                    title: "You just got a Review!",
                    body: "Check your review"
                },
                topic: topic
            }

            try {
                await admin.messaging().send(payload);
                console.log(`Notification sent to topic ${topic}`);
            } catch (error) {
                console.error("Error sending notification:", error);
            }

            return res.status(201).json({data: review});
        }
    }catch(e){
        return res.status(500).json({msg: "An error occurred", error: e});
    }
}

//Scribe id is passed in parameter to get all the reviews of a scribe.
async function getReviewsById(req, res){
    try{
        var id = req.params.id;

        if(!id){
            return res.status(400).json({msg: "Bad request, no id given"});
        }
        else{
            var review = await Review.find({
                scribeId: id
            });

            if(!review){
                return res.status(404).json({msg: "Review not found"});
            }
            else{
                return res.status(200).json({data: review})
            }
        }
    } catch(e){
        return res.status(500).json({msg: "An error occurred", error: e})
    }
}

module.exports = {
    createReview,
    getReviewsById,
}