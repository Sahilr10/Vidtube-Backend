import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const videoComments = await Comment.aggregate([
        {
            $match: {
                comments : new mongoose.Types.ObjectId(videoId)
            }
        },
        { $skip: skip },
        { $limit: parseInt(limit) }
    ])

    return res
    .status(200)
    .json(new ApiResponse(200, videoComments, "Video comments fetched successfully..."))
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params;
    const { content } = req.body;

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Content is required");
    }

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id");
    }   

    const comment = await Comment.create({
        video: videoId,
        owner: req.user._id,
        content
    })
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params;
    const { content } = req.body;
    if (!content || content.trim() === "") {
        throw new ApiError(400, "Content is required");
    }

    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id");
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            content
        },
        {
            new: true,
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated successfully..."))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params;
    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id");
    }   
    const deletedComment = await Comment.findByIdAndDelete(commentId);
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }