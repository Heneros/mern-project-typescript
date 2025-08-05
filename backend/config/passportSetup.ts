import 'dotenv/config';
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
// import GoogleStrategy from 'passport-google-oauth20';
import User from '../models/userModel';
import { systemLogs } from '@/utils/Logger';

const domainURL = process.env.DOMAIN;
const googleCallbackURL = process.env.GOOGLE_CALLBACK_URL;

const oauthPassport = () => {
    passport.serializeUser((user: any, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });

    if (process.env.NODE_ENV !== 'test') {
        passport.use(
            new GoogleStrategy(
                {
                    clientID: process.env.GOOGLE_CLIENT_ID!,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
                    callbackURL: `${domainURL}/api/v1/${googleCallbackURL}`,
                },
                async (
                    accessToken: string,
                    refreshToken: string,
                    profile: Profile,
                    done: (error: any, user?: any) => void,
                ) => {
                    try {
                        User.findOne({ googleID: profile.id }).then((user) => {
                            if (!user) {
                                const fullName = profile.displayName
                                    .trim()
                                    .split(' ');
                                const firstName = fullName.shift();
                                const lastName =
                                    fullName.length > 0
                                        ? fullName.join(' ')
                                        : 'Noname ';

                                User.create({
                                    username: profile._json.given_name,
                                    firstName,
                                    lastName,
                                    avatar: profile._json.picture,
                                    email: profile._json.email,
                                    googleID: profile.id,
                                    isEmailVerified:
                                        profile._json.email_verified,
                                    provider: 'google',
                                })
                                    .then((user) => {
                                        done(null, user);
                                    })
                                    .catch((err) => done(err, false));
                            } else {
                                done(null, user);
                            }
                        });
                    } catch (err) {
                        done(err);
                        systemLogs.error(`error google ${err}`);
                        console.log(err);
                    }
                },
            ),
        );

        passport.use(
            new GitHubStrategy(
                {
                    clientID: process.env.GITHUB_CLIENT_ID!,
                    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
                    callbackURL: process.env.GITHUB_CALLBACK_URL!,
                },
                async (
                    accessToken: string,
                    refreshToken: string,
                    profile: Profile,
                    done: (error: any, user?: any) => void,
                ) => {
                    try {
                        const existingUser = await User.findOne({
                            githubId: profile.id,
                        });
                        if (existingUser) {
                            return done(null, existingUser);
                        }
                        const fullName = profile.displayName.trim().split(' ');
                        const firstName = fullName.shift();
                        const lastName =
                            fullName.length > 0
                                ? fullName.join(' ')
                                : ' No Name';
                        //   console.log({profile});
                        const newUser = new User({
                            githubId: profile.id,
                            username: profile.username,
                            firstName,
                            lastName,
                            avatar: profile._json.picture,
                            email: profile._json.email
                                ? profile._json.email
                                : `${profile.username}email@${profile.id}temp.com`,
                            isEmailVerified: true,
                            provider: 'github',
                        });
                        await newUser.save();
                        done(null, newUser);
                    } catch (error) {
                        done(error);
                        systemLogs.error(`error github ${error}`);
                    }
                },
            ),
        );
    }
};

export default oauthPassport;
