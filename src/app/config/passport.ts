import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import config from ".";
import { User } from "../modules/user/user.model";
import { ERole, IUser } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const existUser = (await User.findOne({ email })) as IUser;
        if (!existUser) {
          return done(null, false, { message: "User is not Exists" });
        }

        const isGoogleAuthenticated = existUser.auths.some(
          (x) => x.provider === "google"
        );
        console.log(isGoogleAuthenticated);
        if (isGoogleAuthenticated && !existUser.password) {
          return done(null, false, {
            message:
              "Please Do Google Login to Login or set a password for Credintial Login",
          });
        }

        const matchedPassword = await bcrypt.compare(
          password as string,
          existUser!.password as string
        );
        if (!matchedPassword) {
          return done(null, false, { message: "User Password Does not match" });
        }
        return done(null, existUser);
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID as string,
      clientSecret: config.GOOGLE_CLIENT_SECRET as string,
      callbackURL: config.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(null, false, { message: "No Email Found" });
        }
        let user = await User.findOne({ email });
        console.log(user);
        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: ERole.USER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });

          return done(null, user);
        }
      } catch (err) {
        console.log(`Google Error:- ${err}`);
        return done(err);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
