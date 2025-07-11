import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    const subscriberId = req.user._id;
    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel id")
    }
    if(subscriberId === channelId){
        throw new ApiError(400, "You cannot subscribe to your own channel")
    }
    const channel = await User.findById(channelId);
    if(!channel){
        throw new ApiError(404, "Channel not found")
    }
    const subscription = await Subscription.findOne({
        channel: channelId,
        subscriber: subscriberId
    });

    if(subscription){
        const unsubscribe = await Subscription.deleteOne({
            channel: channelId,
            subscriber: subscriberId
        });

        return res
        .status(200)
        .json(new ApiResponse(200, null, "Unsubscribed successfully..."))

    }else{
        const subscribe = await Subscription.create({
            channel: channelId,
            subscriber: subscriberId
        })

        return res
        .status(201)
        .json(new ApiResponse(201, subscribe, "Subscribed successfully..."))
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel id")
    }

    const channel = await User.findById(channelId);
    if(!channel){
        throw new ApiError(404, "Channel not found")
    }

    const subscribers = await Subscription.findById({channel: channelId}).select("subscriber","-password -refreshToken")

    return res
    .status(200)
    .json(new ApiResponse(200, subscribers, "Subscribers fetched successfully..."))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400, "Invalid subscriber id")
    }

    const subscriber = await User.findById(subscriberId);
    if(!subscriber){
        throw new ApiError(404, "Subscriber not found")
    }

    const subscriptions = await Subscription.find({subscriber: subscriberId}).select("channel","-password -refreshToken")

    return res
    .status(200)
    .json(new ApiResponse(200, subscriptions, "Subscribed channels fetched successfully..."))

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}