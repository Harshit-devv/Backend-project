import { asynchandler } from "../utils/asynchandler.js"
import {apiError} from "../utils/apiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";


const registerUser = asynchandler( async (req, res) => {
    // Get the user details from frontend
    // Check all the validations (before creating the account)
    // Check if user already exists or not
    // Check for images, Check for avatar
    // Upload them to cloudinary, avatar
    // Create user object - create new entry in database
    // Remove password and refresh token field from response
    // Check for user creation
    // Return response 

    const {fullname, email, username, password} =  req.body
    console.log("email :", email);
    console.log(req.body);
    if (
        [fullname, email, username, password].some((field) => 
            field?.trim() === "")
    ) {
        throw new apiError(400, "All fields are required");
    }
    const existedUser = User.findOne({
        $or: [{username}, {email}]
    })
    
    if (existedUser) {
        throw new apiError(409, "User with email or username already existed");
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalpath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar is required");
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalpath);

    if (!avatar) {
        throw new apiError(400, "Avatar is required");
    }
    const user = awaitUser.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" 
    )
    if (!createdUser) {
        throw new apiError(500, "Something went wrong while registering the user");
    }
    return res.status(201).json(
        new apiResponse(200, createdUser, "User registered successfully");
    )
})

export {registerUser};