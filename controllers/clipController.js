// controllers/clipController.js
const Clip = require("../models/Clip");
const { asyncHandler } = require("../utils/asyncHandler");

// @desc    Create new clip
// @route   POST /api/clips
// @access  Private
exports.createClip = asyncHandler(async (req, res) => {
  const { title, content, url, tags } = req.body;

  // Add the authenticated user's ID to the clip data
  const clipData = {
    title,
    content,
    url,
    tags,
    user: req.user.id,
  };

  const newClip = await Clip.create(clipData);

  res.status(201).json({
    success: true,
    data: newClip,
    message: "Clip created successfully",
  });
});

// @desc    Get all clips for logged in user
// @route   GET /api/clips
// @access  Private
exports.getClips = asyncHandler(async (req, res) => {
  let query = { user: req.user.id };

  // Search functionality
  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }

  // Filter by tags
  if (req.query.tag) {
    query.tags = req.query.tag;
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Clip.countDocuments(query);

  const clips = await Clip.find(query)
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: clips.length,
    pagination,
    data: clips,
  });
});

// @desc    Get single clip
// @route   GET /api/clips/:id
// @access  Private
exports.getClip = asyncHandler(async (req, res) => {
  const clip = await Clip.findById(req.params.id);

  if (!clip) {
    return res.status(404).json({
      success: false,
      message: "Clip not found",
    });
  }

  // Make sure user owns clip
  if (clip.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this clip",
    });
  }

  res.status(200).json({
    success: true,
    data: clip,
  });
});

// @desc    Update clip
// @route   PUT /api/clips/:id
// @access  Private
exports.updateClip = asyncHandler(async (req, res) => {
  let clip = await Clip.findById(req.params.id);

  if (!clip) {
    return res.status(404).json({
      success: false,
      message: "Clip not found",
    });
  }

  // Make sure user owns clip
  if (clip.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to update this clip",
    });
  }

  clip = await Clip.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: clip,
  });
});

// @desc    Delete clip
// @route   DELETE /api/clips/:id
// @access  Private
exports.deleteClip = asyncHandler(async (req, res) => {
  const clip = await Clip.findById(req.params.id);

  if (!clip) {
    return res.status(404).json({
      success: false,
      message: "Clip not found",
    });
  }

  // Make sure user owns clip
  if (clip.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to delete this clip",
    });
  }

  await clip.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
