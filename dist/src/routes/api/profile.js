"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const Profiles_1 = __importDefault(require("../../models/Profiles"));
const User_1 = __importDefault(require("../../models/User"));
const router = (0, express_1.Router)();
// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get("/me", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profile = yield Profiles_1.default.findOne({
            user: req.userId,
        }).populate("user", ["avatar", "email"]);
        if (!profile) {
            return res.status(http_status_codes_1.default.BAD_REQUEST).json({
                errors: [
                    {
                        msg: "There is no profile for this user",
                    },
                ],
            });
        }
        res.json(profile);
    }
    catch (err) {
        console.error(err.message);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send("Server Error");
    }
}));
// @route   POST api/profile
// @desc    Create or update user's profile
// @access  Private
router.post("/", [
    auth_1.default,
    (0, express_validator_1.check)("firstName", "First Name is required").not().isEmpty(),
    (0, express_validator_1.check)("lastName", "Last Name is required").not().isEmpty(),
    (0, express_validator_1.check)("username", "Username is required").not().isEmpty(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res
            .status(http_status_codes_1.default.BAD_REQUEST)
            .json({ errors: errors.array() });
    }
    const { firstName, lastName, username } = req.body;
    // Build profile object based on TProfile
    const profileFields = {
        user: req.userId,
        firstName,
        lastName,
        username,
    };
    try {
        let user = yield User_1.default.findOne({ _id: req.userId });
        if (!user) {
            return res.status(http_status_codes_1.default.BAD_REQUEST).json({
                errors: [
                    {
                        msg: "User not registered",
                    },
                ],
            });
        }
        let profile = yield Profiles_1.default.findOne({ user: req.userId });
        if (profile) {
            // Update
            profile = yield Profiles_1.default.findOneAndUpdate({ user: req.userId }, { $set: profileFields }, { new: true });
            return res.json(profile);
        }
        // Create
        profile = new Profiles_1.default(profileFields);
        yield profile.save();
        res.json(profile);
    }
    catch (err) {
        console.error(err.message);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send("Server Error");
    }
}));
// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profiles = yield Profiles_1.default.find().populate("user", [
            "avatar",
            "email",
        ]);
        res.json(profiles);
    }
    catch (err) {
        console.error(err.message);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send("Server Error");
    }
}));
// @route   GET api/profile/user/:userId
// @desc    Get profile by userId
// @access  Public
router.get("/user/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profile = yield Profiles_1.default.findOne({
            user: req.params.userId,
        }).populate("user", ["avatar", "email"]);
        if (!profile)
            return res
                .status(http_status_codes_1.default.BAD_REQUEST)
                .json({ msg: "Profile not found" });
        res.json(profile);
    }
    catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res
                .status(http_status_codes_1.default.BAD_REQUEST)
                .json({ msg: "Profile not found" });
        }
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send("Server Error");
    }
}));
// @route   DELETE api/profile
// @desc    Delete profile and user
// @access  Private
router.delete("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Remove profile
        yield Profiles_1.default.findOneAndRemove({ user: req.userId });
        // Remove user
        yield User_1.default.findOneAndRemove({ _id: req.userId });
        res.json({ msg: "User removed" });
    }
    catch (err) {
        console.error(err.message);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send("Server Error");
    }
}));
exports.default = router;
//# sourceMappingURL=profile.js.map