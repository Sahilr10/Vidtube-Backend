import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist
    if(!name) {
        throw new ApiError(400, "Playlist name is required")
    }

    if(!description) {
        throw new ApiError(400, "Playlist description is required")
    }

    const playlist = await Playlist.create({
        name,
        description,
        videos: [],
        owner: req.user._id
    })

    return res
        .status(201)
        .json(new ApiResponse(201, "Playlist created successfully", playlist))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    if(!userId || !isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID")
    }

    const playlists = await Playlist.find({owner: userId})
        // .populate("owner", "name _id")
        // .populate("videos", "title _id")
        .sort({ createdAt: -1 });

    if(!playlists || playlists.length === 0) {
        return res
            .status(404)
            .json(new ApiResponse(404, "No playlists found for this user"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "User playlists fetched successfully", playlists));

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(!playlistId || !isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }

    const playlist = await Playlist.findById(playlistId)
        .populate("owner", "name _id")
        .populate("videos", "title _id")
        .sort({ createdAt: -1 });

    if(!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Playlist fetched successfully", playlist));
    
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if(!(playlistId && videoId)) {
        throw new ApiError(400, "Playlist ID and Video ID are required");
    }

    const playlist = await Playlist.findById(playlistId);
    if(!playlist) {
        throw new ApiError(404, "Playlist not found");
    }


    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $addToSet: { videos: videoId } }, // Use $addToSet to avoid duplicates
        { new: true, runValidators: true }
    ).populate("videos", "_id title description")

    if(!updatedPlaylist) {
        throw new ApiError(404, "Failed to add video to playlist");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Video added to playlist successfully", updatedPlaylist));
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if(!(playlistId && videoId)) {
        throw new ApiError(400, "Playlist ID and Video ID are required");
    }

    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist ID or video ID");
    }

    const playlist = await Playlist.findById(playlistId);
    if(!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    { $pull: { videos: videoId } },
    { new: true }
    );

    if(!updatedPlaylist) {
        throw new ApiError(404, "Failed to remove video from playlist");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Video removed from playlist successfully", updatedPlaylist));
    
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    if(!playlistId || !isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);

    if(!deletedPlaylist) {
        throw new ApiError(404, "Playlist not found ");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, "Playlist deleted successfully", deletedPlaylist));
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if(!playlistId || !isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    if(!name && !description) {
        throw new ApiError(400, "At least one field (name or description) is required to update the playlist");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name: name || undefined,
                description: description || undefined
            }
        },
        {
            new: true,
            runValidators: true
        }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, "Playlist updated successfully", updatedPlaylist))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}