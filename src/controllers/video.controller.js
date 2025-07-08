import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination



    const sortOrder = sortType === "asc" ? 1 : -1;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build match object dynamically
    const match = {};
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        match.owner = new mongoose.Types.ObjectId(userId);
    }
    if (query) {
        match.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ];
    }

    const videos = await Video.aggregate([
        { $match: match },
        { $sort: { [sortBy]: sortOrder } },
        { $skip: skip },
        { $limit: parseInt(limit) }
    ]);

    return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully..."))
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video

    if(
        [title, description].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required");
    }

    const videoLocalPath = req.files?.videoFile[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

    if(!videoLocalPath){
        throw new ApiError(400, "Video is required!!")
    }

    if(!thumbnailLocalPath){
        throw new ApiError(400, "Thumbnail is required!!")
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if(!videoFile) {
        throw new ApiError(500, "Video upload failed")
    }

    if(!thumbnail) {
        throw new ApiError(500, "Thumbnail upload failed")
    }

    const newVideo = await Video.create({
        title,
        description,
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        duration: videoFile.duration,
        owner: req.user._id
    })

    return res
    .status(201)
    .json( new ApiResponse(200, "Video uploaded successfully..."))
    
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    const video = await Video.findById(videoId);

    if(!video) {
        throw new ApiError(404, "Video not found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully..."))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const { title, description} = req.body;
    const thumbnailLocalPath = req.file?.path;

    const video = await Video.findById(videoId);

    if(!video) {
        throw new ApiError(404, "Video not found");
    }

     if(!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail not found!!")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if(!thumbnail) {
        throw new ApiError(500, "Thumbnail upload failed")
    }

    const updateVideoDetails = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title,
                description,
                thumbnail: thumbnail.url
            }
        },
        {
            new: true,
            runValidators: true
        }
    )

     try{
        await unlinkFile(thumbnailLocalPath)
    }catch (err) {
        console.error("Error deleting thumbnail file:", err.message);

    }

    return res
    .status(200)
    .json(new ApiResponse(200, updateVideoDetails, "Video details updated successfully..."))

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    const deletedVideoFile = await Video.findByIdAndDelete(videoId);

    if(!deletedVideoFile) {
        throw new ApiError(404, "Video not found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, deletedVideoFile, "Video deleted Successfully..."))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const video = await Video.findById(videoId);

    if(!video) {
        throw new ApiError(404, "Video not found");
    }

    const publishStatus = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                isPublished: !video.isPublished
            }
        },
        {
            new: true,
            runValidators: true
        }
    )
    return res
    .status(200)
    .json(new ApiResponse(200, publishStatus, "Video publish status toggled successfully..."))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}