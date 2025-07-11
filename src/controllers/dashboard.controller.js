import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const {channelId} = req.params;
    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id");
    }

    const totalVideos = await Video.countDocuments({ owner: channelId });

    const videoViewsAggregation = await Video.aggregate([
  { $match: { owner: new mongoose.Types.ObjectId(channelId) } },
  { $group: { _id: null, totalViews: { $sum: "$views" } } }
]);
const totalVideoViews = videoViewsAggregation[0]?.totalViews || 0;

    const totalLikes = await Like.countDocuments({ likedBy: channelId})

    const totalSubscribers = await Subscription.countDocuments({ channel: channelId })

    return res
    .status(200)
    .json(new ApiResponse(200, {
        totalVideos,
        totalVideoViews,
        totalLikes,
        totalSubscribers
    }, "Channel stats fetched successfully..."))
    
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const {channelId} = req.params;
    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id");
    }

    const videos = await Video.find({ owner: channelId })

    return res
    .status(200)
    .json(new ApiResponse(200, videos, "Channel videos fetched successfully..."))
})

export {
    getChannelStats, 
    getChannelVideos
    }