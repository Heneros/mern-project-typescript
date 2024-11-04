import 'dotenv/config';
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
// import GoogleStrategy from 'passport-google-oauth20';
import User from '../models/userModel';

const domainURL = process.env.DOMAIN;
const googleCallbackURL = process.env.GOOGLE_CALLBACK_URL;

const googleAuth = () => {
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
                                isEmailVerified: profile._json.email_verified,
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
                    console.log(err);
                }
            },
        ),
    );
};

export default googleAuth;
