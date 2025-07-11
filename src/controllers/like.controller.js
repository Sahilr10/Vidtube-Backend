
import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video

    const likedBy = req.user._id;
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    }
    const like = await Like.findOne({
        video: videoId,
        likedBy
    });

    if(!like){
        const like = await Like.create({
            video: videoId,
            likedBy
        })

        return res
        .status(201)
        .json(new ApiResponse(201, like, "Liked video successfully..."))

    }else{
        const unlike = await Like.deleteOne({
            video: videoId,
            likedBy
        })

        return res
        .status(200)
        .json(new ApiResponse(200, unlike, "Unliked video successfully..."))
    }

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

    const likedBy = req.user._id;
    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment id")
    }

    const commentLike = await Like.findOne({
        comment: commentId,
        likedBy
    })
    
    if(!commentLike){
        const like = await Like.create({
            comment: commentId,
            likedBy
        })

        return res
        .status(201)
        .json(new ApiResponse(201, like, "Liked comment successfully..."))
    }else{
        const unlike = await Like.deleteOne({
            comment: commentId,
            likedBy
        })

        return res
        .status(200)
        .json(new ApiResponse(200, unlike, "Unliked comment successfully..."))
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet

    const likedBy = req.user._id;

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet id")
    }

    const tweetLike = await Like.findOne({
        tweet : tweetId,
        likedBy
    })

    if(!tweetLike){
        const like = await Like.create({
            tweet: tweetId,
            likedBy
        })

        return res
        .status(201)
        .json(new ApiResponse(201, like, "Liked tweet successfully..."))
    }else{
        const unlike = await Like.deleteOne({
            tweet: tweetId,
            likedBy
        })

        return res
        .status(200)
        .json(new ApiResponse(200, unlike, "Unliked tweet successfully..."))
    }

}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    const videos = await Like.find({ likedBy: req.user._id }).populate("video").sort({ createdAt: -1 });

    return res
    .status(200)
    .json(new ApiResponse(200, videos, "Liked videos fetched successfully..."))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}
