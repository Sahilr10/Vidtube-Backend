import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body;
    if (!content || content.trim() === "") {
        throw new ApiError(400, "Content is required");
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user._id
    })

    return res
    .status(201)
    .json(new ApiResponse(201, tweet, "Tweet created successfully..."))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets

    const { userId } = req.params;

    const tweets = await Tweet.find({ owner: userId})

    return res
    .status(200)
    .json(new ApiResponse(200, tweets, "User tweets fetched successfully..."))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params;
    const { content } = req.body;

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Content is required");
    } 

    const tweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            content
        },
        {
            new: true,
        }
        
    )
    
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }
    
    return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated successfully..."))


})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet

    const { tweetId } = req.params;

    const tweet = await Tweet.findByIdAndDelete(tweetId);

    return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet deleted successfully..."))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}