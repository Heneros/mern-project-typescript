import express, { Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import User from '@/models/userModel';
import { RequestWithUser } from '@/types/RequestWithUser';

const domain = process.env.DOMAIN;

const handleOAuthCallback = async (req: Request, res: Response) => {
    const userReq = req as RequestWithUser;

    try {
        if (!userReq.user) {
            return res.redirect(
                'http://localhost:3000/login?error=auth_failed',
            );
        }

        const existingUser = await User.findById(userReq.user.id);

        if (!existingUser) {
            return res.redirect(
                'http://localhost:3000/login?error=user_not_found',
            );
        }

        const payload = {
            id: userReq.user.id,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName || 'Name',
            username: existingUser.username,
            provider: existingUser.provider,
            avatar: existingUser.avatar,
        };

        jwt.sign(
            payload,
            process.env.JWT_ACCESS_SECRET_KEY!,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Error generating token');
                }

                const jwtToken = `${token}`;

                const embedJWT = `
                    <html>
                    <script>
                        window.localStorage.setItem("googleToken", '${jwtToken}');
                        window.location.href= "${domain}";
                    </script>
                    </html>
                `;
                res.send(embedJWT);
            },
        );
    } catch (error) {
        console.error('OAuth callback error:', error);
        res.status(500).send({ message: 'Authentication failed' });
    }
};

export default handleOAuthCallback;
